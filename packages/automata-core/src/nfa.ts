export const EPS = "ε";

export type Nfa = {
  states: string[];
  alphabet: string[];
  transitions: Record<string, Record<string, string[]>>;  // δ(q, a) ⊆ Q, az ε-átmenet kulcsa EPS
  starts: string[];
  accepting: string[];
};

export type SubsetRow = {
  set: string[];
  next: Record<string, string[]>;
  isStart: boolean;
  isAccepting: boolean;
};

export type SubsetStep = {
  row: SubsetRow;
  queue: string[][];
};

// 1. lecke: ε-lezárt.
export function epsilonClosure(nfa: Nfa, states: string[]): string[] {
  const toReturnStates: string[] = [...states];
  const toProcessStates: string[] = [...states];

  while (toProcessStates.length > 0) {
    const currentState = toProcessStates.pop()!;
    const epsilonTransitions = nfa.transitions[currentState]?.[EPS] || [];

    for (const nextState of epsilonTransitions) {
      if (!toReturnStates.includes(nextState)) {
        toReturnStates.push(nextState);
        toProcessStates.push(nextState);
      }
    }
  }

  return normalize(nfa, toReturnStates);
}

function onestep(nfa: Nfa, states: string[], letter: string): string[] {
  const nextStates: string[] = [];
  for (const state of states) {
    const transitionsformletter = nfa.transitions[state]?.[letter] || [];
    for (const nextState of transitionsformletter) {
      if (!nextStates.includes(nextState)) {
        nextStates.push(nextState);
      }
    }
  }

  return nextStates;
}

export type NfaRunStep = {
  letter: string | null;
  active: string[];
};

export function runNfa(nfa: Nfa, word: string): NfaRunStep[] {
  const steps: NfaRunStep[] = [];
  let activestates = epsilonClosure(nfa, nfa.starts);
  steps.push({ letter: null, active: activestates });
  for (const character of word) {
    activestates = epsilonClosure(nfa, onestep(nfa, activestates, character));
    steps.push({ letter: character, active: activestates });
  }
  return steps;
}

export function acceptsWord(nfa: Nfa, word: string): boolean {
  const steps = runNfa(nfa, word);
  const lastStep = steps[steps.length - 1];
  for (const state of lastStep.active) {
    if (nfa.accepting.includes(state)) {
      return true;
    }
  }
  return false;
}

export function determinize(nfa: Nfa): SubsetStep[] {
  const startStates = epsilonClosure(nfa, nfa.starts);
  const seen: Set<string> = new Set([setKey(startStates)]);
  const queue: string[][] = [startStates];
  const steps: SubsetStep[] = [];
  while (queue.length > 0) {
    const currentSet = queue.shift()!;
    const next: Record<string, string[]> = {};
    for (const letter of nfa.alphabet) {
      const destination = epsilonClosure(nfa, onestep(nfa, currentSet, letter));
      if (!seen.has(setKey(destination))) {
        seen.add(setKey(destination));
        queue.push(destination);
      }
      next[letter] = destination;
    }
    steps.push({
      row: {
        set: currentSet,
        next,
        isStart: steps.length === 0,
        isAccepting: currentSet.some((state) => nfa.accepting.includes(state)),
      },
      queue: [...queue],
    });
  }
  return steps;
}

export function normalize(nfa: Nfa, states: string[]): string[] {
  const uniqueAndOrdered: string[] = [];

  for (const state of nfa.states) {
    if (states.includes(state) && !uniqueAndOrdered.includes(state)) {
      uniqueAndOrdered.push(state);
    }
  }
  return uniqueAndOrdered;
}

function setKey(states: string[]): string {
  return states.join(",");
}

