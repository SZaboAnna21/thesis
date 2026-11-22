import { useRef } from "react";
import { regexToString } from "@fotoc/automata-core";
import { readRegex } from "./readRegex";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  // ha meg van adva, jelezzük az ábécén kívüli betűket
  alphabet?: string[];
};

const SYMBOLS = ["ε", "∅", "*", "+", "(", ")"];

export function RegexInput({ label, value, onChange, alphabet }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const state = readRegex(value, alphabet);

  // A gomb a kurzor helyére szúrja be a jelet, nem a végére.
  function insert(symbol: string) {
    const input = inputRef.current;
    const start = input?.selectionStart ?? value.length;
    const end = input?.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + symbol + value.slice(end));
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + symbol.length, start + symbol.length);
    });
  }

  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
      <div className="flex gap-1.5">
        <input
          ref={inputRef}
          className={`w-full border rounded p-2 font-mono bg-white text-black dark:bg-gray-800 dark:text-white transition-shadow focus:outline-none ${
            state.ok
              ? "border-gray-300 dark:border-gray-600 focus:shadow-[0_0_0_1px_#3b82f6,0_0_12px_3px_rgba(59,130,246,0.35)] dark:focus:shadow-[0_0_0_1px_#60a5fa,0_0_16px_5px_rgba(96,165,250,0.4)]"
              : "border-red-400 dark:border-red-500 focus:shadow-[0_0_0_1px_#f87171]"
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
        <div className="flex gap-1">
          {SYMBOLS.map((symbol) => (
            <button
              key={symbol}
              type="button"
              onClick={() => insert(symbol)}
              className="w-8 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 font-mono text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
      {state.ok ? (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Értelmezés: <span className="font-mono">{regexToString(state.regex)}</span>
        </span>
      ) : (
        <span className="text-xs text-red-500 dark:text-red-400">{state.message}</span>
      )}
    </label>
  );
}
