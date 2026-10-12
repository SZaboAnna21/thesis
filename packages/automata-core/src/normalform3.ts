import type { Grammer, Rule } from "./grammer";
import {  type ChomskyResult, classifyGrammer, tokenize } from "./chomsky.ts";

export type Nf3Phase =
  | "input"          // kiinduló grammatika
  | "length"         // 1. lépés: hosszredukció, egy hosszú szabály / lépés
  | "chain-closure"  // 2a: H(A) rétegenként
  | "chain-inherit"  // 2b: A örökli H(A) nem-lánc szabályait
  | "chain-remove"   // 2c: láncszabályok kidobása
  | "unreachable"    // elérhetetlen nemterminálisok jelölése
  | "done";

export type Nf3Step = {
  phase: Nf3Phase;
  title: string;
  explanation: string;
  grammar: Grammer;          // az állapot EZEN lépés UTÁN
  added: Rule[];             // ebben a lépésben került be
  removed: Rule[];           // ebben a lépésben esett ki
  focus?: Rule;              // éppen feldolgozott szabály
  highlight?: string[];      // kiemelt nemterminálisok (pl. H(A))
  newNonterminals?: string[];
  chainSets?: Record<string, string[][]>; // A -> [H0(A), H1(A), ...]
  unreachable?: string[];
};

export type Nf3Result =
  | { ok: false; message: string }
  | { ok: true; steps: Nf3Step[] };

export const showRule = (r: Rule) => `${r.from} → ${r.to || "ε"}`;

export function lengthReduction(g: Grammer): Grammer {
  const newrules :Rule[] = [];
  const newNonterminals: string[] = [];
  let extras = 1;
  let eName: string | null = null;

  function nextZ(): string {
    while (g.nonterminals.includes("Z" + extras)) {
      extras++;
    }
    const name = "Z" + extras;
    extras++;
    newNonterminals.push(name);
    return name;
  }

  for (const rule of g.rules ){
    const to = tokenize(g, rule.to);
    if (to === null) {
      newrules.push(rule);
      continue;
    }
    const last = to[to.length - 1];
    const endsWithNonterminal = to.length > 0 && g.nonterminals.includes(last);

    if ((to.length === 1 && endsWithNonterminal) || (to.length === 0) || (to.length === 2 && endsWithNonterminal && g.terminals.includes(to[0])))
    {
      newrules.push(rule)
    }
    else if (endsWithNonterminal){
      let currentFrom = rule.from;
      let currentTo = to;

      while (currentTo.length > 2) {

        const first = currentTo[0];
        const nextNonterminal = nextZ();

        newrules.push({from: currentFrom,
            to: first + nextNonterminal});

        currentFrom = nextNonterminal;
        currentTo = currentTo.slice(1);
        }
        newrules.push({
            from: currentFrom,
            to: currentTo.join("")});
    }
    else {
      if (eName === null) {
        eName = "E";
        let i = 1;
        while (g.nonterminals.includes(eName))
        {
          eName = "E" + i;
          i++;
        }
        newNonterminals.push(eName);
      }

      let currentFrom = rule.from;
      let currentTo = to;

      while (currentTo.length > 1) {
        const first = currentTo[0];
        const nextNonterminal = nextZ();

        newrules.push({
            from: currentFrom,
            to: first + nextNonterminal
        });

        currentFrom = nextNonterminal;
        currentTo = currentTo.slice(1);
      }

      newrules.push({
        from: currentFrom,
        to: currentTo.join("") + eName
      });
    }
  }
  if (eName !== null) {
    newrules.push({
      from: eName,
      to: ""
    });
  }

  return {
    ...g,
    nonterminals: [...g.nonterminals, ...newNonterminals],
    rules: newrules,
  };
}
export function chainLayers(g: Grammer, A: string): string[][] {
  let cont = true;
  let preLayer = [A];
  const returning: string[][] = []
  returning.push(preLayer) 
  while (cont){
    const newLayer = [...preLayer]
    for (const from of preLayer){
        for (const rule of g.rules){
          if(rule.from === from){
            if(g.nonterminals.includes(rule.to)){
              if (!newLayer.includes(rule.to)){
                newLayer.push(rule.to)
              }
            }
          }
        }
    }
    if(preLayer.length === newLayer.length){
      cont = false;
    }
    else{
      returning.push(newLayer);
      preLayer = newLayer
    }
  }
  return returning;
}

// 2. lépés, második fele: láncmentesítés.
// Minden A örökli azoknak a nem-lánc szabályait, akiket láncon elér (H(A)),
// a láncszabályokat (X → Y) pedig kidobjuk.
export function removeChains(g: Grammer): Grammer {
    const newrules :Rule[] = [];
    for (const A of g.nonterminals){
      const layers = chainLayers(g, A);
      const lastLayer = layers[layers.length - 1];
      for (const sym of lastLayer){
        for ( const rule of g.rules){
          if ( sym !== rule.from) continue;
          if (g.nonterminals.includes(rule.to)) continue;
          const already = newrules.some(r => r.from === A && r.to === rule.to)
          if (!already){
            newrules.push({from: A, to:rule.to})
          }
        }

      }
    }

  
  return {...g,rules: newrules,};
}

export function toNormalForm3Steps(g: Grammer): Nf3Result {
  const result: ChomskyResult = classifyGrammer(g);

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  if (!result.types.includes(3)) {
    return {
      ok: false,
      message: "A nyelvtan nem 3-as típusú, ezért nem hozható NF3 alakra.",
    };
  }

  const steps: Nf3Step[] = [];
  steps.push({
    phase: "input",
    title: "Kiinduló nyelvtan",
    explanation: "",
    grammar: g,
    added: [],
    removed: [],
  });

 const reduced = lengthReduction(g);
  const reducedNew = reduced.rules.filter(r => !g.rules.some(x => x.from === r.from && x.to === r.to ));
  const reducedRemoved = g.rules.filter(r => !reduced.rules.some(x => x.from === r.from && x.to === r.to  ));
  steps.push({
    phase: "length",
    title: "Hosszcsökkentés",
    explanation: "",
    grammar: reduced,
    added: reducedNew,
    removed: reducedRemoved,
  });
  for (const A of reduced.nonterminals){

    const layers = chainLayers(reduced, A);
    if (layers.length <= 1) {
      continue;}

    steps.push({
    phase: "chain-closure",
    title: `H(${A}) kiszámítása`,
    explanation: "",
    grammar: reduced,
    added: [],
    removed: [],
    highlight: [A],
    chainSets: {
      [A]: layers,
    },
  });
  }

const final = removeChains(reduced);
const addedRules = final.rules.filter(r => !reduced.rules.some( x => x.from === r.from && x.to === r.to));
const inheritedGrammar: Grammer = {...reduced, rules: [...reduced.rules, ...addedRules],};

steps.push({
  phase: "chain-inherit",
  title: "Szabályok öröklése",
  explanation: "",
  grammar: inheritedGrammar,
  added: addedRules,
  removed: [],
});

const removedRules = reduced.rules.filter(r => !final.rules.some(x => x.from === r.from && x.to === r.to ));

steps.push({
  phase: "chain-remove",
  title: "Láncszabályok eltávolítása",
  explanation: "",
  grammar: final,
  added: [],
  removed: removedRules,
});
steps.push({
  phase: "done",
  title: "Kész",
  explanation: "",
  grammar: final,
  added: [],
  removed: [],
});

  return {
    ok: true,
    steps,
  };
}
