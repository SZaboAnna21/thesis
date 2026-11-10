import { useEffect, useMemo, useState, type ReactNode } from "react";
import { call } from "../useCore";
import { RegexInput } from "./RegexInput";
import { readRegex } from "./readRegex";

type Props = {
  initialAlphabet?: string;
  initialFirst?: string;
  initialSecond?: string;
};

// Egy műveletnél legfeljebb ennyi szót írunk ki, a többit csak megszámoljuk.
const SHOWN_WORDS = 40;

type WordEntry = {
  word: string;
  // ha a szó többféleképpen áll elő (konkatenáció), a felbontások
  splits?: string[];
};

type Operation = {
  title: string;
  note?: string;
  entries: WordEntry[];
};

function show(word: string): ReactNode {
  return word === "" ? <span className="italic text-gray-400">ε</span> : word;
}

function WordChip({ entry }: { entry: WordEntry }) {
  const ambiguous = entry.splits !== undefined && entry.splits.length > 1;
  return (
    <span
      title={ambiguous ? entry.splits!.join(" és ") : undefined}
      className={`inline-block rounded border px-2 py-0.5 font-mono ${
        ambiguous ? "border-amber-400 bg-amber-50" : "bg-gray-50"
      }`}
    >
      {show(entry.word)}
    </span>
  );
}

function OperationCard({ operation }: { operation: Operation }) {
  const hidden = operation.entries.length - SHOWN_WORDS;
  return (
    <div className="space-y-2 rounded border p-3">
      <h3 className="text-sm font-semibold text-gray-600">{operation.title}</h3>
      {operation.entries.length === 0 ? (
        <p className="text-sm italic text-gray-400">nincs ilyen szó ebben a hosszban</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {operation.entries.slice(0, SHOWN_WORDS).map((entry) => (
            <WordChip key={entry.word} entry={entry} />
          ))}
          {hidden > 0 && <span className="self-center text-sm text-gray-500">+{hidden} további</span>}
        </div>
      )}
      {operation.note && <p className="text-xs text-gray-500">{operation.note}</p>}
    </div>
  );
}


export function LanguageExplorer({
  initialAlphabet = "ab",
  initialFirst = "ab + bb",
  initialSecond = "ε + a + bba",
}: Props) {
  const [alphabetText, setAlphabetText] = useState(initialAlphabet);
  const [first, setFirst] = useState(initialFirst);
  const [second, setSecond] = useState(initialSecond);
  const [maxLength, setMaxLength] = useState(5);

  const alphabet = useMemo(
    () => [...new Set([...alphabetText].filter((c) => /[a-z0-9]/i.test(c)))],
    [alphabetText],
  );
  const firstState = useMemo(() => readRegex(first, alphabet), [first, alphabet]);
  const secondState = useMemo(() => readRegex(second, alphabet), [second, alphabet]);

  const [operations, setOperations] = useState<Operation[] | null>(null);
  const [computing, setComputing] = useState(false);
  useEffect(() => {
    if (!firstState.ok || !secondState.ok || alphabet.length === 0) {
      setOperations(null);
      setComputing(false);
      return;
    }
    setComputing(true);
    setOperations(null);
    call<Operation[]>("languageOps", firstState.regex, secondState.regex, alphabet, maxLength).then(
      (ops) => {
        setOperations(ops);
        setComputing(false);
      },
    );
  }, [firstState, secondState, alphabet, maxLength]);

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded border p-4">
        <p className="text-sm text-gray-600">
          Add meg a két nyelvet reguláris kifejezéssel (unió: +, lezárás: *, konkatenáció: egymás mellé írás). A
          modul shortlex sorrendben kiírja a műveletek eredményének szavait a megadott hosszig.
        </p>
        <div className="flex gap-3">
          <label className="block flex-1 space-y-1">
            <span className="text-sm text-gray-600">Ábécé (Σ)</span>
            <input
              className="w-full border p-2 font-mono"
              value={alphabetText}
              onChange={(e) => setAlphabetText(e.target.value)}
              placeholder="pl. ab"
            />
          </label>
          <label className="block w-40 space-y-1">
            <span className="text-sm text-gray-600">Max. szóhossz: {maxLength}</span>
            <input
              type="range"
              min={1}
              max={8}
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
        <RegexInput label="L₁" value={first} onChange={setFirst} alphabet={alphabet} />
        <RegexInput label="L₂" value={second} onChange={setSecond} alphabet={alphabet} />
      </div>

      {alphabet.length === 0 && <p className="text-sm text-red-600">Adj meg legalább egy betűt az ábécében.</p>}

      {computing && <p className="text-center text-sm text-gray-400">Számítás…</p>}

      {operations && (
        <div className="grid gap-3 sm:grid-cols-2">
          {operations.map((operation) => (
            <OperationCard key={operation.title} operation={operation} />
          ))}
        </div>
      )}
    </div>
  );
}
