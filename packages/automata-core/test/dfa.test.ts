import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { isComplete, runDfa, dfaToNfa, type Dfa } from "../src/dfa.ts";

const evenA: Dfa = {
  states: ["even", "odd"],
  alphabet: ["a", "b"],
  transitions: {
    even: { a: "odd", b: "even" },
    odd: { a: "even", b: "odd" },
  },
  start: "even",
  accepting: ["even"],
};

const incomplete: Dfa = {
  states: ["q0", "q1"],
  alphabet: ["a", "b"],
  transitions: {
    q0: { a: "q1" },
    q1: { a: "q0" },
  },
  start: "q0",
  accepting: ["q1"],
};

describe("isComplete", () => {
  test("teljes DFA-ra true", () => {
    assert.ok(isComplete(evenA));
  });

  test("hiányzó átmenetre false", () => {
    assert.ok(!isComplete(incomplete));
  });
});

describe("runDfa", () => {
  test("üres szó: csak a kezdőállapot", () => {
    const run = runDfa(evenA, "");
    assert.equal(run.steps.length, 1);
    assert.equal(run.steps[0].state, "even");
    assert.ok(run.accepted);
  });

  test("páros számú a-t elfogad", () => {
    assert.ok(runDfa(evenA, "aa").accepted);
    assert.ok(runDfa(evenA, "aabbaa").accepted);
    assert.ok(runDfa(evenA, "bb").accepted);
  });

  test("páratlan számú a-t nem fogad el", () => {
    assert.ok(!runDfa(evenA, "a").accepted);
    assert.ok(!runDfa(evenA, "bab").accepted);
  });

  test("lépések száma = szó hossza + 1", () => {
    const run = runDfa(evenA, "aab");
    assert.equal(run.steps.length, 4);
  });

  test("lépések pozíciói 0-tól növekednek", () => {
    const run = runDfa(evenA, "ab");
    assert.deepEqual(run.steps.map((s) => s.position), [0, 1, 2]);
  });

  test("ábécén kívüli betűre invalidLetter-t ad vissza", () => {
    const run = runDfa(evenA, "ac");
    assert.ok(!run.accepted);
    assert.equal(run.invalidLetter, "c");
  });
});

describe("dfaToNfa", () => {
  test("az állapotok és ábécé megmaradnak", () => {
    const nfa = dfaToNfa(evenA);
    assert.deepEqual(nfa.states, evenA.states);
    assert.deepEqual(nfa.alphabet, evenA.alphabet);
    assert.deepEqual(nfa.accepting, evenA.accepting);
  });

  test("a kezdőállapot az NFA starts tömbjeként jelenik meg", () => {
    const nfa = dfaToNfa(evenA);
    assert.deepEqual(nfa.starts, [evenA.start]);
  });

  test("az átmenetek tömbökbe vannak csomagolva", () => {
    const nfa = dfaToNfa(evenA);
    assert.deepEqual(nfa.transitions["even"]["a"], ["odd"]);
    assert.deepEqual(nfa.transitions["even"]["b"], ["even"]);
  });
});
