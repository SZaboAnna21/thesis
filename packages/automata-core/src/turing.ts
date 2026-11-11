export type Direction = "L" | "R" | "S";

export interface TMTransition {
  from: string;
  read: string;
  to: string;
  write: string;
  dir: Direction;
}

export interface TuringMachine {
  transitions: TMTransition[];
  startState: string;
  acceptState: string;
  rejectState: string;
  blankSymbol: string;
}

export interface TMConfiguration {
  tape: string[];
  head: number;
  state: string;
}

export function initConfiguration(tm: TuringMachine, input: string): TMConfiguration {
  let tape: string[];
  if (input === "") {
    tape = [tm.blankSymbol];
  } else {
    tape = input.split("");
    tape.push(tm.blankSymbol);
  }

  return {
    tape: tape,
    head: 0,
    state: tm.startState,
  };
}

export function isHalted(tm: TuringMachine, config: TMConfiguration) : boolean {

  if (config.state === tm.acceptState) {
    return true;
  }

  if (config.state === tm.rejectState) {
    return true;
  }

  return false;
}

export function step(
  tm: TuringMachine,
  config: TMConfiguration
): TMConfiguration {

  const transition = findTransition(tm, config);

  if (transition === null) {
    return {
      tape: [...config.tape],
      head: config.head,
      state: tm.rejectState,
    };
  }

  const tape = [...config.tape];
  let head = config.head;

  tape[head] = transition.write;

  if (transition.dir === "L") 
    {
    head--;
  } else if (transition.dir === "R") 
    {
    head++;
  }

  if (head < 0) {
    tape.unshift(tm.blankSymbol);
    head = 0;
  }

  if (head >= tape.length) {
    tape.push(tm.blankSymbol);
  }

  return {
    tape: tape,
    head: head,
    state: transition.to,
  };
}

export function isAccepted( tm: TuringMachine, config: TMConfiguration): boolean {
  return config.state === tm.acceptState;
}

export function findTransition( tm: TuringMachine, config: TMConfiguration): TMTransition | null {

  const currentSymbol = config.tape[config.head];
  for (const transition of tm.transitions) {
    if (
      transition.from === config.state &&
      transition.read === currentSymbol
    ) {
      return transition;
    }
  }
  return null;
}

export function computeAllSteps( tm: TuringMachine, input: string, maxSteps: number = 1000 ): TMConfiguration[] {

  const steps: TMConfiguration[] = [];
  let current = initConfiguration(tm, input);
  steps.push(current);
  let count = 0;
  while (!isHalted(tm, current) && count < maxSteps) {
    current = step(tm, current);
    steps.push(current);
    count++;
  }
  return steps;
}