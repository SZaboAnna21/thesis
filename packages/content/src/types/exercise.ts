import type { LocalizedText } from "./content";

export type MultipleChoiceExercise = {
  type: "multiple-choice";
  question: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation?: LocalizedText;
};

export type TrueFalseExercise = {
  type: "true-false";
  statement: LocalizedText;
  answer: boolean;
  explanation?: LocalizedText;
};

export type QuizQuestion = {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
  difficulty: "easy" | "hard";
};

export type Exercise =
  | MultipleChoiceExercise
  | TrueFalseExercise;
