
// G = (N E P S)
export type Rule = { from: string; to: string }
export type Step = { rule: Rule; position: number };

export type Grammer = {
  nonterminals: string[];
  terminals: string[];
  rules: Rule[];
  start: string;
};

export function possibleSteps(g: Grammer, word: string): Step[] {
    const steps: Step[] = [];
    for (const rule of g.rules) {
        let pos = word.indexOf(rule.from);
        while (pos !== -1) {
            steps.push({
                rule,
                position: pos
            });
            pos = word.indexOf(rule.from, pos + 1);
        }
    }
    return steps;
}

export function applyStep(word: string, step: Step): string {
    const from = step.rule.from;
    const to = step.rule.to;
    const pos = step.position;
    return (
        word.slice(0, pos) +
        to +
        word.slice(pos + from.length)
    );
}

export function isTerminalWord(g: Grammer, word: string): boolean {
for (const nt of g.nonterminals) {
if (word.includes(nt)) {
return false;
}
}
return true;
}

