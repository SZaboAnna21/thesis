import type { Dfa, Letter, State } from "./dfa";

export type PartitionRow = {
  state: State;
  classIndex: number;
  signature: Record<Letter, number>; 
};

export type PartitionRound = {
  classes: State[][];
  rows: PartitionRow[];
};

export type MinimizeResult = {
  reachableLayers: State[][];
  removed: State[];
  rounds: PartitionRound[];
  classes: State[][];
  minimal: Dfa;
};

export function reachableLayers(dfa: Dfa): State[][] {
  const layers: State[][] = [[dfa.start]];
  while (true) {
    const current = layers[layers.length - 1];
    const next = [...current];
    for (const state of current) {
      for (const letter of dfa.alphabet) {
        const to = dfa.transitions[state]?.[letter];
        if (to !== undefined && !next.includes(to)) {
          next.push(to);
        }
      }
    }
    const ordered = dfa.states.filter((state) => next.includes(state));
    if (ordered.length === current.length) {
      return layers;
    }
    layers.push(ordered);
  }
}

export function removeUnreachable(dfa: Dfa): Dfa {
  const layers = reachableLayers(dfa);
  const reachable = layers[layers.length - 1];
  return {
    states: reachable,
    alphabet: dfa.alphabet,
    transitions: Object.fromEntries(reachable.map((state) => [state, { ...dfa.transitions[state] }])),
    start: dfa.start,
    accepting: dfa.accepting.filter((state) => reachable.includes(state)),
  };
}

function classOf(classes: State[][], state: State): number {
  return classes.findIndex((cls) => cls.includes(state));
}

function refine(dfa: Dfa, classes: State[][]): PartitionRound {
  const rows: PartitionRow[] = [];
  for (const [classIndex, cls] of classes.entries()) {
    for (const state of cls) {
      const signature: Record<Letter, number> = {};
      for (const letter of dfa.alphabet) {
        signature[letter] = classOf(classes, dfa.transitions[state][letter]);
      }
      rows.push({ state, classIndex, signature });
    }
  }
  return { classes, rows };
}

function split(dfa: Dfa, round: PartitionRound): State[][] {
  const groups = new Map<string, State[]>();
  for (const row of round.rows) {
    const key = [row.classIndex, ...dfa.alphabet.map((letter) => row.signature[letter])].join(",");
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(row.state);
  }
  return [...groups.values()];
}

export function equivalenceRounds(dfa: Dfa): PartitionRound[] {
  const accepting = dfa.states.filter((state) => dfa.accepting.includes(state));
  const rejecting = dfa.states.filter((state) => !dfa.accepting.includes(state));
  let classes = [rejecting, accepting].filter((cls) => cls.length > 0);

  const rounds: PartitionRound[] = [];
  while (true) {
    const round = refine(dfa, classes);
    rounds.push(round);
    const next = split(dfa, round);
    if (next.length === classes.length) {
      return rounds;
    }
    classes = next;
  }
}

export function classLabel(cls: State[]): State {
  return `{${cls.join(",")}}`;
}

export function minimize(dfa: Dfa): MinimizeResult {
  const layers = reachableLayers(dfa);
  const connected = removeUnreachable(dfa);
  const rounds = equivalenceRounds(connected);
  const classes = rounds[rounds.length - 1].classes;
  const labels = classes.map(classLabel);

  const minimal: Dfa = {
    states: labels,
    alphabet: dfa.alphabet,
    transitions: Object.fromEntries(
      classes.map((cls, i) => [
        labels[i],
        Object.fromEntries(
          dfa.alphabet.map((letter) => [letter, labels[classOf(classes, connected.transitions[cls[0]][letter])]]),
        ),
      ]),
    ),
    start: labels[classOf(classes, dfa.start)],
    accepting: labels.filter((_, i) => connected.accepting.includes(classes[i][0])),
  };

  return {
    reachableLayers: layers,
    removed: dfa.states.filter((state) => !connected.states.includes(state)),
    rounds,
    classes,
    minimal,
  };
}
