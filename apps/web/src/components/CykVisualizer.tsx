import { useState } from "react";
import { cyk, cykDerivation, isChomskyNormalForm, showRule, type CykStep, type Grammer } from "@fotoc/automata-core";
import { GrammarInput } from "./InputGrammer";

// A jegyzet példája.
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
    <div className="space-y-4">
      <GrammarInput initial={lectureExample} onChange={setGrammar} />

      <input
        className="border p-2 w-full font-mono"
        placeholder="Szó (üresen hagyva ε)"
        value={word}
        onChange={(e) => setWord(e.target.value.trim())}
      />

      <CykResultView key={JSON.stringify(grammar) + word} grammar={grammar} word={word} />
    </div>
  );
}

function CykResultView({ grammar, word }: { grammar: Grammer; word: string }) {
  const cnf = isChomskyNormalForm(grammar);
  if (!cnf.ok) {
    return (
      <p className="text-sm text-red-600">
        {showRule(cnf.rule)}: {cnf.reason}
      </p>
    );
  }

  const result = cyk(grammar, word);
  if (!result.ok) {
    return <p className="text-sm text-red-600">{result.error}</p>;
  }

  if (word === "") {
    return <Answer grammar={grammar} word={word} table={result.table} accepted={result.accepted} />;
  }

  return (
    <CykPlayer
      grammar={grammar}
      word={word}
      table={result.table}
      steps={result.steps}
      accepted={result.accepted}
    />
  );
}

type PlayerProps = {
  grammar: Grammer;
  word: string;
  table: string[][][];
  steps: CykStep[];
  accepted: boolean;
};

function CykPlayer({ grammar, word, table, steps, accepted }: PlayerProps) {
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
    <div className="space-y-4 rounded border bg-white p-4">
      <CykTable word={word} table={table} steps={steps} current={current} selectedH={selectedSplit?.h} />

      <div className="rounded border border-brand-200 bg-brand-50 p-3">
        <p className="font-semibold">
          H<sub>{step.i + 1},{step.j + 1}</sub> = {showSet(step.result)}
        </p>

        {step.i === step.j && (
          <p className="mt-1 text-sm">
            Azok a nemterminálisok, amelyekből van szabály a(z) <span className="font-mono">{word[step.i]}</span> betűre.
          </p>
        )}

        {step.splits.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">
              A részszó minden kettévágását kipróbáljuk. Egy vágásra víve az egeret látszik a hozzá tartozó két cella.
            </p>
            {step.splits.map((split) => (
              <button
                key={split.h}
                type="button"
                className="block w-full rounded border bg-white p-2 text-left font-mono text-sm hover:bg-gray-50"
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

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-40"
          disabled={current === 0}
          onClick={() => goTo(current - 1)}
        >
          ◀ Vissza
        </button>
        <button
          type="button"
          className="rounded border border-brand-600 bg-brand-600 px-3 py-1 text-sm text-white disabled:opacity-40"
          disabled={current === last}
          onClick={() => goTo(current + 1)}
        >
          Következő ▶
        </button>
        <span className="text-sm tabular-nums text-gray-600">
          {current + 1} / {steps.length}
        </span>
      </div>

      {current === last && <Answer grammar={grammar} word={word} table={table} accepted={accepted} />}
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
      return "bg-brand-600 text-white";
    }
    if (selectedH !== undefined && i === step.i && j === selectedH) {
      return "bg-amber-200";
    }
    if (selectedH !== undefined && i === selectedH + 1 && j === step.j) {
      return "bg-green-200";
    }
    return "";
  }

  return (
    <div className="overflow-x-auto">
      <table className="text-center font-mono text-sm">
        <tbody>
          {lengths.map((length) => (
            <tr key={length}>
              <th className="p-2 font-normal text-gray-500">{length}</th>
              {columns.map((i) => {
                const j = i + length - 1;
                if (j >= n) {
                  return <td key={i} />;
                }
                const isDone = doneSteps.some((done) => done.i === i && done.j === j);
                return (
                  <td key={i} className={"min-w-16 border p-2 " + cellColor(i, j)}>
                    {isDone ? showSet(table[i][j]) : ""}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <th />
            {columns.map((i) => (
              <td key={i} className="p-2 font-semibold">
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
  grammar: Grammer;
  word: string;
  table: string[][][];
  accepted: boolean;
};

function Answer({ grammar, word, table, accepted }: AnswerProps) {
  const shownWord = word === "" ? "ε" : word;

  if (!accepted) {
    return (
      <p className="rounded border p-3 text-sm text-red-600">
        {shownWord} ∉ L(G), mert {grammar.start} nincs a csúcson.
      </p>
    );
  }

  const derivation = cykDerivation(grammar, word, table);

  return (
    <div className="rounded border p-3 text-sm">
      <p className="text-green-700">{shownWord} ∈ L(G)</p>
      <p className="mt-1 font-mono">{derivation?.join(" ⇒ ")}</p>
    </div>
  );
}
