import { useMemo, useState } from "react";
import { dfaToNfa, runDfa, type Dfa } from "@fotoc/automata-core";
import { AutomatonGraph } from "./AutomatonGraph";
import { PlayerControls } from "./PlayerControls";
import { showSet } from "./showSet";
import { usePlayer } from "./usePlayer";

const defaultDfa: Dfa = {
  states: ["q0", "q1", "q2", "q3"],
  alphabet: ["a", "b"],
  start: "q0",
  accepting: ["q1", "q2"],
  transitions: {
    q0: { a: "q2", b: "q1" },
    q1: { a: "q3", b: "q0" },
    q2: { a: "q0", b: "q3" },
    q3: { a: "q1", b: "q2" },
  },
};

type Props = {
  dfa?: Dfa;
  initialWord?: string;
};

export function DfaSimulator({ dfa = defaultDfa, initialWord = "" }: Props) {
  const [word, setWord] = useState(initialWord);
  const automaton = useMemo(() => dfaToNfa(dfa), [dfa]);
  const run = useMemo(() => runDfa(dfa, word), [dfa, word]);
  const player = usePlayer(run.steps.length);
  const index = player.index;
  const path = run.steps.slice(0, index + 1).map((s) => s.state);
  const state = path[index];
  const isLast = index === run.steps.length - 1;
  const taken = path.slice(1).map((to, k) => ({ from: path[k], to, letter: word[k] }));

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
        <span className="text-gray-500">Σ = {showSet(dfa.alphabet)}</span>
      </label>

      {run.invalidLetter !== undefined ? (
        <p className="text-sm text-red-600">A(z) „{run.invalidLetter}” betű nem eleme az ábécének.</p>
      ) : (
        <>
          <WordButtons word={word} position={index} onPick={(k) => player.go(k + 1)} />

          <AutomatonGraph
            automaton={automaton}
            active={[state]}
            visited={path}
            taken={taken.slice(-1)}
            takenBefore={taken.slice(0, -1)}
          />

          <div className="rounded border border-brand-200 bg-brand-50 p-3 text-sm">
            {index === 0 ? (
              <p>
                <b>Indulás:</b> a kezdőállapotban vagyunk: <b className="font-mono">{state}</b>.
              </p>
            ) : (
              <p>
                <b>„{word[index - 1]}” beolvasása:</b>{" "}
                <span className="font-mono">
                  δ({path[index - 1]}, {word[index - 1]}) = <b>{state}</b>
                </span>
              </p>
            )}
            <p className="mt-1 font-mono text-gray-700">
              {path.map((s, k) => s + word.slice(k)).join(" ⇒ ")}
            </p>
          </div>

          <PlayerControls player={player} />

          {isLast && (
            <p
              className={
                "rounded border p-3 text-sm " +
                (run.accepted
                  ? "border-green-300 bg-green-50 text-green-800"
                  : "border-amber-300 bg-amber-50 text-amber-800")
              }
            >
              {run.accepted
                ? <>{state} elfogadó állapot, tehát az automata <b>elfogadja</b> a szót.</>
                : <>{state} nem elfogadó állapot, tehát az automata <b>elutasítja</b> a szót.</>}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function WordButtons({ word, position, onPick }: { word: string; position: number; onPick: (k: number) => void }) {
  if (word === "") return <p className="font-mono text-2xl text-gray-500">ε</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {[...word].map((letter, k) => (
        <button
          key={k}
          type="button"
          onClick={() => onPick(k)}
          title={`Ugrás a(z) ${k + 1}. betű utánra`}
          className={
            "h-14 w-14 rounded-lg border-2 font-mono text-2xl transition-colors duration-300 " +
            (k === position - 1
              ? "scale-110 border-brand-700 bg-brand-600 text-white shadow-md"
              : k < position - 1
                ? "border-brand-200 bg-brand-50 text-brand-700"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50")
          }
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
