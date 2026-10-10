// Nyelv-ellenőrző motor: a diák megoldását (reguláris kifejezés) összeveti
// egy referencia-nyelvvel, és ha eltérnek, megad egy ellenpéldát.
//
// Két ellenőrzési mód van:
//  - pontos: ha a referencia is reguláris kifejezés, a két ε-NDVA
//    determinizált szorzatát járjuk be szélességi kereséssel. Ez mindig
//    terminál, és a legrövidebb (shortlex szerint első) ellenpéldát adja.
//  - korlátos: ha a referencia egy predikátum (u => boolean), csak egy adott
//    hosszig tudjuk végignézni a szavakat. Ez ellenpéldát talál, de
//    helyességet nem bizonyít.

// ---------------------------------------------------------------------------
// Shortlex felsorolás
// ---------------------------------------------------------------------------

// Σ* szavai shortlex sorrendben, legfeljebb maxLength hosszig.
// A betűk sorrendje az ábécé megadási sorrendje.
export function* shortlex(alphabet: string[], maxLength: number): Generator<string> {
  let level: string[] = [""];
  for (let length = 0; length <= maxLength; length++) {
    yield* level;
    if (length === maxLength) return;
    const next: string[] = [];
    for (const word of level) {
      for (const letter of alphabet) next.push(word + letter);
    }
    level = next;
  }
}

// ---------------------------------------------------------------------------
// Reguláris kifejezések: szintaxisfa és parser
// ---------------------------------------------------------------------------

export type Regex =
  | { kind: "empty" } // ∅
  | { kind: "epsilon" } // ε
  | { kind: "letter"; letter: string }
  | { kind: "union"; left: Regex; right: Regex } // Q + R
  | { kind: "concat"; left: Regex; right: Regex } // Q · R
  | { kind: "star"; inner: Regex } // R*
  | { kind: "plus"; inner: Regex } // R^+ = R R*
  | { kind: "power"; inner: Regex; exponent: number }; // R^n

export type RegexParseError = {
  message: string;
  // a hibás karakter indexe a bemenetben
  position: number;
};

export type RegexParseResult =
  | { ok: true; regex: Regex }
  | { ok: false; error: RegexParseError };

const EPSILON_CHARS = ["ε"];
const EMPTY_CHARS = ["∅"];
const UNION_CHARS = ["+", "|", "∪"];
const CONCAT_CHARS = ["·", "."];
const SUPERSCRIPT_DIGITS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function isLetter(char: string): boolean {
  return /^[a-z0-9]$/i.test(char);
}

