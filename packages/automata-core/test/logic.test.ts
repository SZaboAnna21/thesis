import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  classify,
  clauseToString,
  formulaToString,
  knfFromTable,
  parseFormula,
  truthTable,
  type Clause,
  type Formula,
} from "../src/logic.ts";

function parse(source: string): Formula {
  const result = parseFormula(source);
  assert.ok(result.ok, result.ok ? "" : result.error.message);
  return result.formula;
}


describe("parseFormula", () => {
  test("precedencia: ¬, ∧, ∨, →", () => {
    assert.equal(formulaToString(parse("y -> x & ~y | ~z")), "y → x ∧ ¬y ∨ ¬z");
    assert.equal(parse("y -> x & ~y | ~z").kind, "imp");
  });

  test("az implikáció jobbra köt", () => {
    assert.equal(formulaToString(parse("(x -> y) -> z")), "(x → y) → z");
    assert.equal(formulaToString(parse("x -> (y -> z)")), "x → y → z");
  });

  test("unicode jelek is mennek", () => {
    assert.equal(formulaToString(parse("¬(x → ¬y) → (z ∧ x)")), "¬(x → ¬y) → z ∧ x");
  });

  test("hibák", () => {
    assert.equal(parseFormula("").ok, false);
    assert.equal(parseFormula("x &").ok, false);
    assert.equal(parseFormula("(x | y").ok, false);
    assert.equal(parseFormula("x y").ok, false);
  });
});

describe("truthTable", () => {
  test("minta 1. feladat", () => {
    const table = truthTable(parse("y -> x & ~y | ~z"));
    assert.deepEqual(table.variables, ["y", "x", "z"]);
    assert.deepEqual(table.columns.map(formulaToString), ["¬y", "¬z", "x ∧ ¬y", "x ∧ ¬y ∨ ¬z", "y → x ∧ ¬y ∨ ¬z"]);
    const last = table.rows.map((row) => (row.values[4] ? "i" : "h")).join("");
    assert.equal(last, "hihiiiii");
  });

  test("minta 2. feladat: KNF a táblából", () => {
    const table = truthTable(parse("~(x -> ~y) -> z & x"));
    assert.deepEqual(knfFromTable(table).map((clause) => clauseToString(clause)),["¬x ∨ ¬y ∨ z"]);
  });

  test("osztályozás", () => {
    assert.equal(classify(truthTable(parse("x | ~x"))), "tautology");
    assert.equal(classify(truthTable(parse("x & ~x"))), "unsatisfiable");
    assert.equal(classify(truthTable(parse("x -> y"))), "satisfiable");
    assert.equal(classify(truthTable(parse("x"))), "satisfiable");
  });

  test("single variable", () => {
    const table = truthTable(parse("x"));
    assert.deepEqual(table.variables, ["x"]);
    assert.equal(table.rows.length, 2);
  });

  test("KNF of tautology", () => {
    const table = truthTable(parse("x | ~x"));
    assert.deepEqual(knfFromTable(table).map((clause) => clauseToString(clause)), []);
  });

});
