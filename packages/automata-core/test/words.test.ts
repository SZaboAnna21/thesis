import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { reverse, concatenate, power, prefixes, properPrefixes, suffixes, properSuffixes, runAll } from "../src/words.ts";

describe("reverse", () => {
  test("üres szó visszafordítva üres", () => {
    assert.equal(reverse(""), "");
  });

  test("egy betű maga marad", () => {
    assert.equal(reverse("a"), "a");
  });

  test("abc -> cba", () => {
    assert.equal(reverse("abc"), "cba");
  });

  test("palindróm maga marad", () => {
    assert.equal(reverse("abba"), "abba");
  });
});

describe("concatenate", () => {
  test("két szó összefűzése", () => {
    assert.equal(concatenate("ab", "cd"), "abcd");
  });

  test("üres szóval fűzve nem változik", () => {
    assert.equal(concatenate("abc", ""), "abc");
    assert.equal(concatenate("", "abc"), "abc");
  });
});

describe("power", () => {
  test("0-adik hatványon üres szó", () => {
    assert.equal(power("ab", 0), "");
  });

  test("1-es hatvány maga a szó", () => {
    assert.equal(power("ab", 1), "ab");
  });

  test("3-as hatvány háromszoros ismétlés", () => {
    assert.equal(power("ab", 3), "ababab");
  });

  test("üres szó bármely hatványa üres", () => {
    assert.equal(power("", 5), "");
  });
});

describe("prefixes", () => {
  test("tartalmazza az üres szót és a teljes szót", () => {
    const p = prefixes("ab");
    assert.ok(p.includes(""));
    assert.ok(p.includes("ab"));
  });

  test("abc prefixei sorban", () => {
    assert.deepEqual(prefixes("abc"), ["", "a", "ab", "abc"]);
  });

  test("üres szónak egy prefixe van: az üres", () => {
    assert.deepEqual(prefixes(""), [""]);
  });
});

describe("properPrefixes", () => {
  test("nem tartalmazza a teljes szót", () => {
    const p = properPrefixes("abc");
    assert.ok(!p.includes("abc"));
  });

  test("abc valódi prefixei", () => {
    assert.deepEqual(properPrefixes("abc"), ["", "a", "ab"]);
  });

  test("üres szónak nincs valódi prefixe", () => {
    assert.deepEqual(properPrefixes(""), []);
  });
});

describe("suffixes", () => {
  test("tartalmazza az üres szót és a teljes szót", () => {
    const s = suffixes("ab");
    assert.ok(s.includes(""));
    assert.ok(s.includes("ab"));
  });

  test("abc suffixei sorban", () => {
    assert.deepEqual(suffixes("abc"), ["abc", "bc", "c", ""]);
  });

  test("üres szónak egy suffixe van: az üres", () => {
    assert.deepEqual(suffixes(""), [""]);
  });
});

describe("properSuffixes", () => {
  test("nem tartalmazza a teljes szót", () => {
    const s = properSuffixes("abc");
    assert.ok(!s.includes("abc"));
  });

  test("abc valódi suffixei", () => {
    assert.deepEqual(properSuffixes("abc"), ["bc", "c", ""]);
  });

  test("üres szónak nincs valódi suffixe", () => {
    assert.deepEqual(properSuffixes(""), []);
  });
});

describe("runAll", () => {
  test("az összes mező helyes értéket ad", () => {
    const result = runAll("ab", "cd", 3);
    assert.equal(result.word, "ab");
    assert.equal(result.length, 2);
    assert.equal(result.reverse, "ba");
    assert.equal(result.concatenate, "abcd");
    assert.equal(result.power, "ababab");
    assert.deepEqual(result.prefixes, ["", "a", "ab"]);
    assert.deepEqual(result.properPrefixes, ["", "a"]);
    assert.deepEqual(result.suffixes, ["ab", "b", ""]);
    assert.deepEqual(result.properSuffixes, ["b", ""]);
  });

  test("alapértelmezett paraméterekkel is működik", () => {
    const result = runAll("a");
    assert.equal(result.concatenate, "a");
    assert.equal(result.power, "aa");
  });
});
