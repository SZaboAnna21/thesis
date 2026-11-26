import { useEffect, useState } from "react";
import { dfaToNfa, type Dfa, type MinimizeResult, type PartitionRound, type State } from "@fotoc/automata-core";
import { call } from "../useCore";
import { AutomatonGraph } from "./AutomatonGraph";
import { PlayerControls } from "./PlayerControls";
import { showSet } from "./showSet";
import { usePlayer } from "./usePlayer";

type Step =
  | { kind: "reach"; layer: number }
  | { kind: "remove" }
  | { kind: "round"; round: number }
  | { kind: "done" };

function buildSteps(result: MinimizeResult): Step[] {
  const steps: Step[] = [];
  for (let i = 0; i < result.reachableLayers.length; i++) {
    steps.push({ kind: "reach", layer: i });
  }
  steps.push({ kind: "remove" });
  for (let i = 0; i < result.rounds.length; i++) {
    steps.push({ kind: "round", round: i });
  }
  steps.push({ kind: "done" });
  return steps;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

function className(index: number): string {
  return ROMAN[index] ?? String(index + 1);
}

function stateMarker(dfa: Dfa, state: State): string {
  const isStart = state === dfa.start;
  const isAccepting = dfa.accepting.includes(state);
  if (isStart && isAccepting) return "⇆";
  if (isStart) return "→";
  if (isAccepting) return "←";
  return "";
}

const defaultDfa: Dfa = {
  states: ["q0", "q1", "q2", "q3", "q4", "q5", "q6"],
  alphabet: ["a", "b"],
  start: "q0",
  accepting: ["q2", "q5"],
  transitions: {
    q0: { a: "q1", b: "q3" },
    q1: { a: "q4", b: "q2" },
    q2: { a: "q4", b: "q3" },
    q3: { a: "q4", b: "q0" },
    q4: { a: "q1", b: "q5" },
    q5: { a: "q1", b: "q0" },
    q6: { a: "q2", b: "q6" },
  },
};

export function MinimizerLab({ dfa = defaultDfa }: { dfa?: Dfa }) {
  const [result, setResult] = useState<MinimizeResult | null>(null);
  useEffect(() => {
    setResult(null);
    call<MinimizeResult>("minimize", dfa).then(setResult);
  }, [dfa]);

  const steps = result ? buildSteps(result) : [];
  const player = usePlayer(steps.length || 1);

  if (!result)
    return (
      <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6 text-center text-sm text-purple-400 dark:border-purple-600 dark:bg-purple-900/20">
        Számítás…
      </div>
    );

  const step = steps[player.index];

  const lastLayer = result.reachableLayers[result.reachableLayers.length - 1];
  let reached: State[] = lastLayer;
  if (step.kind === "reach") {
    reached = result.reachableLayers[step.layer];
  }
  const removedShown = step.kind !== "reach";

  return (
    <div>
     <p className="text-muted-foreground">A DVA minimalizálása két lépésben: 1. elérhetetlen állapotok elhagyása, 2. ekvivalens állapotok összevonása (Myhill–Nerode-tétel alapján). A ← → gombokkal vagy bal/jobb nyíllal léphetsz a lépések között.</p>

    <div
      className="space-y-6 rounded-3xl border border-purple-100 bg-white p-8 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-purple-400 dark:border-purple-600 dark:bg-slate-100"
      tabIndex={0}
      onKeyDown={player.onKeyDown}
    >
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
          A kiinduló DVA
        </p>
        <DfaTable
          dfa={dfa}
          highlighted={step.kind === "reach" ? reached : []}
          removed={removedShown ? result.removed : []}
        />
      </div>

      <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm dark:border-purple-600 dark:bg-purple-900/40">
        {step.kind === "reach" && <ReachExplanation result={result} layer={step.layer} />}
        {step.kind === "remove" && <RemoveExplanation removed={result.removed} />}
        {step.kind === "round" && <RoundExplanation result={result} round={step.round} />}
        {step.kind === "done" && <DoneExplanation result={result} original={dfa} />}
      </div>

      {step.kind === "round" && <RoundTable dfa={dfa} result={result} round={step.round} />}

      {step.kind === "done" && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
            A minimális automata
          </p>
          <DfaTable dfa={result.minimal} />
          <AutomatonGraph automaton={dfaToNfa(result.minimal)} active={[]} />
        </div>
      )}

      <PlayerControls player={player} />
    </div>
    </div>
  );
}

