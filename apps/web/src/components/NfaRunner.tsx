import { useMemo, useState } from "react";
import { runNfa, type Nfa, type NfaRunStep } from "@fotoc/automata-core";
import { NfaTable } from "./NfaTable";
import { PlayerControls } from "./PlayerControls";
import { showSet } from "./showSet";
import { usePlayer } from "./usePlayer";

type Props = {
  nfa: Nfa;
  initialWord: string;
};

type StepDetail = {
  from: { state: string; targets: string[] }[];
  reached: string[];
  viaEps: string[];
};

function inOrder(nfa: Nfa, states: string[]) {
  return nfa.states.filter((state) => states.includes(state));
}

function describeSteps(nfa: Nfa, steps: NfaRunStep[]): StepDetail[] {
  return steps.map((step, k) => {
    const from =
      k === 0
        ? []
        : steps[k - 1].active.map((state) => ({ state, targets: nfa.transitions[state]?.[step.letter!] ?? [] }));
    const reached = k === 0 ? inOrder(nfa, nfa.starts) : inOrder(nfa, from.flatMap((f) => f.targets));
    return { from, reached, viaEps: step.active.filter((state) => !reached.includes(state)) };
  });
}

export function NfaRunner({ nfa, initialWord }: Props) {
  const [word, setWord] = useState(initialWord);
  const invalidLetter = [...word].find((letter) => !nfa.alphabet.includes(letter));
  const steps = useMemo(() => (invalidLetter === undefined ? runNfa(nfa, word) : []), [nfa, word, invalidLetter]);
  const details = useMemo(() => describeSteps(nfa, steps), [nfa, steps]);
  const player = usePlayer(Math.max(steps.length, 1));

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
        <span className="text-gray-500">Σ = {showSet(nfa.alphabet)}</span>
      </label>

      {invalidLetter !== undefined ? (
        <p className="text-sm text-red-600">A(z) „{invalidLetter}” betű nem eleme az ábécének.</p>
      ) : (
        <RunView nfa={nfa} word={word} steps={steps} details={details} index={player.index} />
      )}

      {invalidLetter === undefined && <PlayerControls player={player} />}
    </div>
  );
}

function RunView({
  nfa,
  word,
  steps,
  details,
  index,
}: {
  nfa: Nfa;
  word: string;
  steps: NfaRunStep[];
  details: StepDetail[];
  index: number;
}) {
  const step = steps[index];
  const detail = details[index];
  const isLast = index === steps.length - 1;
  const isAccepting = (states: string[]) => states.some((state) => nfa.accepting.includes(state));

  return (
    <>
      <WordTape word={word} position={index} />

      <NfaTable
        nfa={nfa}
        active={step.active}
        viaEps={detail.viaEps}
        readCells={index > 0 ? { states: steps[index - 1].active, letter: step.letter! } : undefined}
      />

      <div className="rounded border border-brand-200 bg-brand-50 p-3 text-sm">
        <StepExplanation step={step} detail={detail} />
        {step.active.length === 0 && !isLast && (
          <p className="mt-2 text-amber-700">
            Elakadt: nincs aktív állapot, innen már semmilyen betűvel nem jutunk sehova.
          </p>
        )}
      </div>

      <ol className="flex flex-wrap items-center gap-1 font-mono text-sm">
        {steps.slice(0, index + 1).map((s, k) => (
          <li key={k} className="flex items-center gap-1">
            {k > 0 && <span className="text-gray-500">—{s.letter}→</span>}
            <span
              className={
                "rounded border px-2 py-0.5 " +
                (k === index ? "border-brand-500 bg-brand-100 font-semibold " : "bg-white ") +
                (isAccepting(s.active) ? "text-green-700" : "")
              }
            >
              {showSet(s.active)}
            </span>
          </li>
        ))}
      </ol>

      {isLast && <Verdict nfa={nfa} active={step.active} />}
    </>
  );
}

function WordTape({ word, position }: { word: string; position: number }) {
  if (word === "") return <p className="font-mono text-lg text-gray-500">ε</p>;

  return (
    <p className="font-mono text-lg tracking-widest">
      {[...word].map((letter, k) => (
        <span
          key={k}
          className={
            k === position - 1
              ? "rounded bg-brand-600 px-0.5 text-white"
              : k < position - 1
                ? "text-gray-400"
                : "text-gray-900"
          }
        >
          {letter}
        </span>
      ))}
    </p>
  );
}

function StepExplanation({ step, detail }: { step: NfaRunStep; detail: StepDetail }) {
  const epsPart =
    detail.viaEps.length > 0 ? (
      <p className="mt-1">
        ε-átmenettel elérhető még: <b className="font-mono">{detail.viaEps.join(", ")}</b>. Az ε-lezárt:{" "}
        <b className="font-mono">{showSet(step.active)}</b>.
      </p>
    ) : null;

  if (step.letter === null) {
    return (
      <>
        <p className="font-semibold">Indulás</p>
        <p className="mt-1">
          Egyszerre az összes kezdőállapotban vagyunk: <b className="font-mono">{showSet(detail.reached)}</b>.
        </p>
        {epsPart}
      </>
    );
  }

  return (
    <>
      <p className="font-semibold">„{step.letter}” beolvasása</p>
      {detail.from.length === 0 ? (
        <p className="mt-1">Nincs aktív állapot, így a betű után sem lesz.</p>
      ) : (
        <>
          <ul className="mt-1 font-mono">
            {detail.from.map(({ state, targets }) => (
              <li key={state}>
                δ({state}, {step.letter}) = {showSet(targets)}
              </li>
            ))}
          </ul>
          <p className="mt-1">
            Ezek uniója: <b className="font-mono">{showSet(detail.reached)}</b>.
          </p>
        </>
      )}
      {epsPart}
    </>
  );
}

function Verdict({ nfa, active }: { nfa: Nfa; active: string[] }) {
  const accepting = active.filter((state) => nfa.accepting.includes(state));

  if (accepting.length > 0) {
    return (
      <p className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800">
        A végén az aktív halmaz {showSet(active)}, és van benne elfogadó állapot ({accepting.join(", ")}). Elég egyetlen
        szerencsés út, tehát az automata <b>elfogadja</b> a szót.
      </p>
    );
  }

  return (
    <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
      {active.length === 0
        ? "A végén az aktív halmaz üres: minden működés elakadt, "
        : `A végén az aktív halmaz ${showSet(active)}, de nincs benne elfogadó állapot, `}
      tehát az automata <b>elutasítja</b> a szót.
    </p>
  );
}
