export type Formula =
  | { kind: "var"; name: string }
  | { kind: "not"; arg: Formula }
  | { kind: "and" | "or" | "imp"; left: Formula; right: Formula };

export type BinaryKind = "and" | "or" | "imp";

export type FormulaParseError = {
  message: string;
  position: number;
};

export type FormulaParseResult =
  | { ok: true; formula: Formula }
  | { ok: false; error: FormulaParseError };

const NOT_SYMBL = ["¬", "~", "!"];
const SYMBL_MEANING: [string, BinaryKind][] = [
  ["->", "imp"],
  ["=>", "imp"],
  ["→", "imp"],
  ["∧", "and"],
  ["&", "and"],
  ["∨", "or"],
  ["|", "or"],
];

export const OUTPUT_SYMBOL: Record<BinaryKind, string> = { and: "∧", or: "∨", imp: "→" };
const PRECEDENCE: Record<Formula["kind"], number> = { var: 5, not: 4, and: 3, or: 2, imp: 1 };

export function parseFormula(source: string): FormulaParseResult {
  let pos = 0;

  class ParseFailure extends Error {
    readonly parseError: FormulaParseError;
    constructor(parseError: FormulaParseError) {
      super(parseError.message);
      this.parseError = parseError;
    }
  }

  const fail = (message: string, at: number = pos): never => {
    throw new ParseFailure({ message, position: at });
  };

  const skipSpaces = () => {
    while (pos < source.length && source[pos] === " ") {
      pos++;
    }
  };
  
  const peekBinary = (): BinaryKind | undefined => {
    skipSpaces();
    return SYMBL_MEANING.find(([token]) => source.startsWith(token, pos))?.[1];
  };

  const eatBinary = (kind: BinaryKind): boolean => {
    if (peekBinary() !== kind) return false;
    const token = SYMBL_MEANING.find(([t, k]) => k === kind && source.startsWith(t, pos))!;
    pos += token[0].length;
    return true;
  };

  const parseImp = (): Formula => {
    const left = parseOr();
    if (eatBinary("imp")) {
      return { kind: "imp", left, right: parseImp() };
    }
    return left;
  };

  const parseOr = (): Formula => {
    let left = parseAnd();
    while (eatBinary("or")) left = { kind: "or", left, right: parseAnd() };
    return left;
  };

  const parseAnd = (): Formula => {
    let left = parseUnary();
    while (eatBinary("and")) left = { kind: "and", left, right: parseUnary() };
    return left;
  };

  const parseUnary = (): Formula => {
    skipSpaces();
    const next = source[pos];
    if (next === undefined) return fail("Váratlanul véget ért a formula.");
    if (NOT_SYMBL.includes(next)) {
      pos++;
      return { kind: "not", arg: parseUnary() };
    }
    if (next === "(") {
      const open = pos++;
      const inner = parseImp();
      skipSpaces();
      if (source[pos] !== ")") fail("Hiányzik a bezáró zárójel.", open);
      pos++;
      return inner;
    }
    const name = /^[a-zA-Z][a-zA-Z0-9_]*/.exec(source.slice(pos))?.[0];
    if (name !== undefined) {
      pos += name.length;
      return { kind: "var", name };
    }
    if (peekBinary() !== undefined) return fail("A műveleti jel előtt hiányzik a formula.");
    if (next === ")") return fail("Nyitó pár nélküli bezáró zárójel.");
    return fail(`Ismeretlen karakter: „${next}”.`);
  };

  try {
    skipSpaces();
    if (pos === source.length) fail("Üres a formula.");
    const formula = parseImp();
    skipSpaces();
    if (pos < source.length) {
      fail(source[pos] === ")" ? "Nyitó pár nélküli bezáró zárójel." : `Váratlan karakter: „${source[pos]}”.`);
    }
    return { ok: true, formula };
  } catch (e) {
    if (e instanceof ParseFailure) return { ok: false, error: e.parseError };
    throw e;
  }
}

function needsParens(child: Formula, parent: BinaryKind, side: "left" | "right"): boolean {
  const childPrec = PRECEDENCE[child.kind];
  const parentPrec = PRECEDENCE[parent];
  if (childPrec !== parentPrec) return childPrec < parentPrec;
  return parent === "imp" ? side === "left" : side === "right";
}

