import { useState, type ReactNode } from "react";
import { runAll, type Outputmap } from "@fotoc/automata-core";

type Props = {
  initialWord?: string;
  initialOther?: string;
  initialPower?: number;
};

function show(word: string): ReactNode {
  return word === "" ? <span className="italic text-purple-300">ε</span> : word;
}

function WordChip({ word }: { word: string }) {
  return (
    <span className="inline-block max-w-full break-all rounded-xl border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/40 px-4 py-2 font-mono text-base font-medium text-purple-800 dark:text-purple-200 shadow-sm">
      {show(word)}
    </span>
  );
}

function DashCard({ title, children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md flex flex-col gap-3 min-w-0 overflow-hidden">
      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
        <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function WordList({ title, words }: { title: string; words: string[] }) {
  return (
    <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md flex flex-col gap-4">
      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          {title}{" "}
          <span className="ml-1 rounded-full bg-purple-100 dark:bg-purple-800 px-2 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-300">
            {words.length} db
          </span>
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {words.map((w, i) => (
          <WordChip key={i} word={w} />
        ))}
      </div>
    </div>
  );
}

export function WordPlayground({ initialWord = "abc", initialOther = "ba", initialPower = 2 }: Props) {
  const [word, setWord] = useState(initialWord);
  const [other, setOther] = useState(initialOther);
  const [n, setN] = useState(initialPower);
  const [output, setOutput] = useState<Outputmap | null>(null);
  const [submittedOther, setSubmittedOther] = useState(initialOther);

  const MAX_LEN = 20;
  const wordError = word.length > MAX_LEN;
  const otherError = other.length > MAX_LEN;

  function handleSubmit() {
    if (wordError || otherError) return;
    const trimmed = other.trim();
    setSubmittedOther(trimmed);
    setOutput(runAll(word.trim(), trimmed, n));
  }

  const inputClass = "h-14 w-full rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 px-4 text-lg font-sans text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400";

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 py-8">
        <h1 className="text-4xl font-extrabold tracking-tight font-sans">Szóműveletek</h1>
        <p className="text-muted-foreground">Adj meg két szót és egy kitevőt, majd számítsd ki az összefűzésüket, hatványukat, tükörképüket és hosszukat.</p>

      <div className="rounded-3xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-8 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-slate-700">
              Szó (u)
            </span>
            <input
              className={inputClass}
              placeholder="pl. abc (üresen hagyva: ε)"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
            {wordError && (
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Túllépte a {MAX_LEN} karakteres határt ({word.length}/{MAX_LEN})
              </p>
            )}
          </label>

          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex-1 block space-y-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-700">
                Második szó (v) a konkatenációhoz
              </span>
              <input
                className={inputClass}
                placeholder="pl. ba"
                value={other}
                onChange={(e) => setOther(e.target.value)}
              />
              {otherError && (
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Túllépte a {MAX_LEN} karakteres határt ({other.length}/{MAX_LEN})
                </p>
              )}
            </label>

            <label className="w-full sm:w-36 block space-y-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-700">
                Kitevő (n)
              </span>
              <input
                type="number"
                min={0}
                max={20}
                className={inputClass}
                value={n}
                onChange={(e) => setN(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={wordError || otherError}
            className="w-full sm:w-auto rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed px-10 py-4 text-lg font-bold text-white shadow-lg shadow-purple-200 dark:shadow-purple-900 transition-all">
            Számol
          </button>
        </form>
      </div>

      {output && (
        <div className="space-y-6">

          <div className="grid gap-4 grid-cols-2">
            <DashCard title="Hossz |u|">
              <div className="text-5xl font-extrabold font-mono text-purple-700 dark:text-purple-300">
                {output.length}
              </div>
              {output.length > 15 && (
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Túllépte a 15 karakteres ajánlott határt
                </p>
              )}
            </DashCard>

            <DashCard title="Tükörkép uᴿ">
              <div className="text-2xl">
                <WordChip word={output.reverse} />
              </div>
            </DashCard>

            <DashCard title="Konkatenáció uv">
              <div className="font-mono text-xl break-all">
                {output.concatenate === "" ? (
                  show("")
                ) : (
                  <>
                    <span className="text-yellow-600 dark:text-yellow-400">
                      {output.word === "" ? <span className="italic">ε</span> : output.word}
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      {submittedOther === "" ? <span className="italic">ε</span> : submittedOther}
                    </span>
                  </>
                )}
              </div>
            </DashCard>

            <DashCard title={`Hatvány u^${n}`}>
              <div className="text-2xl">
                <WordChip word={output.power} />
              </div>
            </DashCard>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
