import type { Grammer, Rule } from "./grammer";
import { tokenize } from "./chomsky.ts";

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

// A lejátszó ezt hívja. Akkor írjuk meg, ha a három lépés külön-külön már működik.
export function toNormalForm3Steps(g: Grammer): Nf3Result {
  void g;
  return { ok: false, message: "A normálformára hozás még készül." };
}
