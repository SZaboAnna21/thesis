import type { Grammer } from "../../src/grammer.ts";

export const largeGrammar: Grammer = {
  nonterminals: ["S", "A", "B", "C", "D", "E", "F", "G", "H"],
  terminals: ["a", "b"],
  rules: [
    { from: "S", to: "AB" },
    { from: "S", to: "AC" },
    { from: "C", to: "SB" },
    { from: "A", to: "a" },
    { from: "B", to: "b" },
    { from: "D", to: "AB" },
    { from: "D", to: "AC" },
    { from: "E", to: "DB" },
    { from: "E", to: "DC" },
    { from: "F", to: "EB" },
    { from: "F", to: "EC" },
    { from: "G", to: "FB" },
    { from: "G", to: "FC" },
    { from: "H", to: "GB" },
    { from: "H", to: "GC" },
  ],
  start: "S",
};
