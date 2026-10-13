// Az ε-átmenetek kulcsa a transitions-ben: transitions["q0"][EPS] = ["q1"]
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
// Azok az állapotok, ahová a megadottakból csak ε-átmenetekkel el lehet jutni (önmaguk is benne vannak).
export function epsilonClosure(nfa: Nfa, states: string[]): string[] {
  // TODO
  void nfa;
  return states;
}

// Egy lépés a futásban: melyik betűt olvastuk (az elején null), és mely állapotok aktívak utána.
export type NfaRunStep = {
  letter: string | null;
  active: string[];
};

// 1. lecke: futtatás lépésenként.
// Az első lépés: letter = null, active = a kezdőállapotok ε-lezártja.
// Utána betűnként: az aktív állapotokból a betűvel elérhetők, majd ezek ε-lezártja.
export function runNfa(nfa: Nfa, word: string): NfaRunStep[] {
  // TODO
  void nfa;
  void word;
  return [];
}

// Elfogadja-e a szót: a futás végén van-e aktív elfogadó állapot.
export function acceptsWord(nfa: Nfa, word: string): boolean {
  // TODO
  void nfa;
  void word;
  return false;
}

// 2. lecke: determinizálás (részhalmaz-konstrukció) lépésenként.
export function determinize(nfa: Nfa): SubsetStep[] {
  // TODO
  void nfa;
  return [];
}