// Szintaxis (a tárgyban használt jelölés):
//   unió:        Q + R   (vagy Q | R, Q ∪ R)
//   konkatenáció: QR     (vagy Q · R, Q . R)
//   lezárás:     R*
//   pozitív lezárt: R^+  (vagy R⁺)
//   hatvány:     R^3     (vagy R³)
//   ε, ∅, zárójelek; a szóközöket figyelmen kívül hagyjuk.
// Precedencia: postfix műveletek > konkatenáció > unió.
// Betű: egyetlen angol betű vagy számjegy.
export function parseRegex(source: string): RegexParseResult {
  const chars = [...source];
  let pos = 0;

  class ParseFailure extends Error {
    readonly parseError: RegexParseError;
    constructor(parseError: RegexParseError) {
      super(parseError.message);
      this.parseError = parseError;
    }
  }

  const fail = (message: string, at: number = pos): never => {
    throw new ParseFailure({ message, position: at });
  };

  const skipSpaces = () => {
    while (pos < chars.length && /\s/.test(chars[pos])) pos++;
  };

  const peek = (): string | undefined => {
    skipSpaces();
    return chars[pos];
  };

  const startsAtom = (char: string | undefined): boolean =>
    char !== undefined &&
    (char === "(" || isLetter(char) || EPSILON_CHARS.includes(char) || EMPTY_CHARS.includes(char));

  const parseUnion = (): Regex => {
    let left = parseConcat();
    while (UNION_CHARS.includes(peek() ?? "")) {
      pos++;
      if (!startsAtom(peek())) fail("Az unió jele után hiányzik a kifejezés.");
      left = { kind: "union", left, right: parseConcat() };
    }
    return left;
  };

  const parseConcat = (): Regex => {
    let left = parsePostfix();
    for (;;) {
      const next = peek();
      if (next !== undefined && CONCAT_CHARS.includes(next)) {
        pos++;
        if (!startsAtom(peek())) fail("A konkatenáció jele után hiányzik a kifejezés.");
        left = { kind: "concat", left, right: parsePostfix() };
      } else if (startsAtom(next)) {
        left = { kind: "concat", left, right: parsePostfix() };
      } else {
        return left;
      }
    }
  };

  const parseExponent = (): number => {
    const start = pos;
    let digits = "";
    while (pos < chars.length && /[0-9]/.test(chars[pos])) digits += chars[pos++];
    if (digits === "") fail("A ^ után kitevő (szám vagy +) kell.", start);
    return Number(digits);
  };

  const parsePostfix = (): Regex => {
    let inner = parseAtom();
    for (;;) {
      const next = peek();
      if (next === "*") {
        pos++;
        inner = { kind: "star", inner };
      } else if (next === "⁺") {
        pos++;
        inner = { kind: "plus", inner };
      } else if (next !== undefined && SUPERSCRIPT_DIGITS.includes(next)) {
        let digits = "";
        while (pos < chars.length && SUPERSCRIPT_DIGITS.includes(chars[pos])) {
          digits += SUPERSCRIPT_DIGITS.indexOf(chars[pos++]);
        }
        inner = { kind: "power", inner, exponent: Number(digits) };
      } else if (next === "^") {
        pos++;
        skipSpaces();
        if (chars[pos] === "+") {
          pos++;
          inner = { kind: "plus", inner };
        } else {
          inner = { kind: "power", inner, exponent: parseExponent() };
        }
      } else {
        return inner;
      }
    }
  };

  const parseAtom = (): Regex => {
    const next = peek();
    if (next === undefined) return fail("Váratlanul véget ért a kifejezés.");
    if (next === "(") {
      const open = pos++;
      if (peek() === ")") fail("Üres zárójel. Az üres szóra az ε-t használd.");
      const inner = parseUnion();
      if (peek() !== ")") fail("Hiányzik a bezáró zárójel.", open);
      pos++;
      return inner;
    }
    pos++;
    if (isLetter(next)) return { kind: "letter", letter: next };
    if (EPSILON_CHARS.includes(next)) return { kind: "epsilon" };
    if (EMPTY_CHARS.includes(next)) return { kind: "empty" };
    if (next === "*" || next === "^" || next === "⁺") {
      return fail("A lezárás jele előtt nincs mire vonatkoznia.", pos - 1);
    }
    if (UNION_CHARS.includes(next)) return fail("Az unió jele előtt hiányzik a kifejezés.", pos - 1);
    if (next === ")") return fail("Nyitó pár nélküli bezáró zárójel.", pos - 1);
    return fail(`Ismeretlen karakter: „${next}”.`, pos - 1);
  };

  try {
    if (peek() === undefined) fail("Üres a kifejezés. Az üres szóra az ε-t használd.");
    const regex = parseUnion();
    if (peek() !== undefined) {
      fail(peek() === ")" ? "Nyitó pár nélküli bezáró zárójel." : `Váratlan karakter: „${peek()}”.`);
    }
    return { ok: true, regex };
  } catch (e) {
    if (e instanceof ParseFailure) return { ok: false, error: e.parseError };
    throw e;
  }
}

const PRECEDENCE: Record<Regex["kind"], number> = {
  union: 0,
  concat: 1,
  star: 2,
  plus: 2,
  power: 2,
  empty: 3,
  epsilon: 3,
  letter: 3,
};

