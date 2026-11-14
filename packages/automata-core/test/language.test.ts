import { test } from "node:test";
import assert from "node:assert/strict";
import {
  shortlex,
  parseRegex,
  regexToString,
  regexMatches,
  findRegexCounterexample,
  checkRegex,
  regexToNfa,
  nfaAcceptsPrefix,
  nfaAcceptsSuffix,
  concatSplits,
  inKleeneStar,
  type Regex,
} from "../src/language.ts";

function parse(source: string): Regex {
  const result = parseRegex(source);
  if (!result.ok) {
    throw new Error(`${source}: ${result.error.message}`);
  }
  return result.regex;
}

function count(word: string, letter: string): number {
  let n = 0;
  for (const c of word) {
    if (c === letter) n++;
  }
  return n;
}

test("shortlex: rövidebb előbb, azonos hossznál ábécérend", () => {
  assert.deepEqual([...shortlex(["a", "b"], 2)], ["", "a", "b", "aa", "ab", "ba", "bb"]);
});

test("parser: precedencia (csillag > konkatenáció > alternatíva)", () => {
  assert.equal(regexToString(parse("(a+b)a*")), "(a + b)a*");
  assert.equal(regexToString(parse("a+ba*")), "a + ba*");
  assert.equal(regexToString(parse("ab*")), "ab*");
  assert.equal(regexToString(parse("(ab)*")), "(ab)*");
});

test("parser: alternatív jelölések", () => {
  for (const source of ["a|b", "a ∪ b", "a + b"]) {
    assert.equal(regexToString(parse(source)), "a + b");
  }
  assert.equal(regexToString(parse("a·b")), "ab");
  assert.equal(regexToString(parse("(a*b)^3")), "(a*b)^3");
  assert.equal(regexToString(parse("(a*b)³")), "(a*b)^3");
  assert.equal(regexToString(parse("a^+")), "a^+");
  assert.equal(regexToString(parse("a⁺")), "a^+");
});

test("parser: hibaüzenetek", () => {
  for (const source of ["", "a+", "(a", "a)", "*a", "+a", "()", "a^", "a!"]) {
    const result = parseRegex(source);
    assert.equal(result.ok, false, source);
  }
  const unclosed = parseRegex("b(ab");
  assert.ok(!unclosed.ok && unclosed.error.position === 1);
});

test("illeszkedés: ε, ∅ és a csillag", () => {
  assert.ok(regexMatches(parse("ε"), ""));
  assert.ok(!regexMatches(parse("ε"), "a"));
  assert.ok(!regexMatches(parse("∅"), ""));
  assert.ok(regexMatches(parse("∅*"), ""));
  assert.ok(!regexMatches(parse("a∅"), "a"));
  assert.ok(regexMatches(parse("(aa)*"), "aaaa"));
  assert.ok(!regexMatches(parse("(aa)*"), "aaa"));
  assert.ok(regexMatches(parse("(a*b)^3"), "baabab"));
  assert.ok(!regexMatches(parse("(a*b)^3"), "bb"));
  assert.ok(!regexMatches(parse("a^+"), ""));
});

test("pontos összevetés: az azonosságok ekvivalensek-e", () => {
  // #INT
  const pairs = [
    ["(a+b)a*", "aa*+ba*"],
    ["a*", "ε+aa*"],
    ["a*", "(ε+a)*"],
    ["(a+b)*", "(a*b*)*"],
    ["ab*(bc*)*", "ab*(bc*)*+∅"],
  ];
  for (const pair of pairs) {
    const p = pair[0];
    const q = pair[1];

    assert.equal(findRegexCounterexample(parse(p), parse(q), ["a", "b", "c"]), null, `${p} = ${q}`);
  }
});

test("pontos összevetés: a legrövidebb ellenpélda", () => {
  // #INT
  assert.deepEqual(findRegexCounterexample(parse("a+ba*"), parse("(a+b)a*"), ["a", "b"]), {
    word: "aa",
    inCandidate: false,
    inReference: true,
  });
});

function hasEvenNumberOfAs(u: string): boolean {
  if (count(u, "a") % 2 !== 0) return false;
  const lastB = u.lastIndexOf("b");
  if (lastB === -1) return true;
  const lettersAfterLastB = u.length - lastB - 1;
  return lettersAfterLastB % 2 === 1;
}

test("checkRegex: helyes megoldás nem kap ellenpéldát", () => {
  // #INT
  const result = checkRegex(
    "(aa)* + (b+ab*a)*ab*ba(aa)*",
    { kind: "predicate", accepts: hasEvenNumberOfAs, maxLength: 10 },
    ["a", "b"],
  );
  assert.deepEqual(result, { status: "no-counterexample", checkedUpTo: 10 });
});

test("checkRegex: hibás megoldás ellenpéldát kap", () => {
  // #INT
  const result = checkRegex("(b+ab*a)*ab*ba(aa)*",
    { kind: "predicate", accepts: hasEvenNumberOfAs, maxLength: 10 },
    ["a", "b"],
  );
  assert.deepEqual(result, {
    status: "counterexample",
    counterexample: { word: "", inCandidate: false, inReference: true },
  });
});

test("checkRegex: páros számú 1-est tartalmazó szavak, regex referenciával", () => {
  // #INT
  const reference: { kind: "regex"; source: string } = { kind: "regex", source: "0*(10*10*)*" };
  assert.deepEqual(checkRegex("(0+10*1)*", reference, ["0", "1"]), { status: "equivalent" });
  assert.deepEqual(checkRegex("(0+11)*", reference, ["0", "1"]), {
    status: "counterexample",
    counterexample: { word: "101", inCandidate: false, inReference: true },
  });
});

test("idegen betű és szintaktikai hiba", () => {
  const reference = { kind: "regex", source: "a*" } as const;
  assert.deepEqual(checkRegex("a*c", reference, ["a", "b"]), { status: "foreign-letter", letter: "c" });
  assert.equal(checkRegex("a+", reference, ["a", "b"]).status, "parse-error");
});

test("nyelvműveletek: Pre, Suf, konkatenáció felbontásai, lezárt", () => {
  // #INT
  const nfa = regexToNfa(parse("a(aa)*b"));

  const allWords4 = [...shortlex(["a", "b"], 4)];
  const pre = allWords4.filter((u) => nfaAcceptsPrefix(nfa, u));
  assert.deepEqual(pre, ["", "a", "aa", "ab", "aaa", "aaaa", "aaab"]);

  const allWords3 = [...shortlex(["a", "b"], 3)];
  const suf = allWords3.filter((u) => nfaAcceptsSuffix(nfa, u));
  assert.deepEqual(suf, ["", "b", "ab", "aab"]);

  function inL3(u: string): boolean { return u === "a" || u === "ab"; }
  function inL4(u: string): boolean { return u === "bc" || u === "c"; }
  assert.deepEqual(concatSplits("abc", inL3, inL4), [1, 2]);
  assert.deepEqual(concatSplits("ac", inL3, inL4), [1]);
  assert.deepEqual(concatSplits("bc", inL3, inL4), []);

  function inL(u: string): boolean { return u === "a" || u === "bb"; }
  assert.ok(inKleeneStar("", inL));
  assert.ok(inKleeneStar("abba", inL));
  assert.ok(!inKleeneStar("aba", inL));
});
