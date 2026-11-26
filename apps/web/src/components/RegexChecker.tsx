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
      return (
        <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-white dark:bg-slate-100 p-6 shadow-md">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {"A kifejezés hibás: "}{result.error.message}
          </p>
        </div>
      );
    case "foreign-letter":
      return (
        <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-white dark:bg-slate-100 p-6 shadow-md">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {`A(z) „${result.letter}” betű nem eleme a feladat ábécéjének.`}
          </p>
        </div>
      );
    case "equivalent":
      return (
        <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-white dark:bg-slate-100 p-6 shadow-md">
          <p className="font-bold text-green-700 dark:text-green-400 mb-1">{"Helyes! 🎉"}</p>
          <p className="text-sm text-gray-600 dark:text-slate-600">
            {"A kifejezésed pontosan a kért nyelvet írja le. Ezt nem tippeltük: a két kifejezésből automatát építüttük, és ellenőriztük, hogy egyetlen szóban sem térnek el."}
          </p>
        </div>
      );
    case "no-counterexample":
      return (
        <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-white dark:bg-slate-100 p-6 shadow-md">
          <p className="font-bold text-green-700 dark:text-green-400 mb-1">
            {"Nagyon valószínű, hogy helyes."}
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-600">
            {`A legfeljebb ${result.checkedUpTo} hosszú szavakon a kifejezésed pontosan a kért nyelvet adja. Ennél a feladatnál a nyelv feltétellel van megadva, ezért csak eddig a hosszig tudjuk ellenőrizni, bizonyítani nem.`}
          </p>
        </div>
      );
    case "counterexample": {
      const { word, inCandidate } = result.counterexample;
      return (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-100 p-6 shadow-md">
          <p className="font-bold text-amber-700 dark:text-amber-400 mb-2">
            {"Még nem jó. Ellenpélda: "}
            <span className="inline-block break-all rounded-xl border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/40 px-3 py-0.5 font-mono text-base font-medium text-purple-800 dark:text-purple-200 shadow-sm">
              {showWord(word)}
            </span>
          </p>
          <p className="text-sm text-gray-700 dark:text-slate-700">
            {inCandidate
              ? "A kifejezésed elfogadja ezt a szót, pedig nincs benne a nyelvben. Valahol túl engedékeny."
              : "Ez a szó benne van a nyelvben, de a kifejezésed nem írja le. Valamelyik esetet kihagytad."}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-slate-500">
            {"Ez a legrövidebb ilyen szó (shortlex sorrendben az első)."}
          </p>
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
    setResult(null);
  }

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">Válassz feladatot, majd próbáld meg reguláris kifejezéssel megadni a leírt nyelvet, amit a feladat kér!</p>
      <div className="flex flex-wrap gap-2">
        {exercises.map((ex, i) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => selectExercise(i)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
              i === index
                ? "border-purple-400 bg-purple-50 dark:bg-purple-900/40 dark:border-purple-600 text-purple-700 dark:text-purple-300 shadow-sm"
                : "border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-100 text-gray-700 dark:text-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            }`}
          >
            {i + 1}. {ex.title}
          </button>
        ))}
      </div>

      <form
        className="rounded-3xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-8 shadow-lg space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(checkRegex(answer, exercise.reference, exercise.alphabet));
        }}
      >
        <p className="text-gray-900 dark:text-slate-900 font-sans">
          {"Adj meg egy reguláris kifejezést, ami ezt a nyelvet írja le: "}
          <MathText text={exercise.statement} />
        </p>

        <RegexInput
          label={"A te kifejezésed"}
          value={answer}
          onChange={changeAnswer}
          alphabet={exercise.alphabet}
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed px-10 py-4 text-lg font-bold text-white shadow-lg shadow-purple-200 dark:shadow-purple-900 transition-all"
          >
            {"Ellenőrzés"}
          </button>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-100 px-6 py-4 text-base font-semibold text-gray-700 dark:text-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
          >
            {showHint ? "Tipp elrejtése" : "Tipp"}
          </button>
          <button
            type="button"
            onClick={() => setShowSolution(!showSolution)}
            className="rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-100 px-6 py-4 text-base font-semibold text-gray-700 dark:text-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
          >
            {showSolution
              ? "Megoldás elrejtése"
              : "Egy lehetséges megoldás"}
          </button>
        </div>

        {showHint && (
          <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-1">
              Tipp
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-700">{exercise.hint}</p>
          </div>
        )}

        {showSolution && (
          <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-2">
              {"Egy lehetséges megoldás"}
            </p>
            <span className="inline-block break-all rounded-xl border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/40 px-4 py-2 font-mono text-base font-medium text-purple-800 dark:text-purple-200 shadow-sm">
              {exercise.solution}
            </span>
            <p className="mt-3 text-xs text-gray-500 dark:text-slate-500">
              {"Nem ez az egyetlen jó válasz: bármelyik kifejezés helyes, ami ugyanezt a nyelvet írja le."}
            </p>
          </div>
        )}
      </form>

      {result && <ResultBox result={result} />}
    </div>
  );
}
