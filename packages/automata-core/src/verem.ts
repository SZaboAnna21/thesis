import { EPS } from "./nfa.ts";
import { shortlex } from "./language.ts";

export type PdaMove = {
  push: string[];
  next: string;
};

export type Pda = {
  Zsymbols: string[];
  Qstates: string[];
  inputSymbols : string[];
  transitions: Record<string, Record<string, Record<string, PdaMove[]>>>;  
  z0startsymbol: string;
  startState: string;
  accepting: string[];
};

export type PdaConfig = {
  stack: string[];
  state: string;
  from: PdaConfig | null;
  letter: string | null;
  move: PdaMove | null;
};

export type PdaStep = {
  letter: string | null;
  active: PdaConfig[];
};

export type PdaRun = {
  steps: PdaStep[];
  truncated: boolean;}

export type AcceptMode = "final-state" | "empty-stack";
export type PdaResult = "accepted" | "rejected" | "unknown";
export type PdaLimits = { maxConfigs: number; maxStack: number };

export type PdaParseError = { line: number; message: string };

export type PdaParseResult = {
  transitions: Pda["transitions"];
  Zsymbols: string[];
  Qstates: string[];
  inputSymbols: string[];
  errors: PdaParseError[];
};

export type PdaCounterexample = {
  word: string;
  expected: boolean;
  result: PdaResult;
};

export type PdaCheckResult = {
  counterexample: PdaCounterexample | null;
  checked: number;
  undecided: number;
};


export function configKey(config:PdaConfig): string {
    const returnstring = config.state + "|" + config.stack.join(" ")
    return returnstring;
}

export function startConfig(pda: Pda): PdaConfig {
    return {
        stack: [pda.z0startsymbol],
        state: pda.startState,
        from: null,
        letter: null,
        move: null,
    };
}

export function applyMove(pdaconf: PdaConfig, letter: string, move:PdaMove ): PdaConfig{
    return {
        stack: [...pdaconf.stack.slice(0, -1), ...move.push],
        state: move.next,
        from: pdaconf,
        letter: letter,
        move: move,
    };
}


export function epsilonClosure(pda: Pda, configs: PdaConfig[], limits: PdaLimits,): { configs: PdaConfig[]; truncated: boolean } {
    const toReturn: PdaConfig[] = [];
    const toProcess: PdaConfig[] = [];
    const seen = new Set<string>();

    let truncated = false;

    for (const config of configs) {
        if (seen.has(configKey(config))) continue;
        seen.add(configKey(config));
        toReturn.push(config);
        toProcess.push(config);
    }

    while (toProcess.length > 0) {
        const current = toProcess.pop()!;
        if (current.stack.length === 0) continue;
        const top = current.stack[current.stack.length - 1];
        const epsilonMoves = pda.transitions[top]?.[current.state]?.[EPS] ?? [];

        for (const move of epsilonMoves) {
            const newConfig = applyMove(current, EPS, move);
            const key = configKey(newConfig);
            if (seen.has(key)) continue;
            if (newConfig.stack.length > limits.maxStack || toReturn.length >= limits.maxConfigs) 
            {
                truncated = true;
                continue;
            }
            seen.add(key);
            toReturn.push(newConfig);
            toProcess.push(newConfig);}
    }
    return { configs: toReturn, truncated };
}

export function onestep(pda: Pda, configs: PdaConfig[], letter: string): PdaConfig[]  {
    const nextconfigs: PdaConfig[] = [];
    for (const config of configs) {
        if (config.stack.length === 0) continue;
        const top = config.stack[config.stack.length - 1];
        const moves = pda.transitions[top]?.[config.state]?.[letter] ?? [];
        for (const move of moves) {
            nextconfigs.push(applyMove(config, letter, move));
        }
    }
    return nextconfigs;
}

export function runningPda(pda: Pda, word: string, limits: PdaLimits): PdaRun {
    let truncated = false;
    const steps: PdaStep[] = [];
    let active = epsilonClosure(pda, [startConfig(pda)], limits);
    truncated = active.truncated;
    steps.push({ letter: null, active: active.configs });
    for (const character of word) {
        active = epsilonClosure(pda, onestep(pda, active.configs, character), limits);
        steps.push({ letter: character, active: active.configs });
        if (active.truncated) truncated = true;
    }
    return { steps, truncated };
}

export function acceptor(pda: Pda, config: PdaConfig, mode: AcceptMode): boolean {
    if (mode === "final-state") {
        return pda.accepting.includes(config.state);
    }
    return config.stack.length === 0;
}