// Szöveges alak, csak a szükséges zárójelekkel.
export function regexToString(regex: Regex): string {
  const wrap = (inner: Regex, minPrecedence: number) =>
    PRECEDENCE[inner.kind] < minPrecedence ? `(${regexToString(inner)})` : regexToString(inner);

  switch (regex.kind) {
    case "empty":
      return "∅";
    case "epsilon":
      return "ε";
    case "letter":
      return regex.letter;
    case "union":
      return `${wrap(regex.left, 0)} + ${wrap(regex.right, 0)}`;
    case "concat":
      return `${wrap(regex.left, 1)}${wrap(regex.right, 1)}`;
    case "star":
      return `${wrap(regex.inner, 3)}*`;
    case "plus":
      return `${wrap(regex.inner, 3)}^+`;
    case "power":
      return `${wrap(regex.inner, 3)}^${regex.exponent}`;
  }
}

export function regexLetters(regex: Regex): Set<string> {
  const letters = new Set<string>();
  const visit = (r: Regex) => {
    switch (r.kind) {
      case "letter":
        letters.add(r.letter);
        break;
      case "union":
      case "concat":
        visit(r.left);
        visit(r.right);
        break;
      case "star":
      case "plus":
      case "power":
        visit(r.inner);
        break;
    }
  };
  visit(regex);
  return letters;
}

// ---------------------------------------------------------------------------
// ε-NDVA (Thompson-konstrukció)
// ---------------------------------------------------------------------------

// Az állapotok 0..stateCount-1. A null betűjű átmenet ε-átmenet.
export type EpsilonNfa = {
  stateCount: number;
  start: number;
  accepting: number;
  transitions: { from: number; letter: string | null; to: number }[];
};

export function regexToNfa(regex: Regex): EpsilonNfa {
  const transitions: EpsilonNfa["transitions"] = [];
  let stateCount = 0;
  const newState = () => stateCount++;
  const edge = (from: number, letter: string | null, to: number) =>
    transitions.push({ from, letter, to });

  // Minden részkifejezéshez egy (be, ki) állapotpárt építünk, ahogy az
  // előadás általánosított automatás átalakításában.
  const build = (r: Regex): { start: number; end: number } => {
    const start = newState();
    const end = newState();
    switch (r.kind) {
      case "empty":
        break;
      case "epsilon":
        edge(start, null, end);
        break;
      case "letter":
        edge(start, r.letter, end);
        break;
      case "union": {
        const left = build(r.left);
        const right = build(r.right);
        edge(start, null, left.start);
        edge(start, null, right.start);
        edge(left.end, null, end);
        edge(right.end, null, end);
        break;
      }
      case "concat": {
        const left = build(r.left);
        const right = build(r.right);
        edge(start, null, left.start);
        edge(left.end, null, right.start);
        edge(right.end, null, end);
        break;
      }
      case "star":
      case "plus": {
        const inner = build(r.inner);
        edge(start, null, inner.start);
        edge(inner.end, null, inner.start);
        edge(inner.end, null, end);
        if (r.kind === "star") edge(start, null, end);
        break;
      }
      case "power": {
        let current = start;
        for (let i = 0; i < r.exponent; i++) {
          const copy = build(r.inner);
          edge(current, null, copy.start);
          current = copy.end;
        }
        edge(current, null, end);
        break;
      }
    }
    return { start, end };
  };

  const { start, end } = build(regex);
  return { stateCount, start, accepting: end, transitions };
}

function epsilonClosure(nfa: EpsilonNfa, states: Iterable<number>): Set<number> {
  const closure = new Set(states);
  const stack = [...closure];
  while (stack.length > 0) {
    const state = stack.pop()!;
    for (const t of nfa.transitions) {
      if (t.from === state && t.letter === null && !closure.has(t.to)) {
        closure.add(t.to);
        stack.push(t.to);
      }
    }
  }
  return closure;
}

function step(nfa: EpsilonNfa, states: Set<number>, letter: string): Set<number> {
  const next: number[] = [];
  for (const t of nfa.transitions) {
    if (t.letter === letter && states.has(t.from)) next.push(t.to);
  }
  return epsilonClosure(nfa, next);
}

