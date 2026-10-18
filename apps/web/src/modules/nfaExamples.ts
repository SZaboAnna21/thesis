import { EPS, type Nfa } from "@fotoc/automata-core";

export type NfaExample = {
  id: string;
  title: string;
  description: string;
  sampleWord: string;
  nfa: Nfa;
};

export const nfaExamples: NfaExample[] = [
  {
    id: "ends-with-ab",
    sampleWord: "abab",
    title: "ab-re végződő szavak",
    description: "q0-ban várunk, és egy a-nál „megsejtjük”, hogy innen már csak b jön.",
    nfa: {
      states: ["q0", "q1", "q2"],
      alphabet: ["a", "b"],
      starts: ["q0"],
      accepting: ["q2"],
      transitions: {
        q0: { a: ["q0", "q1"], b: ["q0"] },
        q1: { b: ["q2"] },
        q2: {},
      },
    },
  },
  {
    id: "lecture-determinize",
    sampleWord: "bab",
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
    sampleWord: "abab",
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
  {
    id: "eps-a-star-b-star",
    sampleWord: "aabb",
    title: "ε-átmenettel: a*b*",
    description: "Az a-k után ε-nal „átsétálunk” a b-k állapotába, betű olvasása nélkül.",
    nfa: {
      states: ["p0", "p1"],
      alphabet: ["a", "b"],
      starts: ["p0"],
      accepting: ["p1"],
      transitions: {
        p0: { a: ["p0"], [EPS]: ["p1"] },
        p1: { b: ["p1"] },
      },
    },
  },
];
