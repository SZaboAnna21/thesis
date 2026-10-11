import { useState } from "react";
import { checkRegex, type RegexCheckResult } from "@fotoc/automata-core";
import type { RegexExercise } from "../modules/regexExercises";
import { MathText } from "./MathText";
import { RegexInput } from "./RegexInput";

type Props = {
  exercises: RegexExercise[];
};

const showWord = (word: string) => (word === "" ? "ε" : word);

function ResultBox({ result }: { result: RegexCheckResult }) {
  switch (result.status) {
    case "parse-error":
      return <p className="text-sm text-red-600">A kifejezés hibás: {result.error.message}</p>;
    case "foreign-letter":
      return <p className="text-sm text-red-600">A(z) „{result.letter}” betű nem eleme a feladat ábécéjének.</p>;
    case "equivalent":
      return (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-sm">
          <p className="font-semibold text-green-800">Helyes! 🎉</p>
          <p className="text-gray-600">
            A kifejezésed pontosan a kért nyelvet írja le. Ezt nem tippeltük: a két kifejezésből automatát építettünk, és
            ellenőriztük, hogy egyetlen szóban sem térnek el.
          </p>
        </div>
      );
    case "no-counterexample":
      return (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-sm">
          <p className="font-semibold text-green-800">Nagyon valószínű, hogy helyes.</p>
          <p className="text-gray-600">
            A legfeljebb {result.checkedUpTo} hosszú szavakon a kifejezésed pontosan a kért nyelvet adja. Ennél a
            feladatnál a nyelv feltétellel van megadva, ezért csak eddig a hosszig tudjuk ellenőrizni, bizonyítani nem.
          </p>
        </div>
      );
    case "counterexample": {
      const { word, inCandidate } = result.counterexample;
      return (
        <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm">
          <p className="font-semibold text-amber-800">Még nem jó. Ellenpélda: „{showWord(word)}”</p>
          <p className="text-gray-700">
            {inCandidate
              ? "A kifejezésed elfogadja ezt a szót, pedig nincs benne a nyelvben. Valahol túl engedékeny."
              : "Ez a szó benne van a nyelvben, de a kifejezésed nem írja le. Valamelyik esetet kihagytad."}
          </p>
          <p className="mt-1 text-xs text-gray-500">Ez a legrövidebb ilyen szó (shortlex sorrendben az első).</p>
        </div>
      );
    }
  }
}

export function RegexChecker({ exercises }: Props) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<RegexCheckResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const exercise = exercises[index];

  function selectExercise(next: number) {
    setIndex(next);
    setAnswer("");
    setResult(null);
    setShowHint(false);
    setShowSolution(false);
  }

  function changeAnswer(value: string) {
    setAnswer(value);
    // a régi eredmény már nem erre a kifejezésre vonatkozik
    setResult(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {exercises.map((ex, i) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => selectExercise(i)}
            className={`rounded border px-3 py-1 text-sm ${
              i === index ? "border-brand-500 bg-brand-50 font-semibold text-brand-700" : "hover:bg-gray-50"
            }`}
          >
            {i + 1}. {ex.title}
          </button>
        ))}
      </div>

      <form
        className="space-y-3 rounded border p-4"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(checkRegex(answer, exercise.reference, exercise.alphabet));
        }}
      >
        <p>
          Adj meg egy reguláris kifejezést, ami ezt a nyelvet írja le: <MathText text={exercise.statement} />
        </p>
        <RegexInput label="A te kifejezésed" value={answer} onChange={changeAnswer} alphabet={exercise.alphabet} />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
          >
            Ellenőrzés
          </button>
          <button type="button" onClick={() => setShowHint(!showHint)} className="rounded border px-4 py-2 hover:bg-gray-50">
            {showHint ? "Tipp elrejtése" : "Tipp"}
          </button>
          <button
            type="button"
            onClick={() => setShowSolution(!showSolution)}
            className="rounded border px-4 py-2 hover:bg-gray-50"
          >
            {showSolution ? "Megoldás elrejtése" : "Egy lehetséges megoldás"}
          </button>
        </div>

        {showHint && <p className="rounded bg-gray-50 p-3 text-sm text-gray-700">💡 {exercise.hint}</p>}
        {showSolution && (
          <p className="rounded bg-gray-50 p-3 text-sm text-gray-700">
            Egy lehetséges megoldás: <span className="font-mono">{exercise.solution}</span>
            <span className="block text-xs text-gray-500">
              Nem ez az egyetlen jó válasz: bármelyik kifejezés helyes, ami ugyanezt a nyelvet írja le.
            </span>
          </p>
        )}
      </form>

      {result && <ResultBox result={result} />}
    </div>
  );
}
