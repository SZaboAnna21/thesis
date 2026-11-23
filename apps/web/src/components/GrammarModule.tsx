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
    <div className="relative left-1/2 -translate-x-1/2 w-[min(100vw,80rem)] px-4 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="lg:w-[36rem] lg:shrink-0">
          <GrammarInput initial={initial} onChange={setGrammar} />
        </div>
        <div className="min-w-0 flex-1">
          <GrammarDerivation
            key={JSON.stringify(grammar)}
            grammer={grammar}
            word={grammar.start}
          />
        </div>
      </div>
    </div>
  );
}
