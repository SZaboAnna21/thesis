import type { ReactNode } from "react";
import { DfaSimulator } from "../components/DfaSimulator";
import { GrammarModule, anbnGrammar, equalAbGrammar, anbncnGrammar } from "../components/GrammarModule";
import { WordPlayground } from "../components/WordPlayground";
import { ChomskyClassifier } from "../components/ChomskyClassifier";
import { RegexChecker } from "../components/RegexChecker";
import { regexExercises } from "./regexExercises";
import { NormalForm3Visualizer } from "../components/NormalForm3Visualizer";
import { NfaLab } from "../components/NfaLab";
import { CykVisualizer } from "../components/CykVisualizer";
import { PdaLab } from "../components/PdaLab";
import { MinimizerLab } from "../components/MinimizerLab";
import { FormulaLab } from "../components/FormulaLab";
import { TuringLab } from "../components/TuringLab";

export const modules: Record<string, () => ReactNode> = {
  "dfa-simulator": () => (
    <DfaSimulator
      initialWord="abba"
      description={<>Adj meg egy szót, és kövesd lépésről lépésre, ahogy az automata feldolgozza. Ez az automata páratlan hosszú szavakat ismer fel az <span className="font-mono">{"{a, b}"}</span> ábécé felett!</>}
    />
  ),
  "grammar-derivation": () => <GrammarModule initial={anbnGrammar} />,
  "cf-derivation": () => <GrammarModule initial={equalAbGrammar} />,
  "cs-derivation": () => <GrammarModule initial={anbncnGrammar} />,
  "word-playground": () => <WordPlayground />,
  "chomsky-classifier": () => <ChomskyClassifier />,
  "regex-checker": () => <RegexChecker exercises={regexExercises} />,
  "nf3-converter": () => <NormalForm3Visualizer />,
  "nfa-lab": () => <NfaLab />,
  "cyk": () => <CykVisualizer />,
  "pda-lab": () => <PdaLab />,
  "minimizer": () => <MinimizerLab />,
  "logic-lab": () => <FormulaLab />,
  "tm-simulator": () => <TuringLab />,
};
