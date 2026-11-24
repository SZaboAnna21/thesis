import { useMemo, useState, type ReactNode } from "react";
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
  description?: ReactNode;
};

export function DfaSimulator({ dfa = defaultDfa, initialWord = "", description }: Props) {
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
    <>
      {description && (
        <p className="mb-6 text-muted-foreground">{description}</p>
      )}
    <div
      className="space-y-6 rounded-3xl border border-purple-100 bg-white p-8 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-purple-400 dark:border-purple-600 dark:bg-slate-100"
      tabIndex={0}
      onKeyDown={player.onKeyDown}
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-48">
          <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-slate-700">
            Bemeneti sz&#243;
          </label>
          <input
            value={word}
            onChange={(e) => changeWord(e.target.value)}
            placeholder="&#949; (&#252;res sz&#243;)"
            className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 font-mono text-lg text-gray-900 shadow-sm transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-200 dark:bg-slate-50 dark:text-slate-900 dark:focus:ring-purple-400"
          />
        </div>
        <span className="pb-3 text-sm font-semibold text-gray-500 dark:text-slate-500 font-mono">
          &#931; = {showSet(dfa.alphabet)}
        </span>
      </div>

      {run.invalidLetter !== undefined ? (
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
          A(z) &#8222;{run.invalidLetter}&#8221; bet&#369; nem eleme az &#225;b&#233;c&#233;nek.
        </p>
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

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm dark:border-purple-600 dark:bg-purple-900/40">
            {index === 0 ? (
              <p className="text-gray-900 dark:text-slate-900">
                <b>Indul&#225;s:</b> a kezdő&#225;llapotban vagyunk:{" "}
                <b className="font-mono">{state}</b>.
              </p>
            ) : (
              <p className="text-gray-900 dark:text-slate-900">
                <b>&#8222;{word[index - 1]}&#8221; beolvas&#225;sa:</b>{" "}
                <span className="font-mono">
                  &#948;({path[index - 1]}, {word[index - 1]}) = <b>{state}</b>
                </span>
              </p>
            )}
            <p className="mt-1 font-mono text-gray-600 dark:text-slate-600">
              {path.map((s, k) => s + word.slice(k)).join(" ⇒ ")}
            </p>
          </div>

          <PlayerControls player={player} />

          {isLast && (
            <p
              className={
                "rounded-2xl border p-4 text-sm font-sans " +
                (run.accepted
                  ? "border-green-300 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200"
                  : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-200")
              }
            >
              {run.accepted ? (
                <><span className="font-mono">{state}</span> elfogad&#243; &#225;llapot, teh&#225;t az automata <b>elfogadja</b> a sz&#243;t.</>
              ) : (
                <><span className="font-mono">{state}</span> nem elfogad&#243; &#225;llapot, teh&#225;t az automata <b>elutas&#237;tja</b> a sz&#243;t.</>
              )}
            </p>
          )}
        </>
      )}
    </div>
    </>
  );
}

function WordButtons({ word, position, onPick }: { word: string; position: number; onPick: (k: number) => void }) {
  if (word === "") return <p className="font-mono text-2xl text-gray-500 dark:text-slate-500">&#949;</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {[...word].map((letter, k) => (
        <button
          key={k}
          type="button"
          onClick={() => onPick(k)}
          title={`Ugrás a(z) ${k + 1}. betű utánra`}
          className={
            "h-14 w-14 rounded-xl border-2 font-mono text-2xl transition-all duration-300 " +
            (k === position - 1
              ? "scale-110 border-purple-700 bg-purple-600 text-white shadow-md dark:border-purple-400 dark:bg-purple-500"
              : k < position - 1
                ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-100")
          }
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
