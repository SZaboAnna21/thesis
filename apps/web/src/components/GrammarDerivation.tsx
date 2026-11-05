import { useState } from "react";
import { ReactFlow, Background, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { possibleSteps, applyStep, type Grammer, type Rule, type Step } from "@fotoc/automata-core";
import { useTheme } from "../theme";

type Props = {
  grammer: Grammer;
  word: string;
};

// Egy levezetési lépés: a kapott szó, és hogy milyen lépéssel jutottunk ide.
type Entry = {
  word: string;
  step?: Step;
};

const showWord = (w: string) => (w === "" ? "ε" : w);
const showRule = (rule: Rule) => `${rule.from} → ${showWord(rule.to)}`;

function Highlighted({ entry }: { entry: Entry }) {
  if (!entry.step) return <>{showWord(entry.word)}</>;

  const start = entry.step.position;
  const end = start + entry.step.rule.to.length;
  return (
    <>
      {entry.word.slice(0, start)}
      <span className="rounded bg-amber-200 px-0.5 font-bold">{entry.step.rule.to || "ε"}</span>
      {entry.word.slice(end)}
    </>
  );
}

function buildNodes(history: Entry[]): Node[] {
  return history.map((entry, i) => ({
    id: String(i),
    position: { x: 0, y: i * 70 },
    data: { label: <Highlighted entry={entry} /> },
    style: { width: "auto", minWidth: 40, padding: "4px 8px" },
    className: "font-mono text-sm " + (i === history.length - 1 ? "!border-2 !border-brand-600" : ""),
  }));
}

function buildEdges(history: Entry[]): Edge[] {
  return history.slice(1).map((entry, i) => ({
    id: `${i}-${i + 1}`,
    source: String(i),
    target: String(i + 1),
    label: showRule(entry.step!.rule),
    labelStyle: { fontFamily: "monospace" },
  }));
}

export function GrammarDerivation({ grammer, word }: Props) {
  const theme = useTheme();
  const [history, setHistory] = useState<Entry[]>([{ word }]);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  const current = history[history.length - 1].word;
  const allSteps = possibleSteps(grammer, current);
  const options = allSteps.filter((s) => s.rule === selectedRule);
  const finished = !grammer.nonterminals.some((n) => current.includes(n));

  function handleStep(step: Step) {
    setHistory([...history, { word: applyStep(current, step), step }]);
    setSelectedRule(null);
  }

  function undo() {
    setHistory(history.slice(0, -1));
    setSelectedRule(null);
  }

  function reset() {
    setHistory([{ word }]);
    setSelectedRule(null);
  }

  return (
    <div className="grid h-[34rem] overflow-hidden rounded border bg-white md:grid-cols-[20rem_1fr]">
      <div className="space-y-4 overflow-y-auto border-b p-4 md:border-r md:border-b-0">
        <div>
          <h3 className="text-sm font-semibold text-gray-600">Aktuális szó</h3>
          <div className="mt-1 rounded border bg-gray-50 p-2 font-mono text-lg">{showWord(current)}</div>
          {finished && <p className="mt-1 text-sm text-green-700">Terminális szót kaptunk, a levezetés kész.</p>}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600">1. Válassz szabályt</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {grammer.rules.map((rule, i) => {
              const usable = allSteps.some((s) => s.rule === rule);
              return (
                <button
                  key={i}
                  disabled={!usable}
                  onClick={() => setSelectedRule(rule)}
                  className={
                    "rounded border px-1.5 py-0.5 font-mono text-sm disabled:opacity-40 " +
                    (rule === selectedRule ? "border-brand-600 bg-brand-100" : "hover:bg-gray-100")
                  }
                >
                  {showRule(rule)}
                </button>
              );
            })}
          </div>
        </div>

        {selectedRule && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600">2. Hol alkalmazzuk?</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {options.map((step, i) => (
                <button
                  key={i}
                  onClick={() => handleStep(step)}
                  className="rounded border px-1.5 py-0.5 font-mono text-sm hover:bg-green-100"
                >
                  {current.slice(0, step.position)}
                  <span className="rounded bg-amber-200 font-bold">{step.rule.from}</span>
                  {current.slice(step.position + step.rule.from.length)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={undo} disabled={history.length === 1} className="rounded border px-3 py-1 disabled:opacity-40">
            Vissza
          </button>
          <button onClick={reset} disabled={history.length === 1} className="rounded border px-3 py-1 disabled:opacity-40">
            Újrakezdés
          </button>
        </div>
      </div>

      <div className="min-h-64 bg-gray-50">
        <ReactFlow
          key={history.length}
          nodes={buildNodes(history)}
          edges={buildEdges(history)}
          colorMode={theme}
          nodeOrigin={[0.5, 0]}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          preventScrolling={false}
        >
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
