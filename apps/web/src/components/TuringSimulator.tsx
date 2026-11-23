import { useMemo, useState } from "react";
import { computeAllSteps, type TuringMachine } from "@fotoc/automata-core";
import { PlayerControls } from "./PlayerControls";
import { usePlayer } from "./usePlayer";
import { TuringGraph } from "./TuringGraph";

type Props = {
  tm: TuringMachine;
  initialWord?: string;
};

export function TuringSimulator({ tm, initialWord = "" }: Props) {
  const [word, setWord] = useState(initialWord);
  const steps = useMemo(() => computeAllSteps(tm, word), [tm, word]);
  const player = usePlayer(steps.length);
  const config = steps[player.index];
  const isLast = player.index === player.last;

  const prevConfig = player.index > 0 ? steps[player.index - 1] : null;
  const appliedTransition = prevConfig
    ? tm.transitions.find((t) => t.from === prevConfig.state && t.read === prevConfig.tape[prevConfig.head]) ?? null
    : null;

  function changeWord(value: string) {
    setWord(value);
    player.reset();
  }

  return (
    <div
      className="space-y-6 rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      tabIndex={0}
      onKeyDown={player.onKeyDown}
    >
      <TuringGraph tm={tm} activeState={config.state} />

      <TapeView tape={config.tape} head={config.head} />

      <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 p-4 font-mono text-sm text-gray-700 dark:text-slate-700">
        {player.index === 0 ? (
          <span>Kezdőállapot: <b>{config.state}</b></span>
        ) : appliedTransition ? (
          <span>
            δ({prevConfig!.state}, {prevConfig!.tape[prevConfig!.head]}) = ({config.state},{" "}
            {appliedTransition.write}, {appliedTransition.dir})
          </span>
        ) : (
          <span>
            Nincs átmenet δ({prevConfig!.state}, {prevConfig!.tape[prevConfig!.head]}) → implicit elutasítás
          </span>
        )}
      </div>

      <PlayerControls player={player} />

      {isLast && (
        <p
          className={
            "rounded-2xl border p-4 text-sm font-sans " +
            (config.state === tm.acceptState
              ? "border-green-300 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300"
              : "border-amber-300 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300")
          }
        >
          {config.state === tm.acceptState ? (
            <>Elfogadó állapot — a gép <b>elfogadja</b> a szót.</>
          ) : (
            <>Elutasító állapot — a gép <b>elutasítja</b> a szót.</>
          )}
        </p>
      )}
    </div>
  );
}

function TapeView({ tape, head }: { tape: string[]; head: number }) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-4">
      {tape.map((cell, i) => (
        <div
          key={i}
          className={
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 font-mono text-xl transition-colors duration-300 " +
            (i === head
              ? "border-purple-700 bg-purple-600 text-white shadow-md"
              : "border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 text-gray-900 dark:text-slate-900")
          }
        >
          {cell}
        </div>
      ))}
    </div>
  );
}
