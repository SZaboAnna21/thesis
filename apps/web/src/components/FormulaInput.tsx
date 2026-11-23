import { useRef, useState } from "react";
import { formulaToString, parseFormula } from "@fotoc/automata-core";

const SYMBOLS = ["¬", "∧", "∨", "→", "(", ")"];

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function FormulaInput({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function insert(symbol: string) {
    const input = inputRef.current;
    const start = input?.selectionStart ?? draft.length;
    const end = input?.selectionEnd ?? draft.length;
    const next = draft.slice(0, start) + symbol + draft.slice(end);
    setDraft(next);
    setError(null);
    setSubmitted(false);
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + symbol.length, start + symbol.length);
    });
  }

  function handleChange(next: string) {
    setDraft(next);
    setError(null);
    setSubmitted(false);
  }

  function handleSubmit() {
    const result = parseFormula(draft);
    if (result.ok) {
      setError(null);
      setSubmitted(true);
      onChange(draft);
    } else {
      setError(result.error.message);
      setSubmitted(false);
    }
  }

  const draftParsed = parseFormula(draft);

  return (
    <div className="rounded-3xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-8 shadow-lg">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">{label}</h2>
      <div className="space-y-4">
        <div>
          <input
            ref={inputRef}
            className={
              "h-14 w-full rounded-xl border bg-white dark:bg-slate-50 px-4 text-lg font-mono text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:border-transparent dark:focus:ring-purple-400 " +
              (error
                ? "border-amber-400 dark:border-amber-500 focus:ring-amber-400"
                : "border-gray-200 dark:border-slate-200 focus:ring-purple-500")
            }
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            spellCheck={false}
          />

          <div className="mt-3 flex flex-wrap gap-1">
            {SYMBOLS.map((symbol) => (
              <button
                key={symbol}
                type="button"
                onClick={() => insert(symbol)}
                className="h-10 w-10 rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 font-mono text-lg text-gray-900 dark:text-slate-900 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-500 transition-all shadow-sm"
              >
                {symbol}
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">{error}</p>
          )}
          {submitted && !error && draftParsed.ok && (
            <p className="mt-2 text-xs text-gray-500 dark:text-slate-500">
              Értelmezés: <span className="font-mono">{formulaToString(draftParsed.formula)}</span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-purple-200 dark:shadow-purple-900 transition-all"
        >
          Számol
        </button>
      </div>
    </div>
  );
}
