import { useEffect, useState } from "react";
import { showRule, type CykResult, type CykStep, type Grammer, type Rule } from "@fotoc/automata-core";
import { call } from "../useCore";
import { GrammarInput } from "./InputGrammer";

const lectureExample: Grammer = {
  nonterminals: ["S", "A", "B", "X", "Y", "C", "U", "V", "W", "Z"],
  terminals: ["a", "b", "c"],
  start: "S",
  rules: [
    { from: "S", to: "AB" },
    { from: "S", to: "BC" },
    { from: "A", to: "XA" },
    { from: "A", to: "a" },
    { from: "X", to: "a" },
    { from: "C", to: "YC" },
    { from: "C", to: "c" },
    { from: "Y", to: "c" },
    { from: "B", to: "UV" },
    { from: "B", to: "VW" },
    { from: "B", to: "XS" },
    { from: "U", to: "XX" },
    { from: "W", to: "YY" },
    { from: "W", to: "XS" },
    { from: "V", to: "ZZ" },
    { from: "Z", to: "b" },
  ],
};

function showSet(symbols: string[]): string {
  if (symbols.length === 0) {
    return "{ }";
  }
  return `{${symbols.join(", ")}}`;
}

export function CykVisualizer() {
  const [grammar, setGrammar] = useState<Grammer>(lectureExample);
  const [word, setWord] = useState("aabbcc");

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-[min(100vw,80rem)] px-4 sm:px-6">
      <p className="mb-6 text-muted-foreground">Konfigurálj grammatikát Chomsky-normálformában és add meg a vizsgált szót. Az algoritmus mutatja meg, hogy levezethető-e a szó a grammatikából!</p>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="lg:w-[36rem] lg:shrink-0 space-y-6">
          <GrammarInput initial={lectureExample} onChange={setGrammar} />

          <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md">
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-700" htmlFor="cyk-word">
              Vizsgált szó
            </label>
            <input
              id="cyk-word"
              className="h-14 w-full rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 px-4 text-lg font-mono text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400"
              placeholder="Szó (üresen hagyva ε)"
              value={word}
              maxLength={10}
              onChange={(e) => setWord(e.target.value.trim().slice(0, 10))}
            />
            {word.length >= 10 && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Maximum 10 karakter</p>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <CykResultView key={JSON.stringify(grammar) + word} grammar={grammar} word={word} />
        </div>
      </div>
    </div>
  );
}

type CykWorkerResult = {
  cnf: { ok: true } | { ok: false; rule: Rule; reason: string };
  result?: CykResult;
  derivation?: string[] | null;
};

function CykResultView({ grammar, word }: { grammar: Grammer; word: string }) {
  const [data, setData] = useState<CykWorkerResult | null>(null);
  useEffect(() => {
    setData(null);
    call<CykWorkerResult>("cyk", grammar, word).then(setData);
  }, [grammar, word]);

  if (!data) return <p className="text-sm text-purple-400 dark:text-purple-300">Számítás…</p>;

  if (!data.cnf.ok) {
    return (
      <p className="rounded-xl border border-amber-200 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 px-4 py-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
        {showRule(data.cnf.rule)}: {data.cnf.reason}
      </p>
    );
  }

  const result = data.result!;
  if (!result.ok) {
    return (
      <p className="rounded-xl border border-red-200 dark:border-red-600 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-400">
        {result.error}
      </p>
    );
  }

  if (word === "") {
    return (
      <Answer
        word={word}
        table={result.table}
        accepted={result.accepted}
        derivation={data.derivation ?? null}
      />
    );
  }

  return (
    <CykPlayer
      grammar={grammar}
      word={word}
      table={result.table}
      steps={result.steps}
      accepted={result.accepted}
      derivation={data.derivation ?? null}
    />
  );
}

type PlayerProps = {
  grammar: Grammer;
  word: string;
  table: string[][][];
  steps: CykStep[];
  accepted: boolean;
  derivation: string[] | null;
};

