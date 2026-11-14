import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { isChomskyNormalForm, cyk, cykDerivation } from "../src/cyk.ts";
import type { Grammer } from "../src/grammer.ts";

const simple: Grammer = {
  nonterminals: ["S", "A", "B"],
  terminals: ["a", "b"],
  rules: [
    { from: "S", to: "AB" },
    { from: "S", to: "a" },
    { from: "A", to: "a" },
    { from: "B", to: "b" },
  ],
  start: "S",
};

const anbn: Grammer = {
  nonterminals: ["S", "A", "B", "C"],
  terminals: ["a", "b"],
  rules: [
    { from: "S", to: "AB" },
    { from: "S", to: "AC" },
    { from: "C", to: "SB" },
    { from: "A", to: "a" },
    { from: "B", to: "b" },
  ],
  start: "S",
};

const withEps: Grammer = {
  nonterminals: ["S"],
  terminals: ["a"],
  rules: [{ from: "S", to: "" }, { from: "S", to: "a" }],
  start: "S",
};

describe("isChomskyNormalForm", () => {
  test("CNF grammatikára ok: true", () => {
    assert.deepEqual(isChomskyNormalForm(simple), { ok: true });
  });

  test("nem CNF: háromtagú jobboldal", () => {
    const g: Grammer = {
      nonterminals: ["S", "A", "B"],
      terminals: ["a", "b"],
      rules: [{ from: "S", to: "aAB" }],
      start: "S",
    };
    assert.equal(isChomskyNormalForm(g).ok, false);
  });

  test("nem CNF: lánccszabály A→B", () => {
    const g: Grammer = {
      nonterminals: ["S", "A"],
      terminals: ["a"],
      rules: [{ from: "S", to: "A" }, { from: "A", to: "a" }],
      start: "S",
    };
    assert.equal(isChomskyNormalForm(g).ok, false);
  });

  test("nem CNF: ε csak a kezdőszimbólumból megengedett", () => {
    const g: Grammer = {
      nonterminals: ["S", "A"],
      terminals: ["a"],
      rules: [{ from: "A", to: "" }],
      start: "S",
    };
    assert.equal(isChomskyNormalForm(g).ok, false);
  });

  test("S→ε megengedett ha S nem szerepel jobboldalon", () => {
    const g: Grammer = {
      nonterminals: ["S", "A", "B"],
      terminals: ["a"],
      rules: [
        { from: "S", to: "" },
        { from: "S", to: "AB" },
        { from: "A", to: "a" },
        { from: "B", to: "a" },
      ],
      start: "S",
    };
    assert.deepEqual(isChomskyNormalForm(g), { ok: true });
  });
});

describe("cyk", () => {
  test("nem CNF grammatikára ok: false", () => {
    const g: Grammer = {
      nonterminals: ["S"],
      terminals: ["a"],
      rules: [{ from: "S", to: "aS" }],
      start: "S",
    };
    assert.equal(cyk(g, "a").ok, false);
  });

  test("ábécén kívüli betűre ok: false", () => {
    assert.equal(cyk(simple, "ac").ok, false);
  });

  test("üres szó: elfogad ha S→ε van", () => {
    const r = cyk(withEps, "");
    assert.ok(r.ok && r.accepted);
  });

  test("üres szó: nem fogad el ha nincs S→ε", () => {
    const r = cyk(simple, "");
    assert.ok(r.ok && !r.accepted);
  });

  test("elfogadott szavak", () => {
    for (const w of ["a", "ab"]) {
      const r = cyk(simple, w);
      assert.ok(r.ok && r.accepted, w);
    }
  });

  test("elutasított szó", () => {
    const r = cyk(simple, "b");
    assert.ok(r.ok && !r.accepted);
  });

  test("anbn: elfogad", () => {
    for (const w of ["ab", "aabb"]) {
      const r = cyk(anbn, w);
      assert.ok(r.ok && r.accepted, w);
    }
  });

  test("anbn: elutasít", () => {
    const r = cyk(anbn, "aab");
    assert.ok(r.ok && !r.accepted);
  });

  test("a tábla mérete n×n", () => {
    const r = cyk(simple, "ab");
    assert.ok(r.ok);
    if (r.ok) {
      assert.equal(r.table.length, 2);
      assert.equal(r.table[0].length, 2);
    }
  });
});

describe("cykDerivation", () => {
  test("elfogadott szóhoz levezetést ad: S-sel kezd, a szóval végez", () => {
    const r = cyk(simple, "ab");
    assert.ok(r.ok);
    if (!r.ok) return;
    const d = cykDerivation(simple, "ab", r.table);
    assert.ok(d !== null && d.length > 0);
    assert.equal(d![0], "S");
    assert.equal(d![d!.length - 1], "ab");
  });

  test("nem elfogadott szóhoz null", () => {
    const r = cyk(simple, "b");
    assert.ok(r.ok);
    if (!r.ok) return;
    assert.equal(cykDerivation(simple, "b", r.table), null);
  });

  test("üres szó és S→ε: levezetés [S, ε]", () => {
    const g: Grammer = {
      nonterminals: ["S"],
      terminals: ["a"],
      rules: [{ from: "S", to: "" }],
      start: "S",
    };
    assert.deepEqual(cykDerivation(g, "", []), ["S", "ε"]);
  });

  test("üres szó nincs S→ε: null", () => {
    assert.equal(cykDerivation(simple, "", []), null);
  });
});
