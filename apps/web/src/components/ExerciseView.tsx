import { useState } from "react";
import type { Exercise } from "@fotoc/content";

type Props = {
  exercise: Exercise;
};

export function ExerciseView({ exercise }: Props) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  let question: string;
  let answers: { label: string; correct: boolean }[];

  switch (exercise.type) {
    case "multiple-choice":
      question = exercise.question.hu;
      answers = exercise.options.map((option, index) => ({
        label: option.hu,
        correct: index === exercise.correctIndex,
      }));
      break;

    case "true-false":
      question = exercise.statement.hu;
      answers = [
        { label: "Igaz", correct: exercise.answer },
        { label: "Hamis", correct: !exercise.answer },
      ];
      break;
  }

  return (
    <div>
      <p>{question}</p>

      {answers.map((answer) => (
        <button key={answer.label} onClick={() => setIsCorrect(answer.correct)}>
          {answer.label}
        </button>
      ))}

      {isCorrect !== null && (
        <p>
          {isCorrect ? "Helyes!" : "Nem helyes."}
          {exercise.explanation && ` ${exercise.explanation.hu}`}
        </p>
      )}
    </div>
  );
}
