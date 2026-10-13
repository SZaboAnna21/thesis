import { useEffect, useMemo, useState, type ButtonHTMLAttributes, type KeyboardEvent } from "react";
import { showRule, toNormalForm3Steps, type Grammer, type Nf3Phase, type Nf3Step, type Rule } from "@fotoc/automata-core";
import { GrammarInput } from "./InputGrammer";

// A jegyzet példája: van benne hosszú szabály, A → u szabály és kétlépéses lánc is.
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
    <div className="space-y-4">
      <GrammarInput initial={lectureExample} onChange={setGrammar} />
      <NormalForm3Player key={JSON.stringify(grammar)} grammar={grammar} />
    </div>
  );
}

function NormalForm3Player({ grammar }: { grammar: Grammer }) {
  const result = useMemo(() => toNormalForm3Steps(grammar), [grammar]);

  if (!result.ok) {
    return <p className="text-sm text-red-600">{result.message}</p>;
  }
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

  // A legutóbbi H(A)-táblázat, hogy a láncmentesítés alatt végig látszódjon.
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
      className="space-y-4 rounded border bg-white p-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <ol className="flex flex-wrap gap-1 text-xs">
        {PHASES.map((p, k) => (
          <li
            key={p.label}
            className={
              "rounded px-2 py-1 " +
              (k === phaseIndex
                ? "bg-brand-600 text-white"
                : k < phaseIndex
                  ? "bg-brand-100 text-brand-700"
                  : "bg-gray-100 text-gray-500")
            }
          >
            {p.label}
          </li>
        ))}
      </ol>

      <div className="rounded border border-brand-200 bg-brand-50 p-3">
        <p className="font-semibold">{step.title}</p>
        <p className="mt-1 text-sm">{step.explanation}</p>
      </div>

      <div className="space-y-3">
        <RuleList grammar={step.grammar} display={display} focus={step.focus} unreachable={step.unreachable} />
        {chainSets && step.phase !== "input" && step.phase !== "length" && (
          <ChainTable chainSets={chainSets} current={step.phase === "chain-closure" ? step.highlight?.[0] : undefined} />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
          className="min-w-24 flex-1 accent-brand-600"
          aria-label="Lépés"
        />
        <span className="text-sm tabular-nums text-gray-600">
          {i + 1} / {steps.length}
        </span>

        <select
          className="rounded border p-1 text-sm"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          aria-label="Sebesség"
        >
          {SPEEDS.map((s) => (
            <option key={s.ms} value={s.ms}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// A lépés utáni szabályok, plusz az ebben a lépésben kiesők (áthúzva).
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
    <div className="rounded border p-3 font-mono text-sm">
      {groups.map(({ n, rules }) => (
        <div
          key={n}
          className="flex flex-wrap items-baseline gap-x-1 gap-y-1 py-0.5"
          style={{ opacity: unreachable.includes(n) ? 0.4 : 1 }}
        >
          <span className="w-10 shrink-0 text-right font-semibold">{n}</span>
          <span className="text-gray-500">→</span>
          {rules.map((d, k) => {
            const isFocus = focus !== undefined && key(focus) === key(d.rule);
            return (
              <span key={`${key(d.rule)}:${d.status}`} className="flex items-baseline gap-1">
                {k > 0 && <span className="text-gray-400">|</span>}
                <span
                  title={showRule(d.rule)}
                  className={
                    "rounded px-1 transition-colors duration-500 " +
                    (d.status === "added"
                      ? "nf3-in bg-green-100 text-green-800"
                      : d.status === "removed"
                        ? "bg-red-50 text-red-600 line-through opacity-70"
                        : "") +
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
    <div className="overflow-x-auto rounded border p-3">
      <table className="w-full text-center font-mono text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-1 text-left">A</th>
            {Array.from({ length: width }, (_, k) => (
              <th key={k} className="p-1">
                H<sub>{k}</sub>
              </th>
            ))}
            <th className="p-1">H(A)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([A, layers]) => (
            <tr key={A} className={"border-t " + (A === current ? "bg-brand-50" : "")}>
              <td className="p-1 text-left font-semibold">{A}</td>
              {Array.from({ length: width }, (_, k) => (
                <td key={k} className="p-1 text-gray-600">
                  {layers[k] ? `{${layers[k].join(",")}}` : ""}
                </td>
              ))}
              <td className="p-1 font-semibold">{`{${layers[layers.length - 1].join(",")}}`}</td>
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
        "rounded border px-3 py-1 text-sm disabled:opacity-40 " +
        (primary ? "border-brand-600 bg-brand-600 text-white" : "bg-white hover:bg-gray-50")
      }
    />
  );
}
