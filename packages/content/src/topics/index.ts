import type { Topic } from "../types/topics";

import { meta as alapfogalmakMeta } from "./alapfogalmak/meta";
import { theory as alapfogalmakTheory } from "./alapfogalmak/theory";
import { meta as alapfogalmaknyelvMeta } from "./alapfogalmak2/meta";
import { theory as alapfogalmaknyelvTheory } from "./alapfogalmak2/theory";
import { quiz as alapfogalmaknyelvQuiz } from "./alapfogalmak2/quiz";
import { meta as grammatikakMeta } from "./grammatikak/meta";
import { theory as grammatikakTheory } from "./grammatikak/theory";
import { meta as chomskyMeta } from "./chomsky/meta";
import { theory as chomskyTheory } from "./chomsky/theory";
import { meta as regularisGrammatikakMeta } from "./regularis-grammatikak/meta";
import { theory as regularisGrammatikakTheory } from "./regularis-grammatikak/theory";
import { meta as regularisKifejezesekMeta } from "./regularis-kifejezesek/meta";
import { theory as regularisKifejezesekTheory } from "./regularis-kifejezesek/theory";
import { meta as dvaMeta } from "./dva/meta";
import { theory as dvaTheory } from "./dva/theory";
import { meta as ndvaMeta } from "./ndva/meta";
import { theory as ndvaTheory } from "./ndva/theory";
import { meta as minimalizalasMeta } from "./minimalizalas/meta";
import { theory as minimalizalasTheory } from "./minimalizalas/theory";
import { meta as regexAutomataMeta } from "./regex-automata/meta";
import { theory as regexAutomataTheory } from "./regex-automata/theory";
import { quiz as regexAutomataQuiz } from "./regex-automata/quiz";
import { meta as kisBarHillelMeta } from "./kis-bar-hillel/meta";
import { theory as kisBarHillelTheory } from "./kis-bar-hillel/theory";
import { quiz as kisBarHillelQuiz } from "./kis-bar-hillel/quiz";
import { meta as cfGrammatikakMeta } from "./cf-grammatikak/meta";
import { theory as cfGrammatikakTheory } from "./cf-grammatikak/theory";
import { quiz as cfGrammatikakQuiz } from "./cf-grammatikak/quiz";
import { meta as cykMeta } from "./cyk/meta";
import { theory as cykTheory } from "./cyk/theory";
import { meta as veremautomataMeta } from "./veremautomata/meta";
import { theory as veremautomataTheory } from "./veremautomata/theory";
import { meta as nagyBarHillelMeta } from "./nagy-bar-hillel/meta";
import { theory as nagyBarHillelTheory } from "./nagy-bar-hillel/theory";
import { quiz as nagyBarHillelQuiz } from "./nagy-bar-hillel/quiz";
import { meta as kornyezetfuggoMeta } from "./kornyezetfuggo/meta";
import { theory as kornyezetfuggoTheory } from "./kornyezetfuggo/theory";
import { quiz as kornyezetfuggoQuiz } from "./kornyezetfuggo/quiz";
import { meta as logikaMeta } from "./logika/meta";
import { theory as logikaTheory } from "./logika/theory";
import { meta as turingGepekMeta } from "./turing-gepek/meta";
import { theory as turingGepekTheory } from "./turing-gepek/theory";
import { meta as eldonthetetlensegMeta } from "./eldonthetetlenseg/meta";
import { theory as eldonthetetlensegTheory } from "./eldonthetetlenseg/theory";
import { quiz as eldonthetetlensegQuiz } from "./eldonthetetlenseg/quiz";
import { meta as bonyolultsagMeta } from "./bonyolultsag/meta";
import { theory as bonyolultsagTheory } from "./bonyolultsag/theory";
import { meta as npTeljessegMeta } from "./np-teljesseg/meta";
import { theory as npTeljessegTheory } from "./np-teljesseg/theory";

export const topics: Topic[] = [
  { meta: alapfogalmakMeta, content: alapfogalmakTheory },
  { meta: alapfogalmaknyelvMeta, content: alapfogalmaknyelvTheory, quiz: alapfogalmaknyelvQuiz },
  { meta: grammatikakMeta, content: grammatikakTheory },
  { meta: chomskyMeta, content: chomskyTheory },
  { meta: regularisGrammatikakMeta, content: regularisGrammatikakTheory },
  { meta: regularisKifejezesekMeta, content: regularisKifejezesekTheory },
  { meta: dvaMeta, content: dvaTheory },
  { meta: ndvaMeta, content: ndvaTheory },
  { meta: minimalizalasMeta, content: minimalizalasTheory },
  { meta: regexAutomataMeta, content: regexAutomataTheory, quiz: regexAutomataQuiz },
  { meta: kisBarHillelMeta, content: kisBarHillelTheory, quiz: kisBarHillelQuiz },
  { meta: cfGrammatikakMeta, content: cfGrammatikakTheory, quiz: cfGrammatikakQuiz },
  { meta: cykMeta, content: cykTheory },
  { meta: veremautomataMeta, content: veremautomataTheory },
  { meta: nagyBarHillelMeta, content: nagyBarHillelTheory, quiz: nagyBarHillelQuiz },
  { meta: kornyezetfuggoMeta, content: kornyezetfuggoTheory, quiz: kornyezetfuggoQuiz },
  { meta: logikaMeta, content: logikaTheory },
  { meta: turingGepekMeta, content: turingGepekTheory },
  { meta: eldonthetetlensegMeta, content: eldonthetetlensegTheory, quiz: eldonthetetlensegQuiz },
  { meta: bonyolultsagMeta, content: bonyolultsagTheory },
  { meta: npTeljessegMeta, content: npTeljessegTheory },
].sort((a, b) => a.meta.order - b.meta.order);

export function getTopic(id: string): Topic | undefined {
  return topics.find((topic) => topic.meta.id === id);
}