export function wordchecker(pda: Pda, word: string, mode: AcceptMode, limits: PdaLimits): PdaResult {
    const run = runningPda(pda, word, limits);
    const lastStep = run.steps[run.steps.length - 1];

    if (lastStep.active.some(config => acceptor(pda, config, mode))) {
        return "accepted";
    }
    return run.truncated ? "unknown" : "rejected";
}

export function pathTo(config: PdaConfig): PdaConfig[] {
    const path: PdaConfig[] = [];
    let current: PdaConfig | null = config;

    while (current) {
        path.push(current);
        current = current.from;
    }
    return path.reverse();
}

export function acceptingPath(pda: Pda, run: PdaRun, mode: AcceptMode): PdaConfig[] | null {
    const lastStep = run.steps[run.steps.length - 1];
    for (const config of lastStep.active) {
        if (acceptor(pda, config, mode)) {
            return pathTo(config);
        }
    }
    return null;
}

export function bestPath(run: PdaRun): PdaConfig[] {
    let counter = run.steps.length - 1;
    while (run.steps[counter].active.length === 0 && counter > 0) {
        counter--;
    }   
    const lastgoodstepActives = run.steps[counter].active;
    let longestPath: PdaConfig[] = pathTo(lastgoodstepActives[0]);
    for (const config of lastgoodstepActives) {
        const path = pathTo(config);
        if (longestPath === null || path.length > longestPath.length) {
            longestPath = path;
        }
    }
    return longestPath;}


    
export function isDeterministic(pda: Pda): boolean {
    for (const z of pda.Zsymbols) {
        for (const q of pda.Qstates) {
            const stateTransitions =pda.transitions[z]?.[q];
            for (const a of pda.inputSymbols) {
                const normalCount = stateTransitions?.[a]?.length ?? 0;
                const epsilonCount =stateTransitions?.[EPS]?.length ?? 0;

                if (normalCount + epsilonCount > 1)
                    {
                    return false;
                }
            }
        }
     }
     return true;
}

// Soronként egy szabály, szóközzel tagolva: "z q a -> u p", ε-átmenetnél "z q -> u p".
export function parsePdaRules(text: string): PdaParseResult {
    const transitions: Pda["transitions"] = {};
    const Zsymbols: string[] = [];
    const Qstates: string[] = [];
    const inputSymbols: string[] = [];
    const errors: PdaParseError[] = [];

    const addTo = (list: string[], symbol: string) => {
        if (!list.includes(symbol)) list.push(symbol);
    };

    text.split("\n").forEach((rawLine, index) => {
        const line = rawLine.trim();
        if (line === "") return;
        const lineNumber = index + 1;

        const sides = line.split(/->|→/);
        if (sides.length !== 2) {
            errors.push({ line: lineNumber, message: "Egy szabályban pontosan egy „->” kell." });
            return;
        }

        const left = sides[0].trim().split(/\s+/).filter(Boolean);
        const right = sides[1].trim().split(/\s+/).filter((t) => t !== "" && t !== EPS);

        if (left.length !== 2 && left.length !== 3) {
            errors.push({ line: lineNumber, message: "A bal oldal alakja „z q a” vagy ε-átmenetnél „z q”." });
            return;
        }
        if (right.length === 0) {
            errors.push({ line: lineNumber, message: "A jobb oldal végén meg kell adni az új állapotot." });
            return;
        }

        const [z, q] = left;
        const letter = left.length === 3 ? left[2] : EPS;
        const next = right[right.length - 1];
        const push = right.slice(0, -1);

        addTo(Zsymbols, z);
        push.forEach((symbol) => addTo(Zsymbols, symbol));
        addTo(Qstates, q);
        addTo(Qstates, next);
        if (letter !== EPS) addTo(inputSymbols, letter);

        const moves = (((transitions[z] ??= {})[q] ??= {})[letter] ??= []);
        moves.push({ push, next });
    });

    return { transitions, Zsymbols, Qstates, inputSymbols, errors };
}

// A shortlex szerinti első szó, amelyen az automata és a nyelv eltér.
export function findPdaCounterexample(
    pda: Pda,
    mode: AcceptMode,
    alphabet: string[],
    inLanguage: (word: string) => boolean,
    maxLength: number,
    limits: PdaLimits,
): PdaCheckResult {
    let checked = 0;
    let undecided = 0;

    for (const word of shortlex(alphabet, maxLength)) {
        checked++;
        const result = wordchecker(pda, word, mode, limits);
        if (result === "unknown") {
            undecided++;
            continue;
        }
        const expected = inLanguage(word);
        if ((result === "accepted") !== expected) {
            return { counterexample: { word, expected, result }, checked, undecided };
        }
    }
    return { counterexample: null, checked, undecided };
}
