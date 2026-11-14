import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { possibleSteps, applyStep, isTerminalWord, type Grammer } from "../src/grammer.ts";

const simpleGrammer: Grammer = {
  nonterminals: ["S", "A"],
  terminals: ["a", "b"],
  rules: [
    { from: "S", to: "aA" },
    { from: "S", to: "b" },
    { from: "A", to: "aS" },
  ],
  start: "S",
};

describe("possibleSteps", () => {
  test("S-ből két lehetséges lépés", () => {
    const steps = possibleSteps(simpleGrammer, "S");
    assert.equal(steps.length, 2);
  });

  test("lépés tartalmazza a szabályt és a pozíciót", () => {
    const steps = possibleSteps(simpleGrammer, "S");
    const froms = steps.map((s) => s.rule.from);
    assert.ok(froms.every((f) => f === "S"));
    const positions = steps.map((s) => s.position);
    assert.ok(positions.every((p) => p === 0));
  });

  test("terminális szóra nincs lépés", () => {
    const steps = possibleSteps(simpleGrammer, "aab");
    assert.equal(steps.length, 0);
  });

  test("több előfordulás esetén minden pozíció szerepel", () => {
    const g: Grammer = {
      nonterminals: ["A"],
      terminals: ["a"],
      rules: [{ from: "A", to: "a" }],
      start: "A",
    };
    const steps = possibleSteps(g, "AaA");
    assert.equal(steps.length, 2);
    assert.equal(steps[0].position, 0);
    assert.equal(steps[1].position, 2);
  });

  test("üres szóra nincs lépés", () => {
    assert.equal(possibleSteps(simpleGrammer, "").length, 0);
  });
});

describe("applyStep", () => {
  test("S -> aA alkalmazása S-re", () => {
    const step = { rule: { from: "S", to: "aA" }, position: 0 };
    assert.equal(applyStep("S", step), "aA");
  });

  test("lépés a szó közepén", () => {
    const step = { rule: { from: "A", to: "aS" }, position: 1 };
    assert.equal(applyStep("bAb", step), "baSb");
  });

  test("lépés a szó végén", () => {
    const step = { rule: { from: "A", to: "b" }, position: 2 };
    assert.equal(applyStep("aaA", step), "aab");
  });

  test("üres jobboldal törli a szimbólumot", () => {
    const step = { rule: { from: "A", to: "" }, position: 1 };
    assert.equal(applyStep("bAc", step), "bc");
  });
});

describe("isTerminalWord", () => {
  test("terminális szó esetén true", () => {
    assert.ok(isTerminalWord(simpleGrammer, "aab"));
    assert.ok(isTerminalWord(simpleGrammer, ""));
    assert.ok(isTerminalWord(simpleGrammer, "b"));
  });

  test("nemterminálissal false", () => {
    assert.ok(!isTerminalWord(simpleGrammer, "S"));
    assert.ok(!isTerminalWord(simpleGrammer, "aA"));
    assert.ok(!isTerminalWord(simpleGrammer, "aAb"));
  });

  test("csak nemterminális is false", () => {
    assert.ok(!isTerminalWord(simpleGrammer, "SA"));
  });
});