export function formulaToString(formula: Formula): string {
  switch (formula.kind) {
    case "var":
      return formula.name;
    case "not":
      return formula.arg.kind === "var" || formula.arg.kind === "not"
        ? `¬${formulaToString(formula.arg)}`
        : `¬(${formulaToString(formula.arg)})`;
    default: {
      const show = (child: Formula, side: "left" | "right") =>
        needsParens(child, formula.kind, side) ? `(${formulaToString(child)})` : formulaToString(child);
      return `${show(formula.left, "left")} ${OUTPUT_SYMBOL[formula.kind]} ${show(formula.right, "right")}`;
    }
  }
}

export function variables(formula: Formula): string[] {
  const names: string[] = [];
  const walk = (f: Formula) => {
    if (f.kind === "var") {
      if (!names.includes(f.name)) names.push(f.name);
    } else if (f.kind === "not") {
      walk(f.arg);
    } else {
      walk(f.left);
      walk(f.right);
    }
  };
  walk(formula);
  return names;
}

function height(formula: Formula): number {
  if (formula.kind === "var") return 0;
  if (formula.kind === "not") return height(formula.arg) + 1;
  return Math.max(height(formula.left), height(formula.right)) + 1;
}

export function subformulas(formula: Formula): Formula[] {
  const found = new Map<string, Formula>();
  const walk = (f: Formula) => {
    if (f.kind === "var") return;
    if (f.kind === "not") walk(f.arg);
    else {
      walk(f.left);
      walk(f.right);
    }
    const key = formulaToString(f);
    if (!found.has(key)) found.set(key, f);
  };
  walk(formula);
  return [...found.values()].sort((a, b) => height(a) - height(b));
}

export type Assignment = Record<string, boolean>;

export function evaluate(formula: Formula, assignment: Assignment): boolean {
  switch (formula.kind) {
    case "var":
      return assignment[formula.name];
    case "not":
      return !evaluate(formula.arg, assignment);
    case "and":
      return evaluate(formula.left, assignment) && evaluate(formula.right, assignment);
    case "or":
      return evaluate(formula.left, assignment) || evaluate(formula.right, assignment);
    case "imp":
      return !evaluate(formula.left, assignment) || evaluate(formula.right, assignment);
  }
}

export type TruthRow = {
  assignment: Assignment;
  values: boolean[];
};

export type TruthTable = {
  variables: string[];
  columns: Formula[];
  rows: TruthRow[];
};

export function truthTable(formula: Formula): TruthTable {
  const names = variables(formula);
  const columns = subformulas(formula);
  const rows: TruthRow[] = [];
  for (let mask = 0; mask < 2 ** names.length; mask++) {
    const assignment: Assignment = {};
    names.forEach((name, i) => {
      assignment[name] = (mask & (1 << (names.length - 1 - i))) === 0;
    });
    rows.push({ assignment, values: columns.map((column) => evaluate(column, assignment)) });
  }
  return { variables: names, columns, rows };
}

export type Satisfiability = "tautology" | "satisfiable" | "unsatisfiable";

function rowResult(table: TruthTable, row: TruthRow): boolean {
  return row.values[row.values.length - 1] ?? row.assignment[table.variables[0]];
}

export function classify(table: TruthTable): Satisfiability {
  const results = table.rows.map((row) => rowResult(table, row));
  if (results.every(Boolean)) return "tautology";
  if (results.some(Boolean)) return "satisfiable";
  return "unsatisfiable";
}

export type Literal = { name: string; negated: boolean };
export type Clause = Literal[];

export function literalToString(literal: Literal): string {
  return literal.negated ? `¬${literal.name}` : literal.name;
}

export function clauseToString(clause: Clause, joiner = " ∨ "): string {
  return clause.length === 0 ? "□" : clause.map(literalToString).join(joiner);
}

function rowLiterals(table: TruthTable, row: TruthRow, negateTrue: boolean): Literal[] {
  return table.variables.map((name) => ({ name, negated: row.assignment[name] === negateTrue }));
}

export function dnfFromTable(table: TruthTable): Clause[] {
  return table.rows.filter((row) => rowResult(table, row)).map((row) => rowLiterals(table, row, false));
}

export function knfFromTable(table: TruthTable): Clause[] {
  return table.rows.filter((row) => !rowResult(table, row)).map((row) => rowLiterals(table, row, true));
}
