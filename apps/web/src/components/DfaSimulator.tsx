import { useState } from "react";
import { runDfa, type Dfa } from "@fotoc/automata-core";
import { AutomatonView } from "./AutomatonView";

type Props = {
  dfa: Dfa;
};

export function DfaSimulator({ dfa }: Props) {
  const [input, setInput] = useState("");
  const [stepIndex, setStepIndex] = useState(0);

  const run = runDfa(dfa, input);
  const step = run.steps[stepIndex];
  const isLastStep = stepIndex === run.steps.length - 1;

  // Konfiguráció az előadás jelölésével: állapot + a még olvasatlan szórész, pl. q0aab.
  const configurations = run.steps
    .slice(0, stepIndex + 1)
    .map((s) => s.state + input.slice(s.position));

  function changeInput(value: string) {
    setInput(value);
    setStepIndex(0);
  }

  return (
    <div>
      <input
        value={input}
        onChange={(e) => changeInput(e.target.value)}
        placeholder="Bemeneti szó"
      />

      <AutomatonView dfa={dfa} activeState={step.state} />

      <p>{configurations.join(" ⇒ ")}</p>

      <button onClick={() => setStepIndex(stepIndex - 1)} disabled={stepIndex === 0}>
        Vissza
      </button>
      <button onClick={() => setStepIndex(stepIndex + 1)} disabled={isLastStep}>
        Előre
      </button>

      {run.invalidLetter !== undefined ? (
        <p>A(z) „{run.invalidLetter}” betű nem eleme az ábécének.</p>
      ) : (
        isLastStep && (
          <p>
            {run.accepted
              ? `${step.state} elfogadó állapot, tehát az automata elfogadja a szót.`
              : `${step.state} nem elfogadó állapot, tehát az automata elutasítja a szót.`}
          </p>
        )
      )}
    </div>
  );
}
