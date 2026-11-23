import { useState } from "react";
import { type Grammer } from "@fotoc/automata-core";

type Props = {
  initial: Grammer;
  onChange?: (grammar: Grammer) => void;
};


type Fields = {
  nonterminals: string;
  terminals: string;
  start: string;
  rules: string;
};

function splitList(text: string): string[] {
  return text.split(",").map(s => s.trim()).filter(Boolean);
}

function canParse(s: string, symbols: string[]): boolean {
  if (s === "") return true;
  for (const sym of symbols) {
    if (s.startsWith(sym) && canParse(s.slice(sym.length), symbols)) return true;
  }
  return false;
}

function validateRules(
  rules: Grammer["rules"],
  nonterminals: string[],
  terminals: string[]
): string[] {
  if (nonterminals.length === 0 && terminals.length === 0) return [];
  const symbols = [...nonterminals, ...terminals].sort((a, b) => b.length - a.length);
  const errors: string[] = [];
  for (const rule of rules) {
    if (rule.from && !canParse(rule.from, symbols))
      errors.push(`"${rule.from}->${rule.to}": bal oldal ismeretlen szimbólumot tartalmaz`);
    if (rule.to && !canParse(rule.to, symbols))
      errors.push(`"${rule.from}->${rule.to}": jobb oldal ismeretlen szimbólumot tartalmaz`);
  }
  return errors;
}

function parseRules(text: string): Grammer["rules"] {
  const seen = new Set<string>();
  return text
    .split("\n")
    .filter(line => line.includes("->"))
    .map(line => {
      const [from, to = ""] = line.split("->");
      return { from: from.trim(), to: to.trim() };
    })
    .filter(r => {
      if (!r.from) return false;
      const key = `${r.from}->${r.to}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function GrammarInput({ initial, onChange }: Props) {
  const [fields, setFields] = useState<Fields>({
    nonterminals: initial.nonterminals.join(","),
    terminals: initial.terminals.join(","),
    start: initial.start,
    rules: initial.rules.map(r => `${r.from}->${r.to}`).join("\n"),
  });

  function update(key: keyof Fields, value: string) {
    let next = { ...fields, [key]: value };
    if (key === "nonterminals") {
      const nts = splitList(value);
      if (nts.length > 0 && !nts.includes(next.start)) next = { ...next, start: nts[0] };
    }
    setFields(next);
    const nonterminals = splitList(next.nonterminals);
    const terminals = splitList(next.terminals);
    const allRules = parseRules(next.rules);
    const symbols = [...nonterminals, ...terminals].sort((a, b) => b.length - a.length);
    const validRules = (nonterminals.length > 0 || terminals.length > 0)
      ? allRules.filter(r => canParse(r.from, symbols) && (r.to === "" || canParse(r.to, symbols)))
      : allRules;
    onChange?.({
      nonterminals,
      terminals,
      start: next.start.trim(),
      rules: validRules,
    });
  }

  const nonterminals = splitList(fields.nonterminals);
  const terminals = splitList(fields.terminals);
  const allRules = parseRules(fields.rules);
  const errors = validateRules(allRules, nonterminals, terminals);

  return (
    <div className="rounded-3xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-8 shadow-lg">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">Grammatika</h2>
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4">

        <label className="text-sm font-semibold text-gray-700 dark:text-slate-700" htmlFor="nonterminals">Nemterminálisok:</label>
        <input
          id="nonterminals"
          className="h-14 w-full rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 px-4 text-lg font-sans text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400"
          placeholder="Nemterminálisok (S,A,B)"
          value={fields.nonterminals}
          onChange={(e) => update("nonterminals", e.target.value)}
        />

        <label className="text-sm font-semibold text-gray-700 dark:text-slate-700" htmlFor="terminals">Terminálisok:</label>
        <input
          id="terminals"
          className="h-14 w-full rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 px-4 text-lg font-sans text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400"
          placeholder="Terminálisok (a,b)"
          value={fields.terminals}
          onChange={(e) => update("terminals", e.target.value)}
        />

        <label className="text-sm font-semibold text-gray-700 dark:text-slate-700" htmlFor="start">Kezdőszimbólum:</label>
        <select
          id="start"
          className="h-14 w-full rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 px-4 text-lg font-sans text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400 disabled:opacity-40"
          value={fields.start}
          disabled={nonterminals.length === 0}
          onChange={(e) => update("start", e.target.value)}
        >
          {nonterminals.map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <label className="self-start pt-4 text-sm font-semibold text-gray-700 dark:text-slate-700" htmlFor="rules">Szabályok:</label>
        <textarea
          id="rules"
          className="w-full rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 px-4 py-3 font-mono text-lg text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400 h-32 resize-none"
          placeholder={"S->aSb\nS->"}
          value={fields.rules}
          onChange={(e) => update("rules", e.target.value)}
        />
      </div>
      {errors.length > 0 && (
        <ul className="mt-4 space-y-1">
          {errors.map((e, i) => (
            <li key={i} className="text-xs font-semibold text-amber-600 dark:text-amber-400">{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
