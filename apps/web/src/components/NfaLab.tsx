import { useState } from "react";
import type { NfaExample } from "@fotoc/automata-core";
import { SubsetPlayer } from "./SubsetPlayer";

const defaultExamples: NfaExample[] = [
  {
    id: "lecture-determinize",
    title: "Determinálás",
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
    <div className="space-y-6 rounded-3xl border border-purple-100 bg-white p-8 shadow-lg dark:border-purple-600 dark:bg-slate-100">
      <div className="flex flex-wrap gap-2">
        {examples.map((e) => (
          <button
            key={e.id}
            onClick={() => setExampleId(e.id)}
            className={
              "rounded-xl border px-4 py-2 text-sm font-semibold transition-all " +
              (e.id === exampleId
                ? "border-purple-500 bg-purple-50 text-purple-700 dark:border-purple-400 dark:bg-purple-900/40 dark:text-purple-200"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-slate-300 dark:bg-slate-50 dark:text-slate-600 dark:hover:bg-slate-100")
            }
          >
            {e.title}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-slate-600">{example.description}</p>

      <SubsetPlayer key={example.id} nfa={example.nfa} />
    </div>
  );
}
