import { useState } from "react";
import type { NfaExample } from "../modules/nfaExamples";
import { SubsetPlayer } from "./SubsetPlayer";

type Props = {
  examples: NfaExample[];
};

export function NfaLab({ examples }: Props) {
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
