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

      <p>
        Beolvasva: <strong>{input.slice(0, step.position)}</strong>
        {input.slice(step.position)}
      </p>

      <button onClick={() => setStepIndex(stepIndex - 1)} disabled={stepIndex === 0}>
        Vissza
      </button>
      <button onClick={() => setStepIndex(stepIndex + 1)} disabled={isLastStep}>
        Előre
      </button>

      {isLastStep && (
        <p>
          {run.stuck
            ? "Nincs definiált átmenet, a futás elakadt."
            : run.accepted
              ? "Az automata elfogadja a szót."
              : "Az automata elutasítja a szót."}
        </p>
      )}
    </div>
  );
}