function CykPlayer({ word, table, steps, accepted, derivation }: PlayerProps) {
  const [current, setCurrent] = useState(0);
  const [selectedH, setSelectedH] = useState<number | null>(null);

  const last = steps.length - 1;
  const step = steps[current];
  const selectedSplit = step.splits.find((split) => split.h === selectedH);

  function goTo(next: number) {
    setCurrent(next);
    setSelectedH(null);
  }

  return (
    <div className="space-y-6 rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md">
      <CykTable word={word} table={table} steps={steps} current={current} selectedH={selectedSplit?.h} />

      <div className="rounded-xl border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/40 p-4">
        <p className="font-semibold text-purple-800 dark:text-purple-200">
          H<sub>{step.i + 1},{step.j + 1}</sub> = {showSet(step.result)}
        </p>

        {step.i === step.j && (
          <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
            Azok a nemterminálisok, amelyekből van szabály a(z) <span className="font-mono">{word[step.i]}</span> betűre.
          </p>
        )}

        {step.splits.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-xs text-purple-500 dark:text-purple-400">
              A részszó minden kettévágását kipróbáljuk. Egy vágásra víve az egeret látszik a hozzá tartozó két cella.
            </p>
            {step.splits.map((split) => (
              <button
                key={split.h}
                type="button"
                className="block w-full rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-50 p-3 text-left font-mono text-sm text-purple-800 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                onMouseEnter={() => setSelectedH(split.h)}
                onMouseLeave={() => setSelectedH(null)}
                onFocus={() => setSelectedH(split.h)}
                onBlur={() => setSelectedH(null)}
              >
                {showSet(split.left)}
                {showSet(split.right)} = {showSet(split.pairs.map((pair) => pair.join("")))} → {showSet(split.found)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl border border-purple-300 dark:border-purple-600 bg-white dark:bg-slate-50 px-4 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={current === 0}
          onClick={() => goTo(current - 1)}
        >
          ◀ Vissza
        </button>
        <button
          type="button"
          className="rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 px-4 py-2 text-sm font-bold text-white shadow-md shadow-purple-200 dark:shadow-purple-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={current === last}
          onClick={() => goTo(current + 1)}
        >
          Következő ▶
        </button>
        <span className="rounded-full bg-purple-100 dark:bg-purple-800 px-2 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-300 tabular-nums">
          {current + 1} / {steps.length}
        </span>
      </div>

      {current === last && <Answer word={word} table={table} accepted={accepted} derivation={derivation} />}
    </div>
  );
}

type TableProps = {
  word: string;
  table: string[][][];
  steps: CykStep[];
  current: number;
  selectedH?: number;
};

function CykTable({ word, table, steps, current, selectedH }: TableProps) {
  const n = word.length;
  const step = steps[current];
  const doneSteps = steps.slice(0, current + 1);

  const columns: number[] = [];
  for (let i = 0; i < n; i++) {
    columns.push(i);
  }
  const lengths = [...columns].reverse().map((i) => i + 1);

  function cellColor(i: number, j: number): string {
    if (i === step.i && j === step.j) {
      return "bg-purple-600 text-white";
    }
    if (selectedH !== undefined && i === step.i && j === selectedH) {
      return "bg-amber-200 dark:bg-amber-700/50";
    }
    if (selectedH !== undefined && i === selectedH + 1 && j === step.j) {
      return "bg-green-200 dark:bg-green-700/50";
    }
    return "bg-white dark:bg-slate-50 text-gray-900 dark:text-slate-900";
  }

  return (
    <div className="overflow-x-auto">
      <table className="text-center font-mono text-sm">
        <tbody>
          {lengths.map((length) => (
            <tr key={length}>
              <th className="p-2 font-normal text-purple-400 dark:text-purple-300">{length}</th>
              {columns.map((i) => {
                const j = i + length - 1;
                if (j >= n) {
                  return <td key={i} />;
                }
                const isDone = doneSteps.some((done) => done.i === i && done.j === j);
                return (
                  <td key={i} className={"min-w-16 border border-purple-200 dark:border-purple-700 p-2 transition-colors " + cellColor(i, j)}>
                    {isDone ? showSet(table[i][j]) : ""}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <th />
            {columns.map((i) => (
              <td key={i} className="p-2 font-bold text-purple-700 dark:text-purple-300">
                {word[i]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type AnswerProps = {
  word: string;
  table: string[][][];
  accepted: boolean;
  derivation: string[] | null;
};

function Answer({ word, accepted, derivation }: AnswerProps) {
  const shownWord = word === "" ? "ε" : word;

  if (!accepted) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-400">
        {shownWord} ∉ L(G), mert a kezdőszimbólum nincs a csúcson.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 px-4 py-3 text-sm">
      <p className="font-semibold text-green-700 dark:text-green-400">{shownWord} ∈ L(G)</p>
      {derivation && <p className="mt-1 font-mono text-green-800 dark:text-green-300">{derivation.join(" ⇒ ")}</p>}
    </div>
  );
}
