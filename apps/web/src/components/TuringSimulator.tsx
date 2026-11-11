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
      className="space-y-4 rounded border bg-white p-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
      tabIndex={0}
      onKeyDown={player.onKeyDown}
    >
      <label className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold">Bemeneti szó:</span>
        <input
          value={word}
          onChange={(e) => changeWord(e.target.value)}
          placeholder="ε (üres szó)"
          className="rounded border px-2 py-1 font-mono"
        />
      </label>

      <TuringGraph tm={tm} activeState={config.state} />

      <TapeView tape={config.tape} head={config.head} />

      <div className="rounded border border-brand-200 bg-brand-50 p-3 font-mono text-sm">
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
            "rounded border p-3 text-sm " +
            (config.state === tm.acceptState
              ? "border-green-300 bg-green-50 text-green-800"
              : "border-amber-300 bg-amber-50 text-amber-800")
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
    <div className="flex gap-1 overflow-x-auto rounded border bg-gray-50 p-3">
      {tape.map((cell, i) => (
        <div
          key={i}
          className={
            "flex h-12 w-12 shrink-0 items-center justify-center rounded border-2 font-mono text-xl transition-colors duration-300 " +
            (i === head
              ? "border-brand-700 bg-brand-600 text-white shadow-md"
              : "border-gray-300 bg-white text-gray-900")
          }
        >
          {cell}
        </div>
      ))}
    </div>
  );
}
