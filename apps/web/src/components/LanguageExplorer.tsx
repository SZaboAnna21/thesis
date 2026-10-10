import { useMemo, useState, type ReactNode } from "react";
import {
  concatSplits,
  inKleeneStar,
  nfaAccepts,
  nfaAcceptsPrefix,
  nfaAcceptsSuffix,
  regexToNfa,
  reverse,
  shortlex,
} from "@fotoc/automata-core";
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

const pieceOf = (word: string, split: number) =>
  `${word.slice(0, split) || "ε"} · ${word.slice(split) || "ε"}`;

export function LanguageExplorer({
  initialAlphabet = "ab",
  initialFirst = "ab + bb",
  initialSecond = "ε + a + bba",
}: Props) {
  const [alphabetText, setAlphabetText] = useState(initialAlphabet);
  const [first, setFirst] = useState(initialFirst);
  const [second, setSecond] = useState(initialSecond);
  const [maxLength, setMaxLength] = useState(5);

  // Az ábécé a beírt egyedi betűk, a beírás sorrendjében (ez a shortlex sorrend is).
  const alphabet = useMemo(
    () => [...new Set([...alphabetText].filter((c) => /[a-z0-9]/i.test(c)))],
    [alphabetText],
  );
  const firstState = useMemo(() => readRegex(first, alphabet), [first, alphabet]);
  const secondState = useMemo(() => readRegex(second, alphabet), [second, alphabet]);

  const operations = useMemo((): Operation[] | null => {
    if (!firstState.ok || !secondState.ok || alphabet.length === 0) return null;

    const nfa1 = regexToNfa(firstState.regex);
    const nfa2 = regexToNfa(secondState.regex);
    const in1 = (u: string) => nfaAccepts(nfa1, u);
    const in2 = (u: string) => nfaAccepts(nfa2, u);
    const words = [...shortlex(alphabet, maxLength)];
    const where = (test: (u: string) => boolean): WordEntry[] =>
      words.filter(test).map((word) => ({ word }));

    const concat: WordEntry[] = [];
    for (const word of words) {
      const splits = concatSplits(word, in1, in2);
      if (splits.length > 0) concat.push({ word, splits: splits.map((s) => pieceOf(word, s)) });
    }
    const ambiguous = concat.filter((e) => e.splits!.length > 1).length;

    return [
      { title: "L₁", entries: where(in1) },
      { title: "L₂", entries: where(in2) },
      { title: "L₁ ∪ L₂", entries: where((u) => in1(u) || in2(u)) },
      { title: "L₁ ∩ L₂", entries: where((u) => in1(u) && in2(u)) },
      { title: "L₁ − L₂", entries: where((u) => in1(u) && !in2(u)) },
      {
        title: "L₁ komplementere",
        note: `A komplementer mindig az ábécéhez képest értendő: most Σ = {${alphabet.join(", ")}}.`,
        entries: where((u) => !in1(u)),
      },
      {
        title: "L₁L₂",
        note:
          ambiguous > 0
            ? `${ambiguous} szó többféleképpen is előáll (sárgával jelölve, vidd fölé az egeret a felbontásokért). Ezért lehet |L₁L₂| < |L₁|·|L₂|.`
            : "Minden szó pontosan egyféleképpen áll elő.",
        entries: concat,
      },
      { title: "L₂L₁", note: "A konkatenáció nem kommutatív: vesd össze L₁L₂-vel!", entries: where((u) => concatSplits(u, in2, in1).length > 0) },
      { title: "L₁*", entries: where((u) => inKleeneStar(u, in1)) },
      {
        title: "L₁⁺",
        note: "Ha ε ∈ L₁, akkor L₁⁺ = L₁*, különben L₁⁺ = L₁* − {ε}.",
        entries: where((u) => u !== "" ? inKleeneStar(u, in1) : in1("")),
      },
      { title: "L₁ᴿ", entries: where((u) => in1(reverse(u))) },
      { title: "Pre(L₁)", note: "L₁ ⊆ Pre(L₁) mindig teljesül.", entries: where((u) => nfaAcceptsPrefix(nfa1, u)) },
      { title: "Suf(L₁)", note: "L₁ ⊆ Suf(L₁) mindig teljesül.", entries: where((u) => nfaAcceptsSuffix(nfa1, u)) },
    ];
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
