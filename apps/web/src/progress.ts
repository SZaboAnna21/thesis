import { useSyncExternalStore } from "react";

const STORAGE_KEY = "fotoc.visitedTopics";
const listeners = new Set<() => void>();

function load(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let visited = load();

export function markTopicVisited(topicId: string) {
  if (visited.includes(topicId)) return;
  visited = [...visited, topicId];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
  } catch {
    // a böngésző tiltja a tárolást, ekkor csak a munkamenet idejére marad meg
  }
  listeners.forEach((notify) => notify());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useVisitedTopics(): string[] {
  return useSyncExternalStore(subscribe, () => visited);
}
