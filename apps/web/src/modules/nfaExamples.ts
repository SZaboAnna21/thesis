import type { Nfa } from "@fotoc/automata-core";

export type NfaExample = {
  id: string;
  title: string;
  description: string;
  nfa: Nfa;
};

export const nfaExamples: NfaExample[] = [
  {
    id: "lecture-determinize",
    title: "Jegyzet: determinizálás",
    description: "Két kezdőállapot, és több helyen üres halmaz: ebből lesz a csapda.",
    nfa: {
      states: ["q0", "q1", "q2"],
      alphabet: ["a", "b"],
      starts: ["q0", "q1"],
      accepting: ["q1", "q2"],
      transitions: {
        q0: { a: [], b: ["q1", "q2"] },
        q1: { a: ["q0"], b: [] },
        q2: { a: ["q1"], b: ["q2"] },
      },
    },
  },
  {
    id: "lecture-3nf",
    title: "Jegyzet: 3NF-ből NVDA",
    description: "S → aA | aB | bB | ε, A → bS | bB, B → aS | aA | ε",
    nfa: {
      states: ["S", "A", "B"],
      alphabet: ["a", "b"],
      starts: ["S"],
      accepting: ["S", "B"],
      transitions: {
        S: { a: ["A", "B"], b: ["B"] },
        A: { a: [], b: ["S", "B"] },
        B: { a: ["S", "A"], b: [] },
      },
    },
  },
];
