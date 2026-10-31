import { tokenize } from "./chomsky.ts";
import type { Grammer, Rule } from "./grammer";

export type CykSplit = {
    h: number;
    left: string[];
    right: string[];
    pairs: string[][];
    found: string[];
};

export type CykStep = {
    i: number;
    j: number;
    splits: CykSplit[];
    result: string[];
};

export type CykResult =
    | { ok: true; table: string[][][]; steps: CykStep[]; accepted: boolean }
    | { ok: false; error: string };

type BinaryRule = {
    from: string;
    B: string;
    C: string;
};

type FormItem = {
    symbol: string;
    i: number;
    j: number;
    isTerminal: boolean;
};

function isEpsilon(text: string): boolean {
    return text === "" || text === "ε";
}

function hasStartEpsilon(g: Grammer): boolean {
    for (const rule of g.rules) {
        if (rule.from === g.start && isEpsilon(rule.to)) {
            return true;
        }
    }
    return false;
}

export function isChomskyNormalForm(g: Grammer): { ok: true } | { ok: false; rule: Rule; reason: string } {
    for (const rule of g.rules) {
        const left = tokenize(g, rule.from);
        const right = tokenize(g, rule.to);

        if (left === null || right === null) {
            return { ok: false, rule, reason: "Ismeretlen szimbólum." };
        }

        if (left.length !== 1) {
            return { ok: false, rule, reason: "A bal oldalnak pontosan egy nemterminálisból kell állnia." };
        }

        if (isEpsilon(rule.to)) {
            if (left[0] !== g.start) {
                return { ok: false, rule, reason: "Csak a kezdőszimbólum vezethet ε-ra." };
            }
            continue;
        }

        const isTerminalRule = right.length === 1 && g.terminals.includes(right[0]);
        const isBinaryRule =
            right.length === 2 &&
            g.nonterminals.includes(right[0]) &&
            g.nonterminals.includes(right[1]);

        if (!isTerminalRule && !isBinaryRule) {
            return { ok: false, rule, reason: "A jobboldal nem CNF alakú (csak A→a vagy A→BC megengedett)." };
        }
    }

    if (hasStartEpsilon(g)) {
        for (const rule of g.rules) {
            const right = tokenize(g, rule.to);
            if (right !== null && right.includes(g.start) && rule.from !== g.start) {
                return { ok: false, rule, reason: "Ha van S→ε, akkor S nem szerepelhet jobboldalon." };
            }
        }
    }

    return { ok: true };
}

function getBinaryRules(g: Grammer): BinaryRule[] {
    const binaryRules: BinaryRule[] = [];
    for (const rule of g.rules) {
        const right = tokenize(g, rule.to);
        if (right !== null && right.length === 2) {
            binaryRules.push({ from: rule.from, B: right[0], C: right[1] });
        }
    }
    return binaryRules;
}

function inOrder(g: Grammer, symbols: string[]): string[] {
    const ordered: string[] = [];
    for (const nonterminal of g.nonterminals) {
        if (symbols.includes(nonterminal)) {
            ordered.push(nonterminal);
        }
    }
    return ordered;
}

export function cyk(g: Grammer, word: string): CykResult {
    if (!isChomskyNormalForm(g).ok) {
        return { ok: false, error: "A beadott grammatika nem chomsky normálformájú" };
    }

    for (const letter of word) {
        if (!g.terminals.includes(letter)) {
            return { ok: false, error: `"${letter}" nem terminális.` };
        }
    }

    if (word === "") {
        return { ok: true, table: [], steps: [], accepted: hasStartEpsilon(g) };
    }

    const binaryRules = getBinaryRules(g);
    const n = word.length;

    const table: string[][][] = [];
    for (let i = 0; i < n; i++) {
        const row: string[][] = [];
        for (let j = 0; j < n; j++) {
            row.push([]);
        }
        table.push(row);
    }

    const steps: CykStep[] = [];

    for (let i = 0; i < n; i++) {
        const froms: string[] = [];
        for (const rule of g.rules) {
            if (rule.to === word[i]) {
                froms.push(rule.from);
            }
        }
        table[i][i] = inOrder(g, froms);
        steps.push({ i: i, j: i, splits: [], result: table[i][i] });
    }

    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            const splits: CykSplit[] = [];
            const result: string[] = [];

            for (let h = i; h < j; h++) {
                const left = table[i][h];
                const right = table[h + 1][j];

                const pairs: string[][] = [];
                for (const B of left) {
                    for (const C of right) {
                        pairs.push([B, C]);
                    }
                }

                const found: string[] = [];
                for (const rule of binaryRules) {
                    if (left.includes(rule.B) && right.includes(rule.C)) {
                        found.push(rule.from);
                        result.push(rule.from);
                    }
                }

                splits.push({ h: h, left: left, right: right, pairs: pairs, found: inOrder(g, found) });
            }

            table[i][j] = inOrder(g, result);
            steps.push({ i: i, j: j, splits: splits, result: table[i][j] });
        }
    }

    const accepted = table[0][n - 1].includes(g.start);
    return { ok: true, table: table, steps: steps, accepted: accepted };
}

function expandItem(g: Grammer, word: string, table: string[][][], item: FormItem): FormItem[] {
    const { symbol, i, j } = item;

    if (i === j) {
        return [{ symbol: word[i], i: i, j: j, isTerminal: true }];
    }

    const binaryRules = getBinaryRules(g);

    for (let h = i; h < j; h++) {
        for (const rule of binaryRules) {
            if (rule.from === symbol && table[i][h].includes(rule.B) && table[h + 1][j].includes(rule.C)) {
                return [
                    { symbol: rule.B, i: i, j: h, isTerminal: false },
                    { symbol: rule.C, i: h + 1, j: j, isTerminal: false },
                ];
            }
        }
    }

    throw new Error("Invalid CYK table");
}

function firstNonterminal(form: FormItem[]): number {
    for (let pos = 0; pos < form.length; pos++) {
        if (!form[pos].isTerminal) {
            return pos;
        }
    }
    return -1;
}

function showForm(form: FormItem[]): string {
    let text = "";
    for (const item of form) {
        text += item.symbol;
    }
    return text;
}

export function cykDerivation(g: Grammer, word: string, table: string[][][]): string[] | null {
    const n = word.length;

    if (n === 0) {
        if (hasStartEpsilon(g)) {
            return [g.start, "ε"];
        }
        return null;
    }

    if (!table[0][n - 1].includes(g.start)) {
        return null;
    }

    const derivation: string[] = [];
    let form: FormItem[] = [{ symbol: g.start, i: 0, j: n - 1, isTerminal: false }];
    let pos = 0;

    while (pos !== -1) {
        derivation.push(showForm(form));
        const replacement = expandItem(g, word, table, form[pos]);
        form = [...form.slice(0, pos), ...replacement, ...form.slice(pos + 1)];
        pos = firstNonterminal(form);
    }

    derivation.push(showForm(form));
    return derivation;
}
