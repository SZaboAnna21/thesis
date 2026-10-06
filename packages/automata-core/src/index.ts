export type * from "./dfa";
export { isComplete, runDfa } from "./dfa";

export type * from "./grammer";
export { possibleSteps, applyStep, isTerminalWord } from "./grammer";


export type * from "./words";
export {
  reverse,
  concatenate,
  power,
  prefixes,
  properPrefixes,
  suffixes,
  properSuffixes,
  runAll,
} from "./words";
