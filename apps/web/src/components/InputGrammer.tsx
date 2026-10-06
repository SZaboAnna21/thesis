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

function parseRules(text: string): Grammer["rules"] {
  return text
    .split("\n")
    .filter(line => line.includes("->"))
    .map(line => {
      const [from, to = ""] = line.split("->");
      return { from: from.trim(), to: to.trim() };
    })
    .filter(r => r.from);
}

export function GrammarInput({ initial, onChange }: Props) {
  const [fields, setFields] = useState<Fields>({
    nonterminals: initial.nonterminals.join(","),
    terminals: initial.terminals.join(","),
    start: initial.start,
    rules: initial.rules.map(r => `${r.from}->${r.to}`).join("\n"),
  });

  function update(key: keyof Fields, value: string) {
    const next = { ...fields, [key]: value };
    setFields(next);
    onChange?.({
      nonterminals: splitList(next.nonterminals),
      terminals: splitList(next.terminals),
      start: next.start.trim(),
      rules: parseRules(next.rules),
    });
  }

  return (
    <div className="p-4 border rounded space-y-3">
      <h2 className="font-bold text-lg">Grammatika</h2>

      <input
        className="border p-2 w-full"
        placeholder="Nemterminálisok (S,A,B)"
        value={fields.nonterminals}
        onChange={(e) => update("nonterminals", e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Terminálisok (a,b)"
        value={fields.terminals}
        onChange={(e) => update("terminals", e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Kezdőszimbólum"
        value={fields.start}
        onChange={(e) => update("start", e.target.value)}
      />

      <textarea
        className="border p-2 w-full h-32 font-mono"
        placeholder={"S->aSb\nS->"}
        value={fields.rules}
        onChange={(e) => update("rules", e.target.value)}
      />
    </div>
  );
}
