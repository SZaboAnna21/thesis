import { useState } from "react";
import type { Grammer } from "@fotoc/automata-core";
import { GrammarInput } from "./InputGrammer";
import { GrammarDerivation } from "./GrammarDerivation";

export const anbnGrammar: Grammer = {
  nonterminals: ["S"],
  terminals: ["a", "b"],
  rules: [
    { from: "S", to: "aSb" },
    { from: "S", to: "" },
  ],
  start: "S",
};

export const equalAbGrammar: Grammer = {
  nonterminals: ["S"],
  terminals: ["a", "b"],
  rules: [
    { from: "S", to: "SS" },
    { from: "S", to: "aSb" },
    { from: "S", to: "bSa" },
    { from: "S", to: "" },
  ],
  start: "S",
};

export const anbncnGrammar: Grammer = {
  nonterminals: ["S", "B"],
  terminals: ["a", "b", "c"],
  rules: [
    { from: "S", to: "abc" },
    { from: "S", to: "aSBc" },
    { from: "cB", to: "Bc" },
    { from: "bB", to: "bb" },
  ],
  start: "S",
};

type Props = {
  initial: Grammer;
};

export function GrammarModule({ initial }: Props) {
  const [grammar, setGrammar] = useState<Grammer>(initial);

  return (
    <div className="space-y-4">
      <GrammarInput initial={initial} onChange={setGrammar} />
      <GrammarDerivation
        key={JSON.stringify(grammar)}
        grammer={grammar}
        word={grammar.start}
      />
    </div>
  );
}
