import { useEffect, useState, type KeyboardEvent } from "react";

export const SPEEDS = [
  { label: "lassú", ms: 2500 },
  { label: "közepes", ms: 1500 },
  { label: "gyors", ms: 700 },
];

export type Player = ReturnType<typeof usePlayer>;

export function usePlayer(stepCount: number) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEEDS[1].ms);
  const last = stepCount - 1;
  const index = Math.min(i, last);
  const isPlaying = playing && index < last;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => setI((n) => Math.min(n + 1, last)), speed);
    return () => clearTimeout(timer);
  }, [isPlaying, index, speed, last]);

  const go = (n: number) => setI(Math.max(0, Math.min(last, n)));

  const togglePlay = () => {
    if (!isPlaying && index >= last) setI(0);
    setPlaying(!isPlaying);
  };

  const reset = () => {
    setI(0);
    setPlaying(false);
  };

  function onKeyDown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === " ") togglePlay();
    else return;
    e.preventDefault();
  }

  return { index, last, isPlaying, speed, setSpeed, go, togglePlay, reset, onKeyDown };
}
