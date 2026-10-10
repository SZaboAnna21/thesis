import { useState } from "react";
import type { QuizQuestion } from "@fotoc/content";
import { MathText } from "./MathText";

type Props = {
  questions: QuizQuestion[];
};

const difficultyLabels: Record<QuizQuestion["difficulty"], string> = {
  easy: "Könnyű",
  hard: "Nehezebb",
};

function QuestionCard({
  question,
  number,
  selected,
  onSelect,
}: {
  question: QuizQuestion;
  number: number;
  selected: number | undefined;
  onSelect: (index: number) => void;
}) {
  const answered = selected !== undefined;

  return (
    <div className="rounded border border-slate-200 px-5 py-4">
      <p className="mb-3">
        <b className="font-semibold text-brand-700">{number}.</b> <MathText text={question.question} />
      </p>

      <div className="flex flex-col gap-2">
        {question.answers.map((answer, index) => {
          let style = "border-slate-200 hover:border-brand-700 hover:bg-slate-50";
          if (answered && index === question.correct) {
            style = "border-green-300 bg-green-50 text-green-900";
          } else if (answered && index === selected) {
            style = "border-red-300 bg-red-50 text-red-900";
          } else if (answered) {
            style = "border-slate-200 text-slate-400";
          }

          return (
            <button
              key={index}
              type="button"
              disabled={answered}
              onClick={() => onSelect(index)}
              className={`rounded border px-4 py-2 text-left transition-colors disabled:cursor-default ${style}`}
            >
              <span className="mr-2 font-semibold">{String.fromCharCode(65 + index)})</span>
              <MathText text={answer} />
            </button>
          );
        })}
      </div>

      {answered && (
        <p className="mt-3 text-base">
          <b className={selected === question.correct ? "font-semibold text-green-700" : "font-semibold text-red-700"}>
            {selected === question.correct ? "Helyes!" : "Nem helyes."}
          </b>{" "}
          <MathText text={question.explanation} />
        </p>
      )}
    </div>
  );
}

export function QuizView({ questions }: Props) {
  const [selected, setSelected] = useState<Record<number, number>>({});

  const answeredCount = Object.keys(selected).length;
  const correctCount = questions.filter((question, index) => selected[index] === question.correct).length;

  return (
    <div className="flex flex-col gap-6">
      {(["easy", "hard"] as const).map((difficulty) => {
        const group = questions
          .map((question, index) => ({ question, index }))
          .filter(({ question }) => question.difficulty === difficulty);

        if (group.length === 0) return null;

        return (
          <div key={difficulty} className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-brand-700">{difficultyLabels[difficulty]}</h3>
            {group.map(({ question, index }) => (
              <QuestionCard
                key={index}
                question={question}
                number={index + 1}
                selected={selected[index]}
                onSelect={(answer) => setSelected((prev) => ({ ...prev, [index]: answer }))}
              />
            ))}
          </div>
        );
      })}

      <div className="flex items-center justify-between rounded bg-slate-50 px-5 py-3">
        <p>
          Eredmény: <b className="font-semibold">{correctCount}</b> / {questions.length}
          {answeredCount < questions.length && (
            <span className="text-slate-500"> ({questions.length - answeredCount} még hátra)</span>
          )}
        </p>
        {answeredCount > 0 && (
          <button
            type="button"
            onClick={() => setSelected({})}
            className="rounded border border-slate-300 px-4 py-1 text-base hover:border-brand-700 hover:text-brand-700"
          >
            Újrakezdés
          </button>
        )}
      </div>
    </div>
  );
}
