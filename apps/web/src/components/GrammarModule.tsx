import { useState } from "react";
import type { Grammer } from "@fotoc/automata-core";
import { GrammarInput } from "./InputGrammer";
import { GrammarDerivation } from "./GrammarDerivation";

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
