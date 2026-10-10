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
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          className={`w-full border p-2 font-mono ${state.ok ? "" : "border-red-400"}`}
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
              className="w-8 rounded border bg-gray-50 font-mono hover:bg-brand-50"
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
      {state.ok ? (
        <span className="text-xs text-gray-500">
          Értelmezés: <span className="font-mono">{regexToString(state.regex)}</span>
        </span>
      ) : (
        <span className="text-xs text-red-600">{state.message}</span>
      )}
    </label>
  );
}