export function nfaAccepts(nfa: EpsilonNfa, word: string): boolean {
  let current = epsilonClosure(nfa, [nfa.start]);
  for (const letter of word) {
    current = step(nfa, current, letter);
    if (current.size === 0) return false;
  }
  return current.has(nfa.accepting);
}

export function regexMatches(regex: Regex, word: string): boolean {
  return nfaAccepts(regexToNfa(regex), word);
}

// Azok az állapotok, ahonnan valamilyen (akár üres) úton el lehet érni az
// elfogadó állapotot. A Pre(L) tagsághoz kell.
function coReachable(nfa: EpsilonNfa): Set<number> {
  const result = new Set([nfa.accepting]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const t of nfa.transitions) {
      if (result.has(t.to) && !result.has(t.from)) {
        result.add(t.from);
        changed = true;
      }
    }
  }
  return result;
}

// Azok az állapotok, ahova a kezdőállapotból valamilyen (akár üres) úton el
// lehet jutni. A Suf(L) tagsághoz kell.
function reachable(nfa: EpsilonNfa): Set<number> {
  const result = new Set([nfa.start]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const t of nfa.transitions) {
      if (result.has(t.from) && !result.has(t.to)) {
        result.add(t.to);
        changed = true;
      }
    }
  }
  return result;
}

// u ∈ Pre(L) ⇔ van v, hogy uv ∈ L ⇔ u elolvasása után olyan állapotban
// vagyunk, ahonnan még elérhető az elfogadó állapot. Pontos, nem korlátos.
export function nfaAcceptsPrefix(nfa: EpsilonNfa, word: string): boolean {
  let current = epsilonClosure(nfa, [nfa.start]);
  for (const letter of word) {
    current = step(nfa, current, letter);
    if (current.size === 0) return false;
  }
  const alive = coReachable(nfa);
  return [...current].some((state) => alive.has(state));
}

// u ∈ Suf(L) ⇔ van v, hogy vu ∈ L ⇔ valamelyik elérhető állapotból
// indulva u elolvasása után elfogadó állapotba jutunk.
export function nfaAcceptsSuffix(nfa: EpsilonNfa, word: string): boolean {
  let current = epsilonClosure(nfa, reachable(nfa));
  for (const letter of word) {
    current = step(nfa, current, letter);
    if (current.size === 0) return false;
  }
  return current.has(nfa.accepting);
}

// Az u = u1 u2 felbontások (u1 ∈ L1, u2 ∈ L2) vágási pontjai, vagyis |u1|
// lehetséges értékei. u ∈ L1L2 ⇔ a lista nem üres. Ha több eleme van, a szó
// többféleképpen áll elő (mint az abc = a·bc = ab·c a diákon).
export function concatSplits(
  word: string,
  inFirst: (word: string) => boolean,
  inSecond: (word: string) => boolean,
): number[] {
  const splits: number[] = [];
  for (let i = 0; i <= word.length; i++) {
    if (inFirst(word.slice(0, i)) && inSecond(word.slice(i))) splits.push(i);
  }
  return splits;
}

// u ∈ L* ⇔ u felbontható nemüres L-beli darabokra (vagy u = ε).
// canEnd[i]: az első i betű felbontható.
export function inKleeneStar(word: string, inLanguage: (word: string) => boolean): boolean {
  const canEnd = [true];
  for (let i = 1; i <= word.length; i++) {
    canEnd[i] = false;
    for (let j = 0; j < i && !canEnd[i]; j++) {
      canEnd[i] = canEnd[j] && inLanguage(word.slice(j, i));
    }
  }
  return canEnd[word.length];
}

// ---------------------------------------------------------------------------
// Összevetés, ellenpélda
// ---------------------------------------------------------------------------

export type Counterexample = {
  word: string;
  // benne van-e a diák nyelvében
  inCandidate: boolean;
  // benne van-e a referencia-nyelvben
  inReference: boolean;
};

