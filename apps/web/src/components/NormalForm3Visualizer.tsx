import { useEffect, useMemo, useState, type ButtonHTMLAttributes, type KeyboardEvent } from "react";
import { showRule, type Grammer, type Nf3Phase, type Nf3Result, type Nf3Step, type Rule } from "@fotoc/automata-core";
import { call } from "../useCore";
import { GrammarInput } from "./InputGrammer";


const lectureExample: Grammer = {
  nonterminals: ["S", "B", "V"],
  terminals: ["a", "b"],
  start: "S",
  rules: [
    { from: "S", to: "abS" },
    { from: "S", to: "B" },
    { from: "B", to: "bB" },
    { from: "B", to: "V" },
    { from: "V", to: "aa" },
    { from: "V", to: "b" },
  ],
};

const PHASES: { label: string; phases: Nf3Phase[] }[] = [
  { label: "Kiindulás", phases: ["input"] },
  { label: "1. Hosszredukció", phases: ["length"] },
  { label: "2. Láncmentesítés", phases: ["chain-closure", "chain-inherit", "chain-remove"] },
  { label: "Kész", phases: ["unreachable", "done"] },
];

const SPEEDS = [
  { label: "lassú", ms: 3500 },
  { label: "közepes", ms: 2200 },
  { label: "gyors", ms: 1000 },
];

type RuleStatus = "same" | "added" | "removed";
type DisplayRule = { rule: Rule; status: RuleStatus };

const key = (r: Rule) => `${r.from}→${r.to}`;

export function NormalForm3Visualizer() {
  const [grammar, setGrammar] = useState<Grammer>(lectureExample);

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-[min(100vw,80rem)] px-4 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="lg:w-[36rem] lg:shrink-0">
          <GrammarInput initial={lectureExample} onChange={setGrammar} />
        </div>
        <div className="min-w-0 flex-1">
          <NormalForm3Player key={JSON.stringify(grammar)} grammar={grammar} />
        </div>
      </div>
    </div>
  );
}

function NormalForm3Player({ grammar }: { grammar: Grammer }) {
  const [result, setResult] = useState<Nf3Result | null>(null);
  useEffect(() => {
    setResult(null);
    call<Nf3Result>("normalForm3", grammar).then(setResult);
  }, [grammar]);

  if (!result)
    return (
      <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 px-6 py-5 text-sm font-semibold text-purple-400 shadow-md">
        Számítás…
      </div>
    );
  if (!result.ok)
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 px-6 py-4 text-sm font-semibold text-red-600 dark:text-red-400 shadow-md">
        {result.message}
      </div>
    );
  return <Player steps={result.steps} />;
}

