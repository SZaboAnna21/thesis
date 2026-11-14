import { describe, test } from "node:test";
import assert from "node:assert/strict";
import type { Dfa } from "../src/dfa.ts";
import { runDfa } from "../src/dfa.ts";
import { equivalenceRounds, minimize, reachableLayers, removeUnreachable } from "../src/minimize.ts";


const lectureExample: Dfa = {
  states: ["q0", "q1", "q2", "q3", "q4", "q5", "q6"],
  alphabet: ["a", "b"],
  start: "q0",
  accepting: ["q2", "q5"],
  transitions: {
    q0: { a: "q1", b: "q3" },
    q1: { a: "q4", b: "q2" },
    q2: { a: "q4", b: "q3" },
    q3: { a: "q4", b: "q0" },
    q4: { a: "q1", b: "q5" },
    q5: { a: "q1", b: "q0" },
    q6: { a: "q2", b: "q6" },
  },
};

describe("reachableLayers", () => {
  test("H_i sorozat a jegyzet szerint", () => {
    assert.deepEqual(reachableLayers(lectureExample), [
      ["q0"],
      ["q0", "q1", "q3"],
      ["q0", "q1", "q2", "q3", "q4"],
      ["q0", "q1", "q2", "q3", "q4", "q5"],
    ]);
  });

  test("elérhetetlen állapot kiesik", () => {
    const connected = removeUnreachable(lectureExample);
    assert.ok(!connected.states.includes("q6"));
    assert.ok(!("q6" in connected.transitions));
  });
});

describe("equivalenceRounds", () => {
  test("~0 osztályai F és Q \\ F", () => {
    const rounds = equivalenceRounds(removeUnreachable(lectureExample));
    assert.deepEqual(rounds[0].classes, [
      ["q0", "q1", "q3", "q4"],
      ["q2", "q5"],
    ]);
  });

  test("~1 = ~2, három osztály", () => {
    const rounds = equivalenceRounds(removeUnreachable(lectureExample));
    assert.equal(rounds.length, 2);
    const classes = rounds[1].classes.map((cls) => [...cls].sort());
      assert.deepEqual(classes, [
        ["q0", "q3"],
        ["q1", "q4"],
        ["q2", "q5"],
      ]);
  });

  test("csak elfogadó állapotok: egy osztály", () => {
    const all: Dfa = {
      states: ["p", "r"],
      alphabet: ["a"],
      start: "p",
      accepting: ["p", "r"],
      transitions: { p: { a: "r" }, r: { a: "p" } },
    };
    assert.deepEqual(equivalenceRounds(all).at(-1)!.classes, [["p", "r"]]);
  });
});

describe("minimize", () => {
  const { minimal, removed } = minimize(lectureExample);

  test("három állapot, q6 elhagyva", () => {
    assert.equal(minimal.states.length, 3);
    assert.deepEqual(removed, ["q6"]);
  });

  test("ugyanazt a nyelvet ismeri fel", () => {
    // #INT
    for (const word of ["", "a", "b", "ab", "aab", "abb", "bab", "abab", "ba"]) {
      assert.equal(runDfa(minimal, word).accepted, runDfa(lectureExample, word).accepted, word);
    }
  });

  test("kezdőállapot a q0 osztálya", () => {
    assert.equal(minimal.start, "{q0,q3}");
    assert.deepEqual(minimal.accepting, ["{q2,q5}"]);
  });
});
