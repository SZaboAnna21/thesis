import { useMemo } from "react";
import { dfaToNfa, minimize, type Dfa, type MinimizeResult, type PartitionRound, type State } from "@fotoc/automata-core";
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

export function MinimizerLab({ dfa }: { dfa: Dfa }) {
  const result = useMemo(() => minimize(dfa), [dfa]);
  const steps = useMemo(() => buildSteps(result), [result]);
  const player = usePlayer(steps.length);
  const step = steps[player.index];

  const lastLayer = result.reachableLayers[result.reachableLayers.length - 1];
  let reached: State[] = lastLayer;
  if (step.kind === "reach") {
    reached = result.reachableLayers[step.layer];
  }
  const removedShown = step.kind !== "reach";

  return (
    <div
      className="space-y-4 rounded border bg-white p-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
      tabIndex={0}
      onKeyDown={player.onKeyDown}
    >
      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-gray-500">A kiinduló DVA</p>
        <DfaTable dfa={dfa} highlighted={step.kind === "reach" ? reached : []} removed={removedShown ? result.removed : []} />
      </div>

      <div className="rounded border border-brand-200 bg-brand-50 p-3 text-sm">
        {step.kind === "reach" && <ReachExplanation result={result} layer={step.layer} />}
        {step.kind === "remove" && <RemoveExplanation removed={result.removed} />}
        {step.kind === "round" && <RoundExplanation result={result} round={step.round} />}
        {step.kind === "done" && <DoneExplanation result={result} original={dfa} />}
      </div>

      {step.kind === "round" && <RoundTable dfa={dfa} result={result} round={step.round} />}

      {step.kind === "done" && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase text-gray-500">A minimális automata</p>
          <DfaTable dfa={result.minimal} />
          <AutomatonGraph automaton={dfaToNfa(result.minimal)} active={[]} />
        </div>
      )}

      <PlayerControls player={player} />
    </div>
  );
}

function DfaTable({ dfa, highlighted = [], removed = [] }: { dfa: Dfa; highlighted?: State[]; removed?: State[] }) {
  return (
    <div className="overflow-x-auto rounded border bg-white p-3">
      <table className="w-full text-center font-mono text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-1"></th>
            {dfa.alphabet.map((letter) => (
              <th key={letter} className="p-1">
                {letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dfa.states.map((state) => {
            let rowStyle = "border-t";
            if (highlighted.includes(state)) {
              rowStyle += " bg-brand-100 font-semibold";
            }
            if (removed.includes(state)) {
              rowStyle += " text-gray-400 line-through";
            }
            return (
              <tr key={state} className={rowStyle}>
                <td className="p-1 text-left">
                  <span className="inline-block w-5 text-gray-500">{stateMarker(dfa, state)}</span>
                  {state}
                </td>
                {dfa.alphabet.map((letter) => (
                  <td key={letter} className="p-1">
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
        <p className="font-semibold">1. lépés: összefüggővé alakítás</p>
        <p className="mt-1">
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
      <p className="font-mono">
        H<sub>{layer}</sub> = {showSet(current)}
      </p>
      <p className="mt-1">
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
    return <p>Minden állapot elérhető, nincs mit elhagyni.</p>;
  }
  return (
    <p>
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
          <p className="font-semibold">2. lépés: ekvivalens állapotok összevonása</p>
          <p className="mt-1">
            ∼₀ két osztálya a nem elfogadó és az elfogadó állapotok. Minden állapotnál felírjuk, hogy az egyes betűkre{" "}
            <b>melyik osztályba</b> lép.
          </p>
        </>
      ) : (
        <p className="font-semibold">
          ∼<sub>{round}</sub> osztályaival ugyanezt megcsináljuk.
        </p>
      )}
      <p className="mt-1">
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
    <div className="overflow-x-auto rounded border bg-white p-3">
      <table className="w-full text-center font-mono text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-1">
              ∼<sub>{round}</sub> osztály
            </th>
            <th className="p-1">állapot</th>
            {dfa.alphabet.map((letter) => (
              <th key={letter} className="p-1">
                {letter}
              </th>
            ))}
            <th className="p-1">
              ∼<sub>{round + 1}</sub> osztály
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.state} className="border-t">
              <td className="p-1">{className(row.classIndex)}</td>
              <td className="p-1">{row.state}</td>
              {dfa.alphabet.map((letter) => (
                <td key={letter} className="p-1">
                  {className(row.signature[letter])}
                </td>
              ))}
              <td className="p-1 font-semibold text-brand-700">{showSet(after[newClassOf(row.state)])}</td>
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
      <p className="font-semibold">Kész a minimális automata!</p>
      <p className="mt-1">
        {original.states.length} állapot helyett {result.minimal.states.length}. Minden osztályból egy állapot lett, és
        mindegy, melyik reprezentánsból olvassuk le az átmeneteket.
      </p>
    </>
  );
}
