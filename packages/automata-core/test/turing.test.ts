import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  initConfiguration,
  isHalted,
  isAccepted,
  findTransition,
  step,
  computeAllSteps,
  type TuringMachine,
} from "../src/turing.ts";

const onlyA: TuringMachine = {
  startState: "q0",
  acceptState: "qacc",
  rejectState: "qrej",
  blankSymbol: "_",
  transitions: [
    { from: "q0", read: "a", to: "q0", write: "a", dir: "R" },
    { from: "q0", read: "_", to: "qacc", write: "_", dir: "S" },
    { from: "q0", read: "b", to: "qrej", write: "b", dir: "S" },
  ],
};

describe("initConfiguration", () => {
  test("nem üres inputon a szalag = betűk + blank", () => {
    const cfg = initConfiguration(onlyA, "ab");
    assert.deepEqual(cfg.tape, ["a", "b", "_"]);
    assert.equal(cfg.head, 0);
    assert.equal(cfg.state, onlyA.startState);
  });

  test("üres inputon a szalag = [blank]", () => {
    const cfg = initConfiguration(onlyA, "");
    assert.deepEqual(cfg.tape, ["_"]);
    assert.equal(cfg.head, 0);
  });
});

describe("isHalted", () => {
  test("elfogadó állapotban megáll", () => {
    const cfg = { tape: ["_"], head: 0, state: onlyA.acceptState };
    assert.ok(isHalted(onlyA, cfg));
  });

  test("elutasító állapotban megáll", () => {
    const cfg = { tape: ["_"], head: 0, state: onlyA.rejectState };
    assert.ok(isHalted(onlyA, cfg));
  });

  test("közbülső állapotban nem áll meg", () => {
    const cfg = { tape: ["a", "_"], head: 0, state: "q0" };
    assert.ok(!isHalted(onlyA, cfg));
  });
});

describe("isAccepted", () => {
  test("elfogadó állapotban true", () => {
    const cfg = { tape: ["_"], head: 0, state: onlyA.acceptState };
    assert.ok(isAccepted(onlyA, cfg));
  });

  test("elutasító állapotban false", () => {
    const cfg = { tape: ["_"], head: 0, state: onlyA.rejectState };
    assert.ok(!isAccepted(onlyA, cfg));
  });
});

describe("findTransition", () => {
  test("illeszkedő átmenetet megtalálja", () => {
    const cfg = { tape: ["a", "_"], head: 0, state: "q0" };
    const t = findTransition(onlyA, cfg);
    assert.ok(t !== null);
    assert.equal(t!.write, "a");
    assert.equal(t!.dir, "R");
  });

  test("nincs illeszkedő átmenet: null", () => {
    const cfg = { tape: ["x"], head: 0, state: "q0" };
    assert.equal(findTransition(onlyA, cfg), null);
  });
});

describe("step", () => {
  test("'a' olvasása után jobbra lép", () => {
    const cfg = { tape: ["a", "_"], head: 0, state: "q0" };
    const next = step(onlyA, cfg);
    assert.equal(next.head, 1);
    assert.equal(next.state, "q0");
  });

  test("nincs átmenet: elutasító állapotba kerül", () => {
    const cfg = { tape: ["x"], head: 0, state: "q0" };
    const next = step(onlyA, cfg);
    assert.equal(next.state, onlyA.rejectState);
  });

  test("bal szélre lépéskor blank kerül elé", () => {
    const tmLeft: TuringMachine = {
      startState: "q0",
      acceptState: "qacc",
      rejectState: "qrej",
      blankSymbol: "_",
      transitions: [
        { from: "q0", read: "a", to: "q0", write: "a", dir: "L" },
      ],
    };
    const cfg = { tape: ["a"], head: 0, state: "q0" };
    const next = step(tmLeft, cfg);
    assert.deepEqual(next.tape, ["_", "a"]);
    assert.equal(next.head, 0);
  });

  test("jobb szélre lépéskor blank kerül a végére", () => {
    const cfg = { tape: ["a"], head: 0, state: "q0" };
    const next = step(onlyA, cfg);
    assert.equal(next.tape[next.head], "_");
  });
});

describe("computeAllSteps", () => {
  test("'aaa' elfogadása: az utolsó konfiguráció elfogadó", () => {
    const steps = computeAllSteps(onlyA, "aaa");
    const last = steps[steps.length - 1];
    assert.equal(last.state, onlyA.acceptState);
  });

  test("'ab' elutasítása: az utolsó konfiguráció elutasító", () => {
    const steps = computeAllSteps(onlyA, "ab");
    const last = steps[steps.length - 1];
    assert.equal(last.state, onlyA.rejectState);
  });

  test("üres szó elfogadása", () => {
    const steps = computeAllSteps(onlyA, "");
    const last = steps[steps.length - 1];
    assert.equal(last.state, onlyA.acceptState);
  });

  test("lépések száma >= 1 (legalább a kezdeti konfiguráció)", () => {
    const steps = computeAllSteps(onlyA, "a");
    assert.ok(steps.length >= 1);
  });

  test("maxSteps limitálja a lépéseket", () => {
    const tmLoop: TuringMachine = {
      startState: "q0",
      acceptState: "qacc",
      rejectState: "qrej",
      blankSymbol: "_",
      transitions: [
        { from: "q0", read: "_", to: "q0", write: "_", dir: "S" },
      ],
    };
    const steps = computeAllSteps(tmLoop, "", 5);
    assert.equal(steps.length, 6);
  });
});
