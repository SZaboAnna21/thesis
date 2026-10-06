import type { Topic } from "../types/topics";

import { meta as alapfogalmakMeta } from "./alapfogalmak/meta";
import { theory as alapfogalmakTheory } from "./alapfogalmak/theory";
import { meta as alapfogalmaknyelvMeta } from "./alapfogalmak2/meta";
import { theory as alapfogalmaknyelvTheory } from "./alapfogalmak2/theory";
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
import { meta as kisBarHillelMeta } from "./kis-bar-hillel/meta";
import { theory as kisBarHillelTheory } from "./kis-bar-hillel/theory";
import { meta as cfGrammatikakMeta } from "./cf-grammatikak/meta";
import { theory as cfGrammatikakTheory } from "./cf-grammatikak/theory";
import { meta as cykMeta } from "./cyk/meta";
import { theory as cykTheory } from "./cyk/theory";
import { meta as veremautomataMeta } from "./veremautomata/meta";
import { theory as veremautomataTheory } from "./veremautomata/theory";
import { meta as nagyBarHillelMeta } from "./nagy-bar-hillel/meta";
import { theory as nagyBarHillelTheory } from "./nagy-bar-hillel/theory";
import { meta as kornyezetfuggoMeta } from "./kornyezetfuggo/meta";
import { theory as kornyezetfuggoTheory } from "./kornyezetfuggo/theory";

export const topics: Topic[] = [
  { meta: alapfogalmakMeta, content: alapfogalmakTheory },
  { meta: alapfogalmaknyelvMeta, content: alapfogalmaknyelvTheory },
  { meta: grammatikakMeta, content: grammatikakTheory },
  { meta: chomskyMeta, content: chomskyTheory },
  { meta: regularisGrammatikakMeta, content: regularisGrammatikakTheory },
  { meta: regularisKifejezesekMeta, content: regularisKifejezesekTheory },
  { meta: dvaMeta, content: dvaTheory },
  { meta: ndvaMeta, content: ndvaTheory },
  { meta: minimalizalasMeta, content: minimalizalasTheory },
  { meta: regexAutomataMeta, content: regexAutomataTheory },
  { meta: kisBarHillelMeta, content: kisBarHillelTheory },
  { meta: cfGrammatikakMeta, content: cfGrammatikakTheory },
  { meta: cykMeta, content: cykTheory },
  { meta: veremautomataMeta, content: veremautomataTheory },
  { meta: nagyBarHillelMeta, content: nagyBarHillelTheory },
  { meta: kornyezetfuggoMeta, content: kornyezetfuggoTheory },
].sort((a, b) => a.meta.order - b.meta.order);

export function getTopic(id: string): Topic | undefined {
  return topics.find((topic) => topic.meta.id === id);
}
