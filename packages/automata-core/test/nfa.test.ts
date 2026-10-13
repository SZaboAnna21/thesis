import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { EPS, acceptsWord, epsilonClosure, runNfa, type Nfa } from "../src/nfa.ts";

const sorted = (xs: string[]) => [...xs].sort();

// "ab"-re végződő szavak: q0-ban várunk, a-ra q1-be is "átugrunk".
const endsWithAb: Nfa = {
  states: ["q0", "q1", "q2"],
  alphabet: ["a", "b"],
  starts: ["q0"],
  accepting: ["q2"],
  transitions: {
    q0: { a: ["q0", "q1"], b: ["q0"] },
    q1: { b: ["q2"] },
    q2: {},
  },
};

// ε-lánc: p0 -ε-> p1 -ε-> p2, és p2 a-ra önmagába. p2 elfogadó, tehát a* minden szava jó.
const epsChain: Nfa = {
  states: ["p0", "p1", "p2"],
  alphabet: ["a"],
  starts: ["p0"],
  accepting: ["p2"],
  transitions: {
    p0: { [EPS]: ["p1"] },
    p1: { [EPS]: ["p2"] },
    p2: { a: ["p2"] },
  },
};

// ε-kör: r0 <-ε-> r1, r1 b-re r2.
const epsCycle: Nfa = {
  states: ["r0", "r1", "r2"],
  alphabet: ["b"],
  starts: ["r0"],
  accepting: ["r2"],
  transitions: {
    r0: { [EPS]: ["r1"] },
    r1: { [EPS]: ["r0"], b: ["r2"] },
    r2: {},
  },
};

describe("epsilonClosure", () => {
  test("ε-átmenet nélkül csak önmaga", () => {
    assert.deepEqual(sorted(epsilonClosure(endsWithAb, ["q0"])), ["q0"]);
  });

  test("ε-lánc végig", () => {
    assert.deepEqual(sorted(epsilonClosure(epsChain, ["p0"])), ["p0", "p1", "p2"]);
    assert.deepEqual(sorted(epsilonClosure(epsChain, ["p1"])), ["p1", "p2"]);
  });

  test("ε-kör: megáll", () => {
    assert.deepEqual(sorted(epsilonClosure(epsCycle, ["r0"])), ["r0", "r1"]);
  });

  test("több állapotból indulva, duplikáció nélkül", () => {
    const closure = epsilonClosure(epsChain, ["p0", "p1"]);
    assert.deepEqual(sorted(closure), ["p0", "p1", "p2"]);
  });

  test("üres halmaz lezártja üres", () => {
    assert.deepEqual(epsilonClosure(epsChain, []), []);
  });
});

describe("runNfa", () => {
  test("az első lépés a kezdőállapotok", () => {
    const steps = runNfa(endsWithAb, "ab");
    assert.equal(steps[0].letter, null);
    assert.deepEqual(sorted(steps[0].active), ["q0"]);
  });

  test("aab: lépésenként az aktív halmazok", () => {
    const steps = runNfa(endsWithAb, "aab");
    assert.deepEqual(steps.map((s) => s.letter), [null, "a", "a", "b"]);
    assert.deepEqual(steps.map((s) => sorted(s.active)), [["q0"], ["q0", "q1"], ["q0", "q1"], ["q0", "q2"]]);
  });

  test("az ε-lezártat az elején és minden betű után is veszi", () => {
    const steps = runNfa(epsChain, "a");
    assert.deepEqual(sorted(steps[0].active), ["p0", "p1", "p2"]);
    assert.deepEqual(sorted(steps[1].active), ["p2"]);
  });

  test("ha elfogy minden állapot, üres marad", () => {
    const steps = runNfa(epsCycle, "bb");
    assert.deepEqual(sorted(steps[1].active), ["r2"]);
    assert.deepEqual(steps[2].active, []);
  });

  test("üres szó: csak a kezdő lépés", () => {
    assert.equal(runNfa(endsWithAb, "").length, 1);
  });
});

describe("acceptsWord", () => {
  test("ab-re végződő szavak", () => {
    for (const w of ["ab", "aab", "bab", "abab"]) assert.ok(acceptsWord(endsWithAb, w), w);
    for (const w of ["", "a", "b", "ba", "aba"]) assert.ok(!acceptsWord(endsWithAb, w), w);
  });

  test("ε-átmenettel az üres szót is elfogadja", () => {
    assert.ok(acceptsWord(epsChain, ""));
    assert.ok(acceptsWord(epsChain, "aaa"));
  });

  test("ε-kör", () => {
    assert.ok(acceptsWord(epsCycle, "b"));
    assert.ok(!acceptsWord(epsCycle, ""));
    assert.ok(!acceptsWord(epsCycle, "bb"));
  });
});