function Player({ steps }: { steps: Nf3Step[] }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEEDS[1].ms);
  const last = steps.length - 1;
  const step = steps[i];
  const isPlaying = playing && i < last;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => setI((n) => Math.min(n + 1, last)), speed);
    return () => clearTimeout(timer);
  }, [isPlaying, i, speed, last]);

  const display = useMemo(() => displayRules(step), [step]);


  const chainSets = steps
    .slice(0, i + 1)
    .reverse()
    .find((s) => s.chainSets)?.chainSets;

  const go = (n: number) => setI(Math.max(0, Math.min(last, n)));
  const togglePlay = () => {
    if (!isPlaying && i >= last) setI(0);
    setPlaying(!isPlaying);
  };

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowRight") go(i + 1);
    else if (e.key === "ArrowLeft") go(i - 1);
    else if (e.key === " ") togglePlay();
    else return;
    e.preventDefault();
  }

  const phaseIndex = PHASES.findIndex((p) => p.phases.includes(step.phase));

  return (
    <div
      className="space-y-6 outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Fázisjelző */}
      <ol className="flex flex-wrap gap-2">
        {PHASES.map((p, k) => (
          <li
            key={p.label}
            className={
              "rounded-xl px-4 py-2 text-sm font-semibold transition-colors " +
              (k === phaseIndex
                ? "bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900"
                : k < phaseIndex
                  ? "border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                  : "border border-gray-200 dark:border-slate-300 bg-white dark:bg-slate-100 text-gray-400 dark:text-slate-500")
            }
          >
            {p.label}
          </li>
        ))}
      </ol>

      {/* Lépés magyarázat */}
      <div className="rounded-2xl border border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30 px-6 py-5 shadow-md">
        <p className="text-base font-bold text-purple-900 dark:text-purple-100">{step.title}</p>
        <p className="mt-2 text-sm text-purple-800 dark:text-purple-200">{step.explanation}</p>
      </div>

      {/* Szabályok + lánctábla */}
      <div className="space-y-4">
        <RuleList grammar={step.grammar} display={display} focus={step.focus} unreachable={step.unreachable} />
        {chainSets && step.phase !== "input" && step.phase !== "length" && (
          <ChainTable chainSets={chainSets} current={step.phase === "chain-closure" ? step.highlight?.[0] : undefined} />
        )}
      </div>

      {/* Vezérlők */}
      <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 px-6 py-4 shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => go(0)} disabled={i === 0} title="Elejére">⏮</Button>
          <Button onClick={() => go(i - 1)} disabled={i === 0} title="Vissza (←)">◀</Button>
          <Button onClick={togglePlay} title="Lejátszás / szünet (szóköz)" primary>
            {isPlaying ? "⏸" : "▶"}
          </Button>
          <Button onClick={() => go(i + 1)} disabled={i === last} title="Előre (→)">▶|</Button>
          <Button onClick={() => go(last)} disabled={i === last} title="Végére">⏭</Button>

          <input
            type="range"
            min={0}
            max={last}
            value={i}
            onChange={(e) => go(Number(e.target.value))}
            className="min-w-24 flex-1 accent-purple-600"
            aria-label="Lépés"
          />
          <span className="text-sm tabular-nums font-semibold text-gray-600 dark:text-slate-600">
            {i + 1} / {steps.length}
          </span>

          <select
            className="rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-label="Sebesség"
          >
            {SPEEDS.map((s) => (
              <option key={s.ms} value={s.ms}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}


function displayRules(step: Nf3Step): DisplayRule[] {
  const added = new Set(step.added.map(key));
  const current: DisplayRule[] = step.grammar.rules.map((rule) => ({
    rule,
    status: added.has(key(rule)) ? "added" : "same",
  }));
  const removed: DisplayRule[] = step.removed.map((rule) => ({ rule, status: "removed" }));
  return [...removed, ...current];
}

function RuleList({
  grammar,
  display,
  focus,
  unreachable = [],
}: {
  grammar: Grammer;
  display: DisplayRule[];
  focus?: Rule;
  unreachable?: string[];
}) {
  const groups = grammar.nonterminals
    .map((n) => ({ n, rules: display.filter((d) => d.rule.from === n) }))
    .filter((g) => g.rules.length > 0);

  return (
    <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 px-6 py-4 font-mono shadow-md">
      {groups.map(({ n, rules }) => (
        <div
          key={n}
          className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-1.5"
          style={{ opacity: unreachable.includes(n) ? 0.35 : 1 }}
        >
          <span className="w-10 shrink-0 text-right text-base font-bold text-purple-700 dark:text-purple-300">{n}</span>
          <span className="text-gray-400 dark:text-slate-400">→</span>
          {rules.map((d, k) => {
            const isFocus = focus !== undefined && key(focus) === key(d.rule);
            return (
              <span key={`${key(d.rule)}:${d.status}`} className="flex items-baseline gap-1">
                {k > 0 && <span className="text-gray-300 dark:text-slate-500">|</span>}
                <span
                  title={showRule(d.rule)}
                  className={
                    "rounded-lg px-2 py-0.5 text-base transition-colors duration-500 " +
                    (d.status === "added"
                      ? "nf3-in bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-semibold"
                      : d.status === "removed"
                        ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 line-through opacity-60"
                        : "text-gray-800 dark:text-slate-800") +
                    (isFocus ? " ring-2 ring-amber-400" : "")
                  }
                >
                  {d.rule.to || "ε"}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ChainTable({ chainSets, current }: { chainSets: Record<string, string[][]>; current?: string }) {
  const rows = Object.entries(chainSets);
  if (rows.length === 0) return null;
  const width = Math.max(...rows.map(([, layers]) => layers.length));

  return (
    <div className="overflow-x-auto rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 shadow-md">
      <table className="w-full text-center font-mono text-sm">
        <thead>
          <tr className="bg-purple-50 dark:bg-purple-900/20">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-700">A</th>
            {Array.from({ length: width }, (_, k) => (
              <th key={k} className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-slate-700">
                H<sub>{k}</sub>
              </th>
            ))}
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-slate-700">H(A)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([A, layers]) => (
            <tr key={A} className={"border-t border-gray-100 dark:border-slate-300 transition-colors " + (A === current ? "bg-purple-50 dark:bg-purple-900/20" : "hover:bg-gray-50 dark:hover:bg-slate-50/50")}>
              <td className="px-4 py-3 text-left font-bold text-purple-700 dark:text-purple-300">{A}</td>
              {Array.from({ length: width }, (_, k) => (
                <td key={k} className="px-4 py-3 text-gray-600 dark:text-slate-500">
                  {layers[k] ? `{${layers[k].join(",")}}` : ""}
                </td>
              ))}
              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-slate-900">{`{${layers[layers.length - 1].join(",")}}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Button({
  primary,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={
        "rounded-xl px-4 py-2 text-base font-semibold shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-40 " +
        (primary
          ? "bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-purple-200 dark:shadow-purple-900"
          : "border border-gray-200 dark:border-slate-300 bg-white dark:bg-slate-50 text-gray-700 dark:text-slate-700 hover:border-purple-300 hover:bg-purple-50")
      }
    />
  );
}
