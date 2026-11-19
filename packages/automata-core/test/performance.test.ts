import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";

import { cyk } from "../src/cyk.ts";
import { largeGrammar } from "./fixtures/largeGrammar.ts";
import { determinize } from "../src/nfa.ts";
import { minimize } from "../src/minimize.ts";
import type { Nfa } from "../src/nfa.ts";
import type { Dfa } from "../src/dfa.ts";

test("CYK nagy bemeneten megfelelő idő alatt fut", () => {
    const input = "a".repeat(50);
    const start = performance.now();
    cyk(largeGrammar, input);
    const elapsed = performance.now() - start;
    console.log(`CYK futási idő: ${elapsed.toFixed(2)} ms`);
    assert.ok(elapsed < 1000);
});

test("Determinizálás nagy NDVA-n megfelelő idő alatt fut", () => {
    const nfa: Nfa = {
        states: ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"],
        alphabet: ["a", "b"],
        starts: ["q0"],
        accepting: ["q9"],
        transitions: {
            q0: { a: ["q0", "q1"], b: ["q0"] },
            q1: { a: ["q2"], b: ["q2"] },
            q2: { a: ["q3"], b: ["q3"] },
            q3: { a: ["q4"], b: ["q4"] },
            q4: { a: ["q5"], b: ["q5"] },
            q5: { a: ["q6"], b: ["q6"] },
            q6: { a: ["q7"], b: ["q7"] },
            q7: { a: ["q8"], b: ["q8"] },
            q8: { a: ["q9"], b: ["q9"] },
            q9: {},
        },
    };
    const start = performance.now();
    determinize(nfa);
    const elapsed = performance.now() - start;
    console.log(`Determinizálás futási idő: ${elapsed.toFixed(2)} ms`);
    assert.ok(elapsed < 1000);
});

test("DFA minimalizálás nagy automatán megfelelő idő alatt fut", () => {
    const states = Array.from({ length: 20 }, (_, i) => `q${i}`);
    const transitions: Dfa["transitions"] = {};
    for (let i = 0; i < 20; i++) {
        transitions[`q${i}`] = { a: `q${(i + 1) % 20}`, b: `q${(i + 2) % 20}` };
    }
    const dfa: Dfa = {
        states,
        alphabet: ["a", "b"],
        start: "q0",
        accepting: ["q0", "q5", "q10", "q15"],
        transitions,
    };
    const start = performance.now();
    minimize(dfa);
    const elapsed = performance.now() - start;
    console.log(`Minimalizálás futási idő: ${elapsed.toFixed(2)} ms`);
    assert.ok(elapsed < 1000);
});