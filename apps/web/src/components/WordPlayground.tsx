import { useState, type ReactNode } from "react";
import { runAll, type Outputmap } from "@fotoc/automata-core";

type Props = {
  initialWord?: string;
  initialOther?: string;
  initialPower?: number;
};

//ures szo megjelenitese
function show(word: string): ReactNode {
  return word === "" ? <span className="italic text-gray-400">ε</span> : word;
}

function WordChip({ word }: { word: string }) {
  return (
    <span className="inline-block rounded border bg-gray-50 px-2 py-0.5 font-mono">
      {show(word)}
    </span>
  );
}

function ResultCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded border p-3 space-y-2">
      <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
      {children}
    </div>
  );
}

function WordList({ title, words }: { title: string; words: string[] }) {
  return (
    <ResultCard title={`${title} (${words.length} db)`}>
      <div className="flex flex-wrap gap-2">
        {words.map((w, i) => (
          <WordChip key={i} word={w} />
        ))}
      </div>
    </ResultCard>
  );
}

export function WordPlayground({ initialWord = "abc", initialOther = "ba", initialPower = 2 }: Props) {
  const [word, setWord] = useState(initialWord);
  const [other, setOther] = useState(initialOther);
  const [n, setN] = useState(initialPower);
  const [output, setOutput] = useState<Outputmap | null>(null);

  function handleSubmit() {
    setOutput(runAll(word.trim(), other.trim(), n));
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="p-4 border rounded space-y-3"
      >
        <h2 className="font-bold text-lg">Szóműveletek</h2>

        <label className="block space-y-1">
          <span className="text-sm text-gray-600">Szó (u)</span>
          <input
            className="border p-2 w-full font-mono"
            placeholder="pl. abc (üresen hagyva: ε)"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
        </label>

        <div className="flex gap-3">
          <label className="block space-y-1 flex-1">
            <span className="text-sm text-gray-600">Második szó (v) a konkatenációhoz</span>
            <input
              className="border p-2 w-full font-mono"
              placeholder="pl. ba"
              value={other}
              onChange={(e) => setOther(e.target.value)}
            />
          </label>

          <label className="block space-y-1 w-28">
            <span className="text-sm text-gray-600">Kitevő (n)</span>
            <input
              type="number"
              min={0}
              max={20}
              className="border p-2 w-full font-mono"
              value={n}
              onChange={(e) => setN(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
            />
          </label>
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Számol
        </button>
      </form>

      {output && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard title="Hossz |u|">
              <div className="font-mono text-xl">{output.length}</div>
            </ResultCard>

            <ResultCard title="Tükörkép uᴿ">
              <WordChip word={output.reverse} />
            </ResultCard>

            <ResultCard title="Konkatenáció uv">
              <div className="font-mono">
                <span className="bg-yellow-100">{output.word}</span>
                <span className="bg-green-100">{other.trim()}</span>
                {output.concatenate === "" && show("")}
              </div>
            </ResultCard>

            <ResultCard title={`Hatvány u^${n}`}>
              <WordChip word={output.power} />
            </ResultCard>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <WordList title="Prefixek" words={output.prefixes} />
            <WordList title="Valódi prefixek" words={output.properPrefixes} />
            <WordList title="Szuffixek" words={output.suffixes} />
            <WordList title="Valódi szuffixek" words={output.properSuffixes} />
          </div>
        </div>
      )}
    </div>
  );
}
