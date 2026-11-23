import { useEffect, useState } from "react";
import {
  OUTPUT_SYMBOL,
  classify,
  clauseToString,
  dnfFromTable,
  formulaToString,
  knfFromTable,
  parseFormula,
  type Formula,
  type TruthTable,
} from "@fotoc/automata-core";
import { call } from "../useCore";
import { FormulaInput } from "./FormulaInput";
import { PlayerControls } from "./PlayerControls";
import { usePlayer } from "./usePlayer";

type Step = { kind: "tree" } | { kind: "column"; column: number } | { kind: "done" };
type Reading = "none" | "dnf" | "knf";

const showValue = (value: boolean) => (value ? "i" : "h");

export function FormulaLab() {
  const [source, setSource] = useState("y -> x & ~y | ~z");
  const parsed = parseFormula(source);

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-[min(100vw,80rem)] px-4 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="lg:w-[32rem] lg:shrink-0">
          <FormulaInput label="Formula (¬ ~ !, ∧ &, ∨ |, → ->)" value={source} onChange={setSource} />
        </div>
        {parsed.ok && (
          <div className="min-w-0 flex-1">
            <FormulaPlayer key={formulaToString(parsed.formula)} formula={parsed.formula} />
          </div>
        )}
      </div>
    </div>
  );
}

function FormulaPlayer({ formula }: { formula: Formula }) {
  const [table, setTable] = useState<TruthTable | null>(null);
  useEffect(() => {
    setTable(null);
    call<TruthTable>("truthTable", formula).then(setTable);
  }, [formula]);

  const steps: Step[] = table
    ? [{ kind: "tree" }, ...table.columns.map((_, column) => ({ kind: "column" as const, column })), { kind: "done" }]
    : [{ kind: "tree" }];
  const player = usePlayer(steps.length);
  const [reading, setReading] = useState<Reading>("none");

  if (!table)
    return (
      <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md text-center text-sm text-gray-500 dark:text-slate-500">Számítás…</div>
    );

  const step = steps[player.index];

  let filled = table.columns.length;
  if (step.kind === "tree") filled = 0;
  if (step.kind === "column") filled = step.column + 1;
  const current = step.kind === "column" ? table.columns[step.column] : step.kind === "tree" ? formula : null;

  return (
    <div
      className="space-y-6 rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      tabIndex={0}
      onKeyDown={player.onKeyDown}
    >
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">Szerkezeti fa</p>
        <SyntaxTree formula={formula} highlighted={current ? formulaToString(current) : null} />
      </div>

      <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 p-4 text-sm text-gray-700 dark:text-slate-700">
        {step.kind === "tree" && <TreeExplanation formula={formula} />}
        {step.kind === "column" && <ColumnExplanation column={table.columns[step.column]} />}
        {step.kind === "done" && <DoneExplanation table={table} />}
      </div>

      {step.kind === "done" && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="self-center text-gray-600">Leolvasás:</span>
          {(["none", "dnf", "knf"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setReading(option)}
              className={
                "rounded-xl border px-4 py-2 text-sm font-semibold transition-all " +
                (reading === option
                  ? "border-purple-600 bg-purple-600 text-white shadow-md"
                  : "border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 text-gray-700 dark:text-slate-700 hover:bg-purple-50 dark:hover:bg-purple-900/20")
              }
            >
              {option === "none" ? "nincs" : option === "dnf" ? "DNF (igaz sorok)" : "KNF (hamis sorok)"}
            </button>
          ))}
        </div>
      )}

      <TruthTableView
        table={table}
        filled={filled}
        current={step.kind === "column" ? step.column : null}
        reading={step.kind === "done" ? reading : "none"}
      />

      {step.kind === "done" && reading !== "none" && <ReadingResult table={table} reading={reading} />}

      <PlayerControls player={player} />
    </div>
  );
}

type Placed = { formula: Formula; x: number; depth: number; children: Placed[] };

function place(formula: Formula, depth: number, leaves: { next: number }): Placed {
  if (formula.kind === "var") {
    return { formula, x: leaves.next++, depth, children: [] };
  }
  if (formula.kind === "not") {
    const child = place(formula.arg, depth + 1, leaves);
    return { formula, x: child.x, depth, children: [child] };
  }
  const left = place(formula.left, depth + 1, leaves);
  const right = place(formula.right, depth + 1, leaves);
  return { formula, x: (left.x + right.x) / 2, depth, children: [left, right] };
}

