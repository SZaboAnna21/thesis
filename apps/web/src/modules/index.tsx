import { useState, type ReactNode } from "react";
import type { Dfa, Grammer } from "@fotoc/automata-core";
import { DfaSimulator } from "../components/DfaSimulator";
import { GrammarInput } from "../components/InputGrammer";
import { GrammarDerivation } from "../components/GrammarDerivation";
import { WordPlayground } from "../components/WordPlayground";
import { LanguageExplorer } from "../components/LanguageExplorer";
import { ChomskyClassifier } from "../components/ChomskyClassifier";
import { RegexChecker } from "../components/RegexChecker";
import { regexExercises } from "./regexExercises";
import { NormalForm3Visualizer } from "../components/NormalForm3Visualizer";
import { NfaLab } from "../components/NfaLab";
import { nfaExamples } from "./nfaExamples";
import { CykVisualizer } from "../components/CykVisualizer";
import { PdaLab } from "../components/PdaLab";
import { MinimizerLab } from "../components/MinimizerLab";
import { FormulaLab } from "../components/FormulaLab";

const parityDfa: Dfa = {
  states: ["q0", "q1", "q2", "q3"],
  alphabet: ["a", "b"],
  start: "q0",
  accepting: ["q1", "q2"],
  transitions: {
    q0: { a: "q2", b: "q1" },
    q1: { a: "q3", b: "q0" },
    q2: { a: "q0", b: "q3" },
    q3: { a: "q1", b: "q2" },
  },
};
const endsWithAbDfa: Dfa = {
  states: ["q0", "q1", "q2", "q3", "q4", "q5", "q6"],
  alphabet: ["a", "b"],
  start: "q0",
  accepting: ["q2", "q5"],
  transitions: {
    q0: { a: "q1", b: "q3" },
    q1: { a: "q4", b: "q2" },
    q2: { a: "q4", b: "q3" },
    q3: { a: "q4", b: "q0" },
    q4: { a: "q1", b: "q5" },
    q5: { a: "q1", b: "q0" },
    q6: { a: "q2", b: "q6" },
  },
};

const equalAbGrammar: Grammer = {
  nonterminals: ["S"],
  terminals: ["a", "b"],
  rules: [
    { from: "S", to: "SS" },
    { from: "S", to: "aSb" },
    { from: "S", to: "bSa" },
    { from: "S", to: "" }, // ε
  ],
  start: "S",
};

const anbncnGrammar: Grammer = {
  nonterminals: ["S", "B"],
  terminals: ["a", "b", "c"],
  rules: [
    { from: "S", to: "abc" },
    { from: "S", to: "aSBc" },
    { from: "cB", to: "Bc" },
    { from: "bB", to: "bb" },
  ],
  start: "S",
};

const anbnGrammar: Grammer = {
  nonterminals: ["S"],
  terminals: ["a", "b"],
  rules: [
    { from: "S", to: "aSb" },
    { from: "S", to: "" },
  ],
  start: "S",
};

function GrammarModule({ initial }: { initial: Grammer }) {
  const [grammar, setGrammar] = useState<Grammer>(initial);

  return (
    <div className="space-y-4">
      <GrammarInput initial={initial} onChange={setGrammar} />
      <GrammarDerivation
        key={JSON.stringify(grammar)}
        grammer={grammar}
        word={grammar.start}
      />
    </div>
  );
}

export const modules: Record<string, () => ReactNode> = {
  "dfa-simulator": () => <DfaSimulator dfa={parityDfa} initialWord="abba" />,
  "grammar-derivation": () => <GrammarModule initial={anbnGrammar} />,
  "cf-derivation": () => <GrammarModule initial={equalAbGrammar} />,
  "cs-derivation": () => <GrammarModule initial={anbncnGrammar} />,
  "word-playground": () => <WordPlayground />,
  "language-explorer": () => <LanguageExplorer />,
  "chomsky-classifier": () => <ChomskyClassifier />,
  "regex-checker": () => <RegexChecker exercises={regexExercises} />,
  "nf3-converter": () => <NormalForm3Visualizer />,
  "nfa-lab": () => <NfaLab examples={nfaExamples} />,
  "cyk": () => <CykVisualizer />,
  "pda-lab": () => <PdaLab />,
  "minimizer": () => <MinimizerLab dfa={endsWithAbDfa} />,
  "logic-lab": () => <FormulaLab />,
};