// Pontos összevetés: a két automata hatványhalmaz-konstrukcióját egyszerre
// járjuk be (szorzatautomata). Ha egy elért állapotpárban az egyik elfogad,
// a másik nem, az odavezető szó ellenpélda. A betűk sorrendjében haladó
// szélességi keresés miatt ez a shortlex szerinti első ellenpélda.
export function findRegexCounterexample(
  candidate: Regex,
  reference: Regex,
  alphabet: string[],
): Counterexample | null {
  const a = regexToNfa(candidate);
  const b = regexToNfa(reference);
  const key = (sa: Set<number>, sb: Set<number>) =>
    `${[...sa].sort((x, y) => x - y).join(",")}|${[...sb].sort((x, y) => x - y).join(",")}`;

  const startA = epsilonClosure(a, [a.start]);
  const startB = epsilonClosure(b, [b.start]);
  const queue: { sa: Set<number>; sb: Set<number>; word: string }[] = [
    { sa: startA, sb: startB, word: "" },
  ];
  const seen = new Set([key(startA, startB)]);

  for (let i = 0; i < queue.length; i++) {
    const { sa, sb, word } = queue[i];
    const inCandidate = sa.has(a.accepting);
    const inReference = sb.has(b.accepting);
    if (inCandidate !== inReference) return { word, inCandidate, inReference };

    for (const letter of alphabet) {
      const na = step(a, sa, letter);
      const nb = step(b, sb, letter);
      const k = key(na, nb);
      if (!seen.has(k)) {
        seen.add(k);
        queue.push({ sa: na, sb: nb, word: word + letter });
      }
    }
  }
  return null;
}

// Korlátos összevetés tetszőleges tagsági függvényekkel.
export function findBoundedCounterexample(
  candidate: (word: string) => boolean,
  reference: (word: string) => boolean,
  alphabet: string[],
  maxLength: number,
): Counterexample | null {
  for (const word of shortlex(alphabet, maxLength)) {
    const inCandidate = candidate(word);
    const inReference = reference(word);
    if (inCandidate !== inReference) return { word, inCandidate, inReference };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Feladat-ellenőrzés: ezt hívja a felület
// ---------------------------------------------------------------------------

export type LanguageReference =
  | { kind: "regex"; source: string }
  | { kind: "predicate"; accepts: (word: string) => boolean; maxLength: number };

export type RegexCheckResult =
  | { status: "parse-error"; error: RegexParseError }
  // a kifejezés olyan betűt használ, ami nincs az ábécében
  | { status: "foreign-letter"; letter: string }
  | { status: "counterexample"; counterexample: Counterexample }
  // pontos ellenőrzés: a két nyelv egyenlő
  | { status: "equivalent" }
  // korlátos ellenőrzés: maxLength hosszig nincs eltérés
  | { status: "no-counterexample"; checkedUpTo: number };

export function checkRegex(
  candidateSource: string,
  reference: LanguageReference,
  alphabet: string[],
): RegexCheckResult {
  const parsed = parseRegex(candidateSource);
  if (!parsed.ok) return { status: "parse-error", error: parsed.error };

  for (const letter of regexLetters(parsed.regex)) {
    if (!alphabet.includes(letter)) return { status: "foreign-letter", letter };
  }

  if (reference.kind === "regex") {
    const ref = parseRegex(reference.source);
    if (!ref.ok) {
      throw new Error(`Hibás referencia-kifejezés: ${reference.source} (${ref.error.message})`);
    }
    const counterexample = findRegexCounterexample(parsed.regex, ref.regex, alphabet);
    return counterexample ? { status: "counterexample", counterexample } : { status: "equivalent" };
  }

  const nfa = regexToNfa(parsed.regex);
  const counterexample = findBoundedCounterexample(
    (word) => nfaAccepts(nfa, word),
    reference.accepts,
    alphabet,
    reference.maxLength,
  );
  return counterexample
    ? { status: "counterexample", counterexample }
    : { status: "no-counterexample", checkedUpTo: reference.maxLength };
}