function flatten(node: Placed): Placed[] {
  return [node, ...node.children.flatMap(flatten)];
}

const GAP_X = 52;
const GAP_Y = 56;
const RADIUS = 17;

function nodeLabel(formula: Formula): string {
  if (formula.kind === "var") return formula.name;
  if (formula.kind === "not") return "¬";
  return OUTPUT_SYMBOL[formula.kind];
}

function SyntaxTree({ formula, highlighted }: { formula: Formula; highlighted: string | null }) {
  const leaves = { next: 0 };
  const root = place(formula, 0, leaves);
  const nodes = flatten(root);
  const depth = Math.max(...nodes.map((node) => node.depth));
  const px = (node: Placed) => node.x * GAP_X + GAP_X / 2;
  const py = (node: Placed) => node.depth * GAP_Y + RADIUS + 4;

  return (
    <div className="overflow-x-auto rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-4">
      <svg width={leaves.next * GAP_X} height={depth * GAP_Y + 2 * RADIUS + 8} className="mx-auto block">
        {nodes.flatMap((node) =>
          node.children.map((child, i) => (
            <line
              key={`${formulaToString(node.formula)}-${i}-${px(child)}`}
              x1={px(node)}
              y1={py(node)}
              x2={px(child)}
              y2={py(child)}
              className="stroke-gray-400"
              strokeWidth={1.5}
            />
          )),
        )}
        {nodes.map((node, i) => {
          const isOn = highlighted !== null && formulaToString(node.formula) === highlighted;
          return (
            <g key={i}>
              <title>{formulaToString(node.formula)}</title>
              <circle
                cx={px(node)}
                cy={py(node)}
                r={RADIUS}
                className={isOn ? "fill-purple-100 stroke-purple-600" : "fill-white stroke-gray-400"}
                strokeWidth={isOn ? 2.5 : 1.5}
              />
              <text
                x={px(node)}
                y={py(node)}
                textAnchor="middle"
                dominantBaseline="central"
                className={`font-mono text-sm ${isOn ? "fill-purple-700 font-bold" : "fill-gray-800"}`}
              >
                {nodeLabel(node.formula)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TreeExplanation({ formula }: { formula: Formula }) {
  if (formula.kind === "var") {
    return <p>A formula egyetlen változó, az igazságtáblája egyszerűen a változó értéke.</p>;
  }
  return (
    <>
      <p className="font-semibold">
        A fő logikai összekötő: <span className="font-mono">{nodeLabel(formula)}</span>
      </p>
      <p className="mt-1">
        Ez a fa gyökere, ezt értékeljük ki utoljára. A táblázatban minden részformula külön oszlopot kap, és a fa
        aljától a gyökér felé haladva töltjük ki őket.
      </p>
    </>
  );
}

const RULES: Record<Exclude<Formula["kind"], "var">, string> = {
  not: "ott igaz, ahol a részformula hamis.",
  and: "csak akkor igaz, ha mindkét oldala igaz.",
  or: "akkor igaz, ha legalább az egyik oldala igaz.",
  imp: "csak akkor hamis, ha az előtag igaz és az utótag hamis.",
};

function ColumnExplanation({ column }: { column: Formula }) {
  if (column.kind === "var") return null;
  const parts = column.kind === "not" ? [column.arg] : [column.left, column.right];
  return (
    <>
      <p className="font-mono font-semibold">{formulaToString(column)}</p>
      <p className="mt-1">
        A(z) <span className="font-mono">{nodeLabel(column)}</span> {RULES[column.kind]} Felhasznált oszlop
        {parts.length > 1 ? "ok" : ""}: <span className="font-mono">{parts.map(formulaToString).join(", ")}</span>.
      </p>
    </>
  );
}

const VERDICT = {
  tautology: "Minden sorban igaz, tehát a formula tautológia (és persze kielégíthető).",
  satisfiable: "Van olyan sor, ahol igaz, tehát a formula kielégíthető, de nem tautológia.",
  unsatisfiable: "Egyik sorban sem igaz, tehát a formula kielégíthetetlen.",
};

function DoneExplanation({ table }: { table: TruthTable }) {
  return (
    <>
      <p className="font-semibold">Kész az igazságtábla!</p>
      <p className="mt-1">{VERDICT[classify(table)]}</p>
    </>
  );
}

function rowReading(table: TruthTable, row: TruthTable["rows"][number], reading: Reading): string | null {
  const result = row.values[row.values.length - 1] ?? row.assignment[table.variables[0]];
  if (reading === "dnf" && result) {
    return table.variables.map((name) => (row.assignment[name] ? name : `¬${name}`)).join(" ∧ ");
  }
  if (reading === "knf" && !result) {
    return table.variables.map((name) => (row.assignment[name] ? `¬${name}` : name)).join(" ∨ ");
  }
  return null;
}

function TruthTableView({
  table,
  filled,
  current,
  reading,
}: {
  table: TruthTable;
  filled: number;
  current: number | null;
  reading: Reading;
}) {
  const lastColumn = table.columns.length - 1;
  return (
    <div className="overflow-x-auto rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-4">
      <table className="w-full text-center font-mono text-sm">
        <thead>
          <tr className="bg-purple-50 dark:bg-purple-900/20">
            {table.variables.map((name) => (
              <th key={name} className="p-1">
                {name}
              </th>
            ))}
            {table.columns.map((column, i) => (
              <th
                key={i}
                className={
                  "whitespace-nowrap border-l p-1 " +
                  (i === current ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" : "") +
                  (i === lastColumn ? " border-l-2" : "")
                }
              >
                {formulaToString(column)}
              </th>
            ))}
            {reading !== "none" && <th className="border-l-2 p-1">{reading === "dnf" ? "konjunkció" : "klóz"}</th>}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => {
            const extra = rowReading(table, row, reading);
            let rowStyle = "border-t";
            if (extra !== null) rowStyle += reading === "dnf" ? " bg-green-50" : " bg-red-50";
            return (
              <tr key={r} className={rowStyle}>
                {table.variables.map((name) => (
                  <td key={name} className="p-1">
                    {showValue(row.assignment[name])}
                  </td>
                ))}
                {row.values.map((value, i) => (
                  <td
                    key={i}
                    className={
                      "border-l p-1 " +
                      (i === current ? "bg-purple-50 dark:bg-purple-900/20 font-semibold" : "") +
                      (i === lastColumn ? " border-l-2 font-semibold" : "")
                    }
                  >
                    {i < filled ? showValue(value) : ""}
                  </td>
                ))}
                {reading !== "none" && <td className="border-l-2 p-1 text-left">{extra ?? ""}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ReadingResult({ table, reading }: { table: TruthTable; reading: Exclude<Reading, "none"> }) {
  const parts = reading === "dnf" ? dnfFromTable(table) : knfFromTable(table);

  if (parts.length === 0) {
    return (
      <p className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-4 shadow-sm text-sm text-gray-700 dark:text-slate-700">
        {reading === "dnf"
          ? "Nincs igaz sor, így DNF-et nem tudunk felírni (a formula kielégíthetetlen)."
          : "Nincs hamis sor, így KNF-et nem tudunk felírni (a formula tautológia)."}
      </p>
    );
  }

  const text =
    reading === "dnf"
      ? parts.map((part) => `(${clauseToString(part, " ∧ ")})`).join(" ∨ ")
      : parts.map((part) => `(${clauseToString(part)})`).join(" ∧ ");

  return (
    <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-4 shadow-sm text-sm text-gray-700 dark:text-slate-700">
      <p>
        {reading === "dnf"
          ? "Minden igaz sorhoz egy elemi konjunkció: az igaz változók pozitívan, a hamisak negálva szerepelnek."
          : "Minden hamis sorhoz egy klóz: az igaz változók negálva, a hamisak pozitívan szerepelnek."}
      </p>
      <p className="mt-2 font-mono">
        {reading === "dnf" ? "DNF" : "KNF"}: {parts.length === 1 ? text.slice(1, -1) : text}
      </p>
    </div>
  );
}
