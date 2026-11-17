import { useSyncExternalStore } from "react";

const VISITED_KEY = "fotoc.visitedTopics";
const QUIZ_KEY = "fotoc.quizResults";

// --- visited topics ---

const visitedListeners = new Set<() => void>();

function loadVisited(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(VISITED_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let visited = loadVisited();

export function markTopicVisited(topicId: string) {
  if (visited.includes(topicId)) return;
  visited = [...visited, topicId];
  try {
    localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
  } catch {}
  visitedListeners.forEach((notify) => notify());
}

function subscribeVisited(listener: () => void) {
  visitedListeners.add(listener);
  return () => { visitedListeners.delete(listener); };
}

export function useVisitedTopics(): string[] {
  return useSyncExternalStore(subscribeVisited, () => visited);
}

// --- quiz results ---

export type QuizSelections = Record<number, number>;

const quizListeners = new Set<() => void>();

function loadQuiz(): Record<string, QuizSelections> {
  try {
    const parsed = JSON.parse(localStorage.getItem(QUIZ_KEY) ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

let quizResults = loadQuiz();

export function saveQuizResult(topicId: string, selections: QuizSelections) {
  quizResults = { ...quizResults, [topicId]: selections };
  try {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(quizResults));
  } catch {}
  quizListeners.forEach((notify) => notify());
}

export function clearQuizResult(topicId: string) {
  const { [topicId]: _, ...rest } = quizResults;
  quizResults = rest;
  try {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(quizResults));
  } catch {}
  quizListeners.forEach((notify) => notify());
}

function subscribeQuiz(listener: () => void) {
  quizListeners.add(listener);
  return () => { quizListeners.delete(listener); };
}

export function useQuizResult(topicId: string): QuizSelections {
  const all = useSyncExternalStore(subscribeQuiz, () => quizResults);
  return all[topicId] ?? {};
}
