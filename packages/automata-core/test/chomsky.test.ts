import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { checkOneRule, classifyGrammer, tokenize, type ChomskyResult } from "../src/chomsky.ts";
import type { Grammer } from "../src/grammer.ts";

function createGrammar( rules: string[], nonterminals = ["S", "A", "B", "C"],start = "S"
): Grammer {
  const parsedRules = rules.map((rule) => {
  const parts = rule.split("->");
  return { from: parts[0], to: parts[1], };});
  return { nonterminals,  terminals: ["a", "b", "c"], start, rules: parsedRules,};
}

function classify(g: Grammer) {
  const result = classifyGrammer(g);
  assert.equal(result.ok, true);
  return result;
}

const typesOf = (rule: string, g: Grammer) => {
  const [from, to] = rule.split("->");
  return [...checkOneRule({ from, to }, g).types].sort();
};

describe("classifyGrammer", () => {


  test("egyetlen szabaály S -> ε", () => {
    const result = classify(createGrammar(["S->"]));

    assert.deepEqual(result.types, [0, 1, 2, 3]);
    assert.equal(result.kes.hasStartEpsilon, true);
    assert.deepEqual(result.kes.violatingRules, []);
  });

  test("KES sértés", () => {
    const result = classify(createGrammar(["S->aSb", "S->"]));
    assert.equal(result.kes.hasStartEpsilon, true);
    assert.deepEqual(result.kes.violatingRules, [{ from: "S", to: "aSb" }]);
    assert.deepEqual(result.types, [0, 2]);
  });

  test("S nincs jobb oldalon", () => {
    const result = classify(createGrammar(["S->aA", "S->", "A->bA", "A->b"]));
    assert.deepEqual(result.kes.violatingRules, []);
    assert.deepEqual(result.types, [0, 1, 2, 3]);
  });

  test("KES csak az 1-es típust érinti", () => {
    const result = classify(createGrammar(["S->aS", "S->"]));
    assert.deepEqual(result.types, [0, 2, 3]);
  });

  test("ha nincs S → ε, a KES nem játszik", () => {
    const result = classify(createGrammar(["S->aSb", "S->ab"]));
    assert.equal(result.kes.hasStartEpsilon, false);
    assert.deepEqual(result.kes.violatingRules, []);
    assert.deepEqual(result.types, [0, 1, 2]);
  });

  test("needsKEScheck csak S → ε után", () => {
    const result = classify(createGrammar(["S->", "S->aA", "A->"]));
    assert.equal(result.rules[0].needsKEScheck, true);
    assert.equal(result.rules[1].needsKEScheck, false);
    assert.equal(result.rules[2].needsKEScheck, false);
  });

  test("nem grammatika felismerése", () => {
    const result = classifyGrammer(createGrammar(["S->c", "S->AB", "abb->aSb"]));
    assert.equal(result.ok, false);
    assert.ok(!result.ok && result.message.includes("abb"));
  });

  test("3-as típusú szabály", () => {
    const g = createGrammar([]);

    const regular = typesOf("A->abA", g);
    const terminal = typesOf("A->ab", g);
    const chain = typesOf("A->B", g);
    const empty = typesOf("A->", g);
    assert.deepEqual(empty, [0, 2, 3]);
    assert.deepEqual(regular, [0, 1, 2, 3]);
    assert.deepEqual(terminal, [0, 1, 2, 3]);
    assert.deepEqual(chain, [0, 1, 2, 3]);

  });

  test("2-es típusú szabály", () => {
    const g = createGrammar([]);
    assert.deepEqual(typesOf("S->aSb", g), [0, 1, 2]);
    assert.deepEqual(typesOf("A->Ab", g), [0, 1, 2]);
    assert.deepEqual(typesOf("S->AB", g), [0, 1, 2]);
  });
  test("LEQ grammatika a diáról", () => {
    const result = classify(
      createGrammar(["S->SS", "S->aSb", "S->bSa", "S->",])
    );
    assert.deepEqual(result.types, [0, 2]);
  });

  test("1-es típusú szabály", () => {
    const g = createGrammar([]);
    assert.deepEqual(typesOf("AB->AC", g), [0, 1]);
    assert.deepEqual(checkOneRule({ from: "AB", to: "AC" }, g).context, {
      u1: ["A"],
      A: "B",
      u2: [],
      v: ["C"],
    });
    const zh = createGrammar([], ["S", "A", "B", "K", "L"]);
    assert.deepEqual(typesOf("AL->BL", zh), [0, 1]);
  });


  test("swapping symbols should be a type 0", () => {
    const g = createGrammar([]);
    const result = typesOf("AB->BA", g);
    assert.deepEqual(result, [0]);
  });

  test("shortening can be type 0 only", () => {
  const g = createGrammar([]);
  const result1 = typesOf("AB->A", g);
  const result2 = typesOf("AB->", g);

  assert.deepEqual(result1, [0]);
  assert.deepEqual(result2, [0]);
});

  test("egész grammatika: a diák besorolási példája", () => {
    const result = classify(createGrammar(["S->ASB", "S->", "AB->BA", "BA->AB", "A->a", "B->b"]));
    assert.deepEqual(result.types, [0]);
  });

  test("egész grammatika: ZH1 6. feladat", () => {
    const result = classify(
      createGrammar(
        ["S->aKAbL", "Ab->bbA", "bB->Bbbb", "KA->", "L->", "AL->BL", "KB->KA"],
        ["S", "A", "B", "K", "L"],
      ),
    );
    assert.deepEqual(result.types, [0]);
  });

  test("több karakteres nemterminális (Z1)", () => {
    const g = createGrammar([], ["S", "Z1"]);
    assert.deepEqual(typesOf("S->Z1a", g), [0, 1, 2]);
    assert.deepEqual(typesOf("Z1->", g), [0, 2, 3]);
  });
  test("tokenize: leghosszabb illeszkedés, ε, ismeretlen jel", () => {
    const g = createGrammar([], ["S", "Z", "Z1"]);
    assert.deepEqual(tokenize(g, "aZ1b"), ["a", "Z1", "b"]);
    assert.deepEqual(tokenize(g, "aZb"), ["a", "Z", "b"]);
    assert.deepEqual(tokenize(g, ""), []);
    assert.deepEqual(tokenize(g, "ε"), []);
    assert.equal(tokenize(g, "aX"), null);
  });

  test("ismeretlen szimbólum: hibaüzenet, nem kivétel", () => {
    const result = classifyGrammer(createGrammar(["S->aX"]));
    assert.equal(result.ok, false);
    assert.ok(!result.ok && result.message.includes("aX"));
  });
});
