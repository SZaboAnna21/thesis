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
  // hány betűt olvasott már be az automata
  position: number;
};

export type DfaRun = {
  steps: DfaStep[];
  accepted: boolean;
  // ha nincs definiált átmenet, a futás elakad
  stuck: boolean;
};

export function runDfa(dfa: Dfa, input: string): DfaRun {
  const steps: DfaStep[] = [{ state: dfa.start, position: 0 }];
  let current = dfa.start;

  for (let i = 0; i < input.length; i++) {
    const next = dfa.transitions[current]?.[input[i]];

    if (next === undefined) {
      return { steps, accepted: false, stuck: true };
    }

    current = next;
    steps.push({ state: current, position: i + 1 });
  }

  return { steps, accepted: dfa.accepting.includes(current), stuck: false };
}
