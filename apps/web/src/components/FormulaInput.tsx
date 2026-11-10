import { useRef } from "react";
import { formulaToString, parseFormula } from "@fotoc/automata-core";

const SYMBOLS = ["¬", "∧", "∨", "→", "(", ")"];

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function FormulaInput({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const parsed = parseFormula(value);

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
          className={`w-full rounded border p-2 font-mono ${parsed.ok ? "" : "border-red-400"}`}
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
      {parsed.ok ? (
        <span className="text-xs text-gray-500">
          Értelmezés: <span className="font-mono">{formulaToString(parsed.formula)}</span>
        </span>
      ) : (
        <span className="text-xs text-red-600">{parsed.error.message}</span>
      )}
    </label>
  );
}
