import type { ReactNode } from "react";
import type { Dfa } from "@fotoc/automata-core";
import { DfaSimulator } from "../components/DfaSimulator";

// Az előadás 1. DVA-példája: azokat a szavakat fogadja el,
// amelyekben az a és b betűk paritása különbözik.
const parityDfa: Dfa = {
  states: ["q0", "q1", "q2", "q3"],
  alphabet: ["a", "b"],
  start: "q0",
  accepting: ["q1", "q2"],
  transitions: {
    q0: { a: "q2", b: "q1" },
    q1: { a: "q3", b: "q0" },
    q2: { a: "q0", b: "q3" },
    q3: { a: "q1", b: "q2" },
  },
};

// A TopicMeta.module azonosítóihoz tartozó interaktív modulok.
export const modules: Record<string, () => ReactNode> = {
  "dfa-simulator": () => <DfaSimulator dfa={parityDfa} />,
};
