import { useState } from "react";
import { ReactFlow, Background, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { possibleSteps, applyStep, type Grammer, type Rule, type Step } from "@fotoc/automata-core";
import { useTheme } from "../theme";

type Props = {
  grammer: Grammer;
  word: string;
};

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
    <div className="space-y-6">
        <h3 className="text-3xl font-bold text-white">Grammatika-levezetés</h3>
      

      <div className="grid gap-6 md:grid-cols-[22rem_1fr]">
        <div className="space-y-5">

          <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md">
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">Aktuális szó</p>
            <div className="mt-3 rounded-xl border border-gray-200 dark:border-slate-200 bg-purple-50 dark:bg-purple-900/30 px-4 py-3 font-mono text-2xl font-bold text-purple-800 dark:text-purple-200">
              {showWord(current)}
            </div>
            {finished && (
              <p className="mt-3 rounded-xl bg-green-50 dark:bg-green-900/30 px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-300">
                ✓ Terminális szót kaptunk, a levezetés kész.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
              1. Válassz szabályt
            </p>
            <div className="flex flex-wrap gap-2">
              {grammer.rules.map((rule, i) => {
                const usable = allSteps.some((s) => s.rule === rule);
                return (
                  <button
                    key={i}
                    disabled={!usable}
                    onClick={() => setSelectedRule(rule)}
                    className={
                      "rounded-xl border px-4 py-2 font-mono text-base font-medium shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-40 " +
                      (rule === selectedRule
                        ? "border-purple-600 bg-purple-100 dark:bg-purple-800 text-purple-900 dark:text-purple-100"
                        : "border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 hover:border-purple-400 hover:bg-purple-100")
                    }
                  >
                    {showRule(rule)}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedRule && (
            <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
                2. Hol alkalmazzuk?
              </p>
              <div className="flex flex-wrap gap-2">
                {options.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => handleStep(step)}
                    className="rounded-xl border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 font-mono text-base font-medium text-amber-900 dark:text-amber-200 shadow-sm transition-all hover:border-amber-500 hover:bg-amber-100"
                  >
                    {current.slice(0, step.position)}
                    <span className="rounded bg-amber-300 dark:bg-amber-600 px-0.5 font-bold">{step.rule.from}</span>
                    {current.slice(step.position + step.rule.from.length)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={undo}
              disabled={history.length === 1}
              className="flex-1 rounded-xl border border-gray-200 dark:border-slate-400 bg-white dark:bg-slate-100 px-4 py-3 text-base font-semibold text-gray-700 dark:text-slate-700 shadow-sm transition-all hover:border-purple-300 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Vissza
            </button>
            <button
              onClick={reset}
              disabled={history.length === 1}
              className="flex-1 rounded-xl border border-gray-200 dark:border-slate-400 bg-white dark:bg-slate-100 px-4 py-3 text-base font-semibold text-gray-700 dark:text-slate-700 shadow-sm transition-all hover:border-purple-300 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Újrakezdés
            </button>
          </div>
        </div>

        <div className="min-h-[32rem] overflow-hidden rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 shadow-md">
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
    </div>
  );
}
