import { useState } from "react";
import {possibleSteps, applyStep,type Grammer,type Rule,type Step,} from "@fotoc/automata-core";

type Props = {
  grammer: Grammer;
  word: string
};

export function GrammarDerivation({ grammer, word }: Props) {

    //szavak sora
    const [history, setHistory] = useState<string[]>([word]);
    const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

    //szo eppen
    const current = history[history.length - 1];
    const options = selectedRule? possibleSteps(grammer, current).filter((s) =>
     s.rule.from === selectedRule.from &&
    s.rule.to === selectedRule.to
    ): [];

    function handleRuleClick(rule: Rule) {
    setSelectedRule(rule);
    }

    function handleStep(step: Step) {
        const next = applyStep(current, step);
        setHistory([...history, next]);
        setSelectedRule(null);
}

 return (
    <div className="space-y-4">
      <div>
        <h2>Aktuális szó</h2>
        <div className="border rounded p-2 font-mono">
          {current}
        </div>
      </div>

      <div>
        <h2>Szabályok</h2>

        <div className="flex flex-col gap-2">
          {grammer.rules.map((rule, i) => (
            <button
              key={i}
              onClick={() => handleRuleClick(rule)}
              className="border rounded p-2 text-left hover:bg-gray-100"
            >
              {rule.from} → {rule.to}
            </button>
          ))}
        </div>
      </div>

      {selectedRule && (
        <div>
          <h2>Alkalmazási helyek</h2>

          <div className="flex flex-col gap-2">
            {options.map((step, i) => {
              const before = current.slice(0, step.position);
              const match = step.rule.from;
              const after = current.slice(step.position + match.length);

              return (
                <button
                  key={i}
                  onClick={() => handleStep(step)}
                  className="border rounded p-2 text-left font-mono hover:bg-green-100"
                >
                  {before}
                  <span className="bg-yellow-200 font-bold">{match}</span>
                  {after}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2>Levezetés</h2>

        {history.map((w, i) => (
          <div key={i} className="font-mono">
            {w}
          </div>
        ))}
      </div>
    </div>
  );
};