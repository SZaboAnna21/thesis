import { useState } from "react";
import type { NfaExample } from "../modules/nfaExamples";
import { NfaRunner } from "./NfaRunner";
import { SubsetPlayer } from "./SubsetPlayer";

type Props = {
  examples: NfaExample[];
};

const LESSONS = [
  { id: "run", label: "1. Futtatás" },
  { id: "determinize", label: "2. Determinizálás" },
] as const;

type LessonId = (typeof LESSONS)[number]["id"];

export function NfaLab({ examples }: Props) {
  const [exampleId, setExampleId] = useState(examples[0].id);
  const [lesson, setLesson] = useState<LessonId>("run");
  const example = examples.find((e) => e.id === exampleId)!;

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b">
        {LESSONS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLesson(l.id)}
            className={
              "-mb-px border-b-2 px-4 py-2 text-sm font-semibold " +
              (l.id === lesson ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:text-gray-800")
            }
          >
            {l.label}
          </button>
        ))}
      </div>

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

      {lesson === "run" ? (
        <NfaRunner key={example.id} nfa={example.nfa} initialWord={example.sampleWord} />
      ) : (
        <SubsetPlayer key={example.id} nfa={example.nfa} />
      )}
    </div>
  );
}
