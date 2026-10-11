import type { Grammer, Rule } from "./grammer";

export type ChomskyType = 0 | 1 | 2 | 3;

export type Rulechecked = {
    rule: Rule;
    leftside: string[];
    rightside: string [];
    types: ChomskyType[];
    needsKEScheck: boolean;
    context?: { u1: string[]; A: string; u2: string[]; v: string[] };  
}

export function tokenize(g: Grammer, text: string): string[] | null {
  if (text === "" || text === "ε") {
    return [];
  }
  const symbols = [...g.nonterminals, ...g.terminals].sort((a, b) => b.length - a.length);

  const result: string[] = [];
  let pos = 0;

  while (pos < text.length) {
    const ch = text[pos];
    if (ch === " ") {
      pos++;
      continue;
    }
    let matched = false;
    for (const symbol of symbols) {
      if (text.startsWith(symbol, pos)) {
        result.push(symbol);
        pos += symbol.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      return null;
    }
  }
  return result;
} 

export type ChomskyResult =
  | { ok: false; message: string }
  | {
      ok: true;
      rules: Rulechecked[];
      kes: { hasStartEpsilon: boolean; violatingRules: Rule[] };
      types: ChomskyType[];
    };

export function classifyGrammer(g: Grammer): ChomskyResult {

    for (const rule of g.rules) {
      const left = tokenize(g, rule.from);
      const right = tokenize(g, rule.to);

      if (left === null || right === null) {
        return {
          ok: false,
          message: `Ismeretlen szimbólum a(z) "${rule.from} → ${rule.to}" szabályban.`,
        };
      }
      const hasNonterminal = left.some(symbol => g.nonterminals.includes(symbol));
      if (!hasNonterminal) {
          return {
            ok: false,
            message: `A(z) "${rule.from} → ${rule.to}" szabály bal oldalán nincs nemterminális.`,
          };
      }
    }
    const checkedRules: Rulechecked[] = [];

    for (const rule of g.rules) {
        checkedRules.push(checkOneRule(rule, g));
    }
    const ALL_TYPES: ChomskyType[] = [0, 1, 2, 3];

    let commonTypes = ALL_TYPES.filter(type =>
        checkedRules.every(rule => rule.types.includes(type))
    );

    const hasStartEpsilon = g.rules.some(rule =>
    rule.from === g.start && (rule.to === "" || rule.to === "ε"));

    const violatingRules = hasStartEpsilon? g.rules.filter(rule => {
          const right = tokenize(g, rule.to);
          return right?.includes(g.start);
        })
      : [];

    if (hasStartEpsilon && violatingRules.length > 0) {
        commonTypes = commonTypes.filter(type => type !== 1);
    }

    return {
        ok: true,
        rules: checkedRules,
        kes: {
            hasStartEpsilon,
            violatingRules,
        },
        types: commonTypes,
    };
}




export function checkOneRule (rule: Rule, g :Grammer): Rulechecked{
  const leftside = tokenize(g, rule.from);
  const rightside = tokenize(g, rule.to);

  if (leftside === null || rightside === null) {
    throw new Error("Invalid grammar rule");
  }
  const types: ChomskyType[] = [0];
  let context: Rulechecked["context"] | undefined;
  let needsKEScheck = false;
  
  if (leftside.length === 1){
    types.push(2)
    const nonterminals = rightside.filter(s => g.nonterminals.includes(s));
    if ( nonterminals.length === 0 || ( nonterminals.length === 1 && g.nonterminals.includes( rightside[rightside.length - 1] )))
    {
      types.push(3)
    }
  }

  if (
    rule.from === g.start &&
    (rule.to === "" || rule.to === "ε")
  ) {
      types.push(1);
      needsKEScheck = true;
  }

else {
  for (let i = 0; i < leftside.length; i++) {

    if (!g.nonterminals.includes(leftside[i])) {
        continue;
    }
    const u1 = leftside.slice(0, i);
    const A = leftside[i];
    const u2 = leftside.slice(i + 1);
    const startsWithU1 =
        rightside.slice(0, u1.length).join('')===u1.join('');

    const endsWithU2 =rightside.slice(rightside.length - u2.length).join('')===u2.join('');

    const hasNonEmptyV = rightside.length >= u1.length + u2.length + 1;

    if (startsWithU1 && endsWithU2 && hasNonEmptyV) {
        const v = rightside.slice(u1.length, rightside.length - u2.length);
        types.push(1);
       context = { u1,A,u2, v};
        break;
    }
}}
return {
    rule,
    leftside,
    rightside,
    types,
    needsKEScheck,
    context,
};
}

