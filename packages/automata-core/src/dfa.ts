export type State = string;
export type Letter = string;

export type Dfa = {
  states: State[];
  alphabet: Letter[];
  transitions: Record<State, Record<Letter, State>>;
  start: State;
  accepting: State[];
};

export type DfaStep = {
  state: State;
  position: number;
};

export type DfaRun = {
  steps: DfaStep[];
  accepted: boolean;
  invalidLetter?: Letter;
};

export function isComplete(dfa: Dfa): boolean {
  return dfa.states.every((state) =>
    dfa.alphabet.every((letter) => dfa.states.includes(dfa.transitions[state]?.[letter])),
  );
}

export function runDfa(dfa: Dfa, input: string): DfaRun {
  const steps: DfaStep[] = [{ state: dfa.start, position: 0 }];
  let current = dfa.start;

  for (let i = 0; i < input.length; i++) {
    if (!dfa.alphabet.includes(input[i])) {
      return { steps, accepted: false, invalidLetter: input[i] };
    }

    current = dfa.transitions[current][input[i]];
    steps.push({ state: current, position: i + 1 });
  }

  return { steps, accepted: dfa.accepting.includes(current) };
}