function DfaTable({ dfa, highlighted = [], removed = [] }: { dfa: Dfa; highlighted?: State[]; removed?: State[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-200">
      <table className="w-full text-center font-mono text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-100">
            <th className="p-2"></th>
            {dfa.alphabet.map((letter) => (
              <th key={letter} className="p-2 text-gray-600 dark:text-slate-600">
                {letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dfa.states.map((state) => {
            const isHighlighted = highlighted.includes(state);
            const isRemoved = removed.includes(state);
            return (
              <tr
                key={state}
                className={
                  "border-t border-gray-100 dark:border-slate-200 " +
                  (isHighlighted ? "bg-purple-50 font-semibold dark:bg-purple-900/30 " : "") +
                  (isRemoved ? "text-gray-300 line-through dark:text-slate-400 " : "")
                }
              >
                <td className="p-2 text-left">
                  <span className="inline-block w-5 text-gray-400 dark:text-slate-500">{stateMarker(dfa, state)}</span>
                  {state}
                </td>
                {dfa.alphabet.map((letter) => (
                  <td key={letter} className="p-2">
                    {dfa.transitions[state][letter]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ReachExplanation({ result, layer }: { result: MinimizeResult; layer: number }) {
  const current = result.reachableLayers[layer];
  const isLast = layer === result.reachableLayers.length - 1;

  if (layer === 0) {
    return (
      <>
        <p className="font-semibold text-gray-900 dark:text-slate-900">1. lépés: összefüggővé alakítás</p>
        <p className="mt-1 text-gray-700 dark:text-slate-700">
          A kezdőállapotból indulunk: <b className="font-mono">H₀ = {showSet(current)}</b>. Minden körben hozzávesszük
          azokat az állapotokat, ahová egy betűvel el lehet jutni.
        </p>
      </>
    );
  }

  const previous = result.reachableLayers[layer - 1];
  const added = current.filter((state) => !previous.includes(state));

  return (
    <>
      <p className="font-mono text-gray-900 dark:text-slate-900">
        H<sub>{layer}</sub> = {showSet(current)}
      </p>
      <p className="mt-1 text-gray-700 dark:text-slate-700">
        Új állapotok: <b className="font-mono">{added.join(", ")}</b>.
        {isLast && (
          <>
            {" "}
            Innen már nem jutunk új állapotba, tehát H<sub>{layer + 1}</sub> = H<sub>{layer}</sub>, ezek az elérhető
            állapotok.
          </>
        )}
      </p>
    </>
  );
}

function RemoveExplanation({ removed }: { removed: State[] }) {
  if (removed.length === 0) {
    return <p className="text-gray-700 dark:text-slate-700">Minden állapot elérhető, nincs mit elhagyni.</p>;
  }
  return (
    <p className="text-gray-700 dark:text-slate-700">
      A(z) <b className="font-mono">{removed.join(", ")}</b> állapotba semmi nem vezet, ezért az átmeneteivel együtt
      elhagyjuk.
    </p>
  );
}

function nextClasses(result: MinimizeResult, round: number): State[][] {
  const next = result.rounds[round + 1];
  if (next === undefined) {
    return result.rounds[round].classes;
  }
  return next.classes;
}

function RoundExplanation({ result, round }: { result: MinimizeResult; round: number }) {
  const classes = result.rounds[round].classes;
  const after = nextClasses(result, round);
  const isLast = round === result.rounds.length - 1;

  const splitClasses: string[] = [];
  classes.forEach((cls, index) => {
    const parts = after.filter((part) => cls.includes(part[0]));
    if (parts.length > 1) {
      splitClasses.push(`${className(index)} → ${parts.map(showSet).join(", ")}`);
    }
  });

  return (
    <>
      {round === 0 ? (
        <>
          <p className="font-semibold text-gray-900 dark:text-slate-900">2. lépés: ekvivalens állapotok összevonása</p>
          <p className="mt-1 text-gray-700 dark:text-slate-700">
            ∼₀ két osztálya a nem elfogadó és az elfogadó állapotok. Minden állapotban felírjuk, hogy az egyes betűkre{" "}
            <b>melyik osztályba</b> lép.
          </p>
        </>
      ) : (
        <p className="font-semibold text-gray-900 dark:text-slate-900">
          ∼<sub>{round}</sub> osztályaival ugyanezt megcsináljuk.
        </p>
      )}
      <p className="mt-1 text-gray-700 dark:text-slate-700">
        Egy osztályon belül azok maradnak együtt, akiknek a sora megegyezik.{" "}
        {isLast ? (
          <b>
            Semmi nem válik szét, tehát ∼<sub>{round}</sub> = ∼, kész vagyunk.
          </b>
        ) : (
          <>
            Szétválik: <b className="font-mono">{splitClasses.join("; ")}</b>.
          </>
        )}
      </p>
    </>
  );
}

function RoundTable({ dfa, result, round }: { dfa: Dfa; result: MinimizeResult; round: number }) {
  const current: PartitionRound = result.rounds[round];
  const after = nextClasses(result, round);

  function newClassOf(state: State): number {
    return after.findIndex((cls) => cls.includes(state));
  }

  const rows = [...current.rows].sort((a, b) => newClassOf(a.state) - newClassOf(b.state));

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-200">
      <table className="w-full text-center font-mono text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-100">
            <th className="p-2 text-gray-600 dark:text-slate-600">
              ∼<sub>{round}</sub> osztály
            </th>
            <th className="p-2 text-gray-600 dark:text-slate-600">állapot</th>
            {dfa.alphabet.map((letter) => (
              <th key={letter} className="p-2 text-gray-600 dark:text-slate-600">
                {letter}
              </th>
            ))}
            <th className="p-2 text-gray-600 dark:text-slate-600">
              ∼<sub>{round + 1}</sub> osztály
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.state} className="border-t border-gray-100 dark:border-slate-200">
              <td className="p-2">{className(row.classIndex)}</td>
              <td className="p-2">{row.state}</td>
              {dfa.alphabet.map((letter) => (
                <td key={letter} className="p-2">
                  {className(row.signature[letter])}
                </td>
              ))}
              <td className="p-2 font-semibold text-purple-700 dark:text-purple-300">
                {showSet(after[newClassOf(row.state)])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DoneExplanation({ result, original }: { result: MinimizeResult; original: Dfa }) {
  return (
    <>
      <p className="font-semibold text-gray-900 dark:text-slate-900">Kész a minimális automata!</p>
      <p className="mt-1 text-gray-700 dark:text-slate-700">
        {original.states.length} állapot helyett {result.minimal.states.length}. Minden osztályból egy állapot lett, és
        mindegy, melyik reprezentánsból olvassuk le az átmeneteket.
      </p>
    </>
  );
}
