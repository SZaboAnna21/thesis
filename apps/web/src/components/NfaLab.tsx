import { useState } from "react";
import type { NfaExample } from "@fotoc/automata-core";
import { SubsetPlayer } from "./SubsetPlayer";

const defaultExamples: NfaExample[] = [
  {
    id: "lecture-determinize",
    title: "Determinizálás",
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
    title: "3NF-ből NVDA",
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

type Props = {
  examples?: NfaExample[];
};

export function NfaLab({ examples = defaultExamples }: Props) {
  const [exampleId, setExampleId] = useState(examples[0].id);
  const example = examples.find((e) => e.id === exampleId)!;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {examples.map((e) => (
          <button
            key={e.id}
            onClick={() => setExampleId(e.id)}
            className={
              "rounded border px-3 py-1 text-sm " +
              (e.id === exampleId ? "border-brand-500 bg-brand-50 text-brand-700" : "bg-white hover:bg-gray-50")
            }
          >
            {e.title}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600">{example.description}</p>

      <SubsetPlayer key={example.id} nfa={example.nfa} />
    </div>
  );
}
