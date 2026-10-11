import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { checkOneRule, classifyGrammer, type ChomskyResult } from "../src/chomsky.ts";
import type { Grammer } from "../src/grammer.ts";

function grammar(rules: string[], nonterminals = ["S", "A", "B", "C"], start = "S"): Grammer {
  return {
    nonterminals,
    terminals: ["a", "b", "c"],
    start,
    rules: rules.map((rule) => {
      const [from, to] = rule.split("->");
      return { from, to };
    }),
  };
}

function classified(g: Grammer): Extract<ChomskyResult, { ok: true }> {
  const result = classifyGrammer(g);
  assert.ok(result.ok, result.ok ? "" : result.message);
  return result;
}

const typesOf = (rule: string, g: Grammer) => {
  const [from, to] = rule.split("->");
  return [...checkOneRule({ from, to }, g).types].sort();
};

describe("classifyGrammer", () => {


  test("szabály nélküli S -> ε", () => {
    // Csak S → ε: lokálisan minden típusba belefér, és a KES is teljesül,
    // mert S nem szerepel jobb oldalon.
    const result = classified(grammar(["S->"]));
    assert.deepEqual(result.types, [0, 1, 2, 3]);
    assert.equal(result.kes.hasStartEpsilon, true);
    assert.deepEqual(result.kes.violatingRules, []);
  });

  test("KES sértés felismerése", () => {
    // S → aSb | ε: az S → aSb jobb oldalán ott az S, ezért nem 1-es.
    const result = classified(grammar(["S->aSb", "S->"]));
    assert.equal(result.kes.hasStartEpsilon, true);
    assert.deepEqual(result.kes.violatingRules, [{ from: "S", to: "aSb" }]);
    assert.deepEqual(result.types, [0, 2]);
  });

  test("KES teljesül, ha S nincs jobb oldalon", () => {
    const result = classified(grammar(["S->aA", "S->", "A->bA", "A->b"]));
    assert.deepEqual(result.kes.violatingRules, []);
    assert.deepEqual(result.types, [0, 1, 2, 3]);
  });

  test("KES csak az 1-es típust érinti", () => {
    // S → aS | ε: 3-as marad, csak az 1-es esik ki.
    const result = classified(grammar(["S->aS", "S->"]));
    assert.deepEqual(result.types, [0, 2, 3]);
  });

  test("ha nincs S → ε, a KES nem játszik", () => {
    const result = classified(grammar(["S->aSb", "S->ab"]));
    assert.equal(result.kes.hasStartEpsilon, false);
    assert.deepEqual(result.kes.violatingRules, []);
    assert.deepEqual(result.types, [0, 1, 2]);
  });

  test("needsKEScheck beállítása", () => {
    const result = classified(grammar(["S->", "S->aA", "A->"]));
    const flags = result.rules.map((r) => `${r.rule.from}->${r.rule.to}: ${r.needsKEScheck}`);
    assert.deepEqual(flags, ["S->: true", "S->aA: false", "A->: false"]);
  });

  test("nem grammatika felismerése", () => {
    // A diák G1 példája: abb → aSb bal oldalán nincs nemterminális.
    const result = classifyGrammer(grammar(["S->c", "S->AB", "abb->aSb"]));
    assert.equal(result.ok, false);
    assert.ok(!result.ok && result.message.includes("abb"));
  });

  test("3-as típusú szabály", () => {
    const g = grammar([]);
    assert.deepEqual(typesOf("A->abA", g), [0, 1, 2, 3]);
    assert.deepEqual(typesOf("A->ab", g), [0, 1, 2, 3]);
    assert.deepEqual(typesOf("A->B", g), [0, 1, 2, 3]); // láncszabály: u = ε
    // A → ε (A ≠ S): 2-es és 3-as, de lokálisan nem 1-es
    assert.deepEqual(typesOf("A->", g), [0, 2, 3]);
  });

  test("2-es típusú szabály", () => {
    const g = grammar([]);
    // a nemterminális nem a végén áll, vagy több is van: nem 3-as
    assert.deepEqual(typesOf("S->aSb", g), [0, 1, 2]);
    assert.deepEqual(typesOf("A->Ab", g), [0, 1, 2]);
    assert.deepEqual(typesOf("S->AB", g), [0, 1, 2]);
  });
  test("LEQ grammatika a diáról", () => {
    const result = classified(
      grammar([
        "S->SS",
        "S->aSb",
        "S->bSa",
        "S->",
      ])
    );

    assert.deepEqual(result.types, [0, 2]);
  });

  test("1-es típusú szabály", () => {
    const g = grammar([]);
    assert.deepEqual(typesOf("AB->AC", g), [0, 1]);
    // a talált felbontás: u1 = A, a cserélt nemterminális B, u2 = ε, v = C
    assert.deepEqual(checkOneRule({ from: "AB", to: "AC" }, g).context, {
      u1: ["A"],
      A: "B",
      u2: [],
      v: ["C"],
    });
    // ZH1 6. feladat: AL → BL, a jobb oldali környezet L
    const zh = grammar([], ["S", "A", "B", "K", "L"]);
    assert.deepEqual(typesOf("AL->BL", zh), [0, 1]);
  });

  test("0-s típusú szabály", () => {
    const g = grammar([]);
    // csere: nincs olyan felbontás, ahol a környezet változatlan marad
    assert.deepEqual(typesOf("AB->BA", g), [0]);
    // a diák G2 példája: aCA → aSc
    assert.deepEqual(typesOf("aCA->aSc", g), [0]);
    // hosszcsökkentő szabályok
    assert.deepEqual(typesOf("AB->A", g), [0]);
    assert.deepEqual(typesOf("AB->", g), [0]);
  });

  test("egész grammatika: a diák besorolási példája", () => {
    const result = classified(grammar(["S->ASB", "S->", "AB->BA", "BA->AB", "A->a", "B->b"]));
    assert.deepEqual(result.types, [0]);
  });

  test("egész grammatika: ZH1 6. feladat", () => {
    const result = classified(
      grammar(
        ["S->aKAbL", "Ab->bbA", "bB->Bbbb", "KA->", "L->", "AL->BL", "KB->KA"],
        ["S", "A", "B", "K", "L"],
      ),
    );
    assert.deepEqual(result.types, [0]);
  });

  test("több karakteres nemterminális (Z1)", { todo: "tokenize kell a split('') helyett" }, () => {
    const g = grammar([], ["S", "Z1"]);
    // Z1 nemterminális, és nem a végén áll, tehát 2-es, de nem 3-as.
    // split('')-tel Z és 1 terminálisnak látszik, és tévesen 3-as lenne.
    assert.deepEqual(typesOf("S->Z1a", g), [0, 1, 2]);
    // Z1 → ε nem lokálisan 1-es (Z1 ≠ S); split('')-tel a bal oldal két
    // karakter lenne, és a 2-es típus is elveszne.
    assert.deepEqual(typesOf("Z1->", g), [0, 2, 3]);
  });
});
