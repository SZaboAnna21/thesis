import {
  truthTable,
  regexToNfa,
  nfaAccepts,
  nfaAcceptsPrefix,
  nfaAcceptsSuffix,
  shortlex,
  concatSplits,
  inKleeneStar,
  reverse,
  runningPda,
  acceptingPath,
  bestPath,
  minimize,
  determinize,
  toNormalForm3Steps,
  cyk,
  cykDerivation,
  isChomskyNormalForm,
  type Formula,
  type Regex,
  type Pda,
  type AcceptMode,
  type PdaLimits,
  type Dfa,
  type Nfa,
  type Grammer,
} from "@fotoc/automata-core";

type OpEntry = { word: string; splits?: string[] };
type OpResult = { title: string; note?: string; entries: OpEntry[] };

const pieceOf = (word: string, split: number) =>
  `${word.slice(0, split) || "ε"} · ${word.slice(split) || "ε"}`;

function computeLanguageOps(
  firstRegex: Regex,
  secondRegex: Regex,
  alphabet: string[],
  maxLength: number,
): OpResult[] {
  const nfa1 = regexToNfa(firstRegex);
  const nfa2 = regexToNfa(secondRegex);
  const in1 = (u: string) => nfaAccepts(nfa1, u);
  const in2 = (u: string) => nfaAccepts(nfa2, u);
  const words = [...shortlex(alphabet, maxLength)];
  const where = (test: (u: string) => boolean): OpEntry[] =>
    words.filter(test).map((word) => ({ word }));

  const concat: OpEntry[] = [];
  for (const word of words) {
    const splits = concatSplits(word, in1, in2);
    if (splits.length > 0) concat.push({ word, splits: splits.map((s) => pieceOf(word, s)) });
  }
  const ambiguous = concat.filter((e) => e.splits!.length > 1).length;

  return [
    { title: "L₁", entries: where(in1) },
    { title: "L₂", entries: where(in2) },
    { title: "L₁ ∪ L₂", entries: where((u) => in1(u) || in2(u)) },
    { title: "L₁ ∩ L₂", entries: where((u) => in1(u) && in2(u)) },
    { title: "L₁ − L₂", entries: where((u) => in1(u) && !in2(u)) },
    {
      title: "L₁ komplementere",
      note: `A komplementer mindig az ábécéhez képest értendő: most Σ = {${alphabet.join(", ")}}.`,
      entries: where((u) => !in1(u)),
    },
    {
      title: "L₁L₂",
      note:
        ambiguous > 0
          ? `${ambiguous} szó többféleképpen is előáll (sárgával jelölve, vidd fölé az egeret a felbontásokért). Ezért lehet |L₁L₂| < |L₁|·|L₂|.`
          : "Minden szó pontosan egyféleképpen áll elő.",
      entries: concat,
    },
    {
      title: "L₂L₁",
      note: "A konkatenáció nem kommutatív: vesd össze L₁L₂-vel!",
      entries: where((u) => concatSplits(u, in2, in1).length > 0),
    },
    { title: "L₁*", entries: where((u) => inKleeneStar(u, in1)) },
    {
      title: "L₁⁺",
      note: "Ha ε ∈ L₁, akkor L₁⁺ = L₁*, különben L₁⁺ = L₁* − {ε}.",
      entries: where((u) => (u !== "" ? inKleeneStar(u, in1) : in1(""))),
    },
    { title: "L₁ᴿ", entries: where((u) => in1(reverse(u))) },
    {
      title: "Pre(L₁)",
      note: "L₁ ⊆ Pre(L₁) mindig teljesül.",
      entries: where((u) => nfaAcceptsPrefix(nfa1, u)),
    },
    {
      title: "Suf(L₁)",
      note: "L₁ ⊆ Suf(L₁) mindig teljesül.",
      entries: where((u) => nfaAcceptsSuffix(nfa1, u)),
    },
  ];
}

const PDA_LIMITS: PdaLimits = { maxConfigs: 5000, maxStack: 50 };

function computePdaPath(pda: Pda, word: string, mode: AcceptMode) {
  const run = runningPda(pda, word, PDA_LIMITS);
  const accepted = acceptingPath(pda, run, mode);
  const path = accepted ?? bestPath(run);
  return { path, accepted: accepted !== null, truncated: run.truncated };
}

function computeCyk(grammar: Grammer, word: string) {
  const cnf = isChomskyNormalForm(grammar);
  if (!cnf.ok) return { cnf };
  const result = cyk(grammar, word);
  if (!result.ok) return { cnf, result };
  const derivation =
    result.accepted && word !== "" ? cykDerivation(grammar, word, result.table) : null;
  return { cnf, result, derivation };
}

type Msg = { id: number; fn: string; args: unknown[] };

self.onmessage = ({ data: { id, fn, args } }: MessageEvent<Msg>) => {
  try {
    let result: unknown;
    switch (fn) {
      case "truthTable":
        result = truthTable(args[0] as Formula);
        break;
      case "languageOps":
        result = computeLanguageOps(
          args[0] as Regex,
          args[1] as Regex,
          args[2] as string[],
          args[3] as number,
        );
        break;
      case "pdaPath":
        result = computePdaPath(args[0] as Pda, args[1] as string, args[2] as AcceptMode);
        break;
      case "minimize":
        result = minimize(args[0] as Dfa);
        break;
      case "determinize":
        result = determinize(args[0] as Nfa);
        break;
      case "normalForm3":
        result = toNormalForm3Steps(args[0] as Grammer);
        break;
      case "cyk":
        result = computeCyk(args[0] as Grammer, args[1] as string);
        break;
      default:
        throw new Error(`Ismeretlen fn: ${fn}`);
    }
    self.postMessage({ id, result });
  } catch (e) {
    self.postMessage({ id, error: e instanceof Error ? e.message : String(e) });
  }
};
