import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { parsePdaRules, wordchecker, type Pda } from "../src/verem.ts";
import { parseRegex, regexToNfa, nfaAccepts, regexMatches, shortlex } from "../src/language.ts";
import { runDfa, dfaToNfa, type Dfa } from "../src/dfa.ts";
import { determinize } from "../src/nfa.ts";
import { classifyGrammer, tokenize } from "../src/chomsky.ts";
import { isChomskyNormalForm, cyk, cykDerivation } from "../src/cyk.ts";
import { toNormalForm3Steps } from "../src/normalform3.ts";
import type { Grammer } from "../src/grammer.ts";

const LIMITS = { maxConfigs: 5000, maxStack: 50 };


describe("[INT] parsePdaRules → wordchecker", () => {
  function buildPda(rules: string, bottom: string, start: string, accepting: string[] = []): Pda {
    const parsed = parsePdaRules(rules);
    assert.deepEqual(parsed.errors, [], "a szabályszöveg nem értelmezhető");
    return { ...parsed, z0startsymbol: bottom, startState: start, accepting };
  }

  test("aⁿbⁿ: a parser hibamentes és a wordchecker helyesen fogad el/utasít el", () => {
    const rules =
      "# q0 a -> # a q0\n" +
      "a q0 a -> a a q0\n" +
      "a q0 b -> q1\n" +
      "a q1 b -> q1\n" +
      "# q1 -> q1";
    

    const pda = buildPda(rules, "#", "q0", []);
    const goodWords = ["ab", "aabb", "aaabbb"];
    for (let i = 0; i < goodWords.length; i++) {
      const word = goodWords[i];
      const result = wordchecker(pda, word, "empty-stack", LIMITS);
      assert.equal(result, "accepted", word);
    }

    const badWords = ["a", "b", "aab", "abb", "ba"];
    for (let i = 0; i < badWords.length; i++) {
      const word = badWords[i];
      const result = wordchecker(pda, word, "empty-stack", LIMITS);
      assert.equal(result, "rejected", word);
    }
  });

test("wcwᴿ: végállapottal elfogadó PDA", function () {

    const rules =
      "# q0 a -> # a q1\n" +
      "# q0 b -> # b q1\n" +
      "a q1 a -> a a q1\n" +
      "a q1 b -> a b q1\n" +
      "b q1 a -> b a q1\n" +
      "b q1 b -> b b q1\n" +
      "a q1 c -> a q2\n" +
      "b q1 c -> b q2\n" +
      "a q2 a -> q2\n" +
      "b q2 b -> q2\n" +
      "# q2 -> # q3";

    const pda = buildPda(rules, "#", "q0", ["q3"]);

    const result1 = wordchecker(pda, "abcba", "final-state", LIMITS);
    assert.equal(result1, "accepted");

    const result2 = wordchecker(pda, "aacaa", "final-state", LIMITS);
    assert.equal(result2, "accepted");

    const result3 = wordchecker(pda, "abcab", "final-state", LIMITS);
    assert.equal(result3, "rejected");

    const result4 = wordchecker(pda, "abc", "final-state", LIMITS);
    assert.equal(result4, "rejected");
  });

  test("hibás szabálysor: a parser jelzi a hibát", () => {
    const wrongtext = "ez nem szabaly\nez sem";
    const parsed = parsePdaRules(wrongtext);

    const hasError = parsed.errors.length > 0;
    assert.ok(hasError, "kellett volna hibajelzés");  });
});

describe("[INT] parseRegex → regexToNfa → nfaAccepts", () => {

  function nfaFromStr(source: string) {
    const result = parseRegex(source);
    if (!result.ok) {
      throw new Error("'" + source + "' nem értelmezhető");
    }
    const nfa = regexToNfa(result.regex);
    return nfa;
  }

  test("(a+b)*ab: az NFA pontosan az ab-re végzőket fogadja el", () => {
    const nfa = nfaFromStr("(a+b)*ab");

    const goodWords = ["ab", "aab", "bab", "ababab"];
    for (let i = 0; i < goodWords.length; i++) {
      const word = goodWords[i];
      const accepted = nfaAccepts(nfa, word);
      assert.ok(accepted, word);
    }

    const badWords = ["", "a", "b", "ba", "aba"];
    for (let i = 0; i < badWords.length; i++) {
      const word = badWords[i];
      const accepted = nfaAccepts(nfa, word);
      assert.ok(accepted === false, word);
    }
  });

  test("a*ba*: az NFA pontosan a pontosan egy b-t tartalmazókat fogadja el", () => {
    const nfa = nfaFromStr("a*ba*");
    const allWords = shortlex(["a", "b"], 5);
    for (const word of allWords) {
      let bCount = 0;
      for (let i = 0; i < word.length; i++) {
        if (word[i] === "b") {
          bCount = bCount + 1;
        }
      }

      let expected = false;
      if (bCount === 1) {
        expected = true;
      }

      const accepted = nfaAccepts(nfa, word);
      assert.equal(accepted, expected, word);
    }
  });


  test("regexToNfa konzisztens a regexMatches-szel n hosszig", function () {

    const result = parseRegex("(aa)*b");
    if (!result.ok) {
      throw new Error("'(aa)*b' nem értelmezhető");
    }
    const regex = result.regex;
    const nfa = regexToNfa(regex);
    const allWords = shortlex(["a", "b"], 6);

    for (const word of allWords) {
      const nfaAnswer = nfaAccepts(nfa, word);
      const regexAnswer = regexMatches(regex, word);
      assert.equal(nfaAnswer, regexAnswer, word);
    }
  });
});

// ============================================================
// 2. típus: több transzformációs lépés egymás után
//    Az átalakítás ekvivalenciájának ellenőrzése
// ============================================================

describe("[INT] DFA → dfaToNfa → determinize: körmenet megőrzi a nyelvet", () => {
  const evenA: Dfa = {
    states: ["even", "odd"],
    alphabet: ["a", "b"],
    transitions: { even: { a: "odd", b: "even" }, odd: { a: "even", b: "odd" } },
    start: "even",
    accepting: ["even"],
  };

test("minden szóra ugyanolyan az elfogadás mint az eredeti DVA-ban", function () {

    const nfa = dfaToNfa(evenA);
    const steps = determinize(nfa);

    function findRow(key: string) {
      for (let i = 0; i < steps.length; i++) {
        const row = steps[i].row;
        const rowKey = row.set.join(",");
        if (rowKey === key) {
          return row;
        }
      }
      throw new Error("Nincs ilyen sor a táblázatban: " + key);
    }
    const allWords = shortlex(["a", "b"], 5);
    for (const word of allWords) {
      const originalAnswer = runDfa(evenA, word).accepted;
      let currentRow = steps[0].row;

      for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        const nextSet = currentRow.next[letter];
        const nextKey = nextSet.join(",");
        currentRow = findRow(nextKey);
      }
      const newAnswer = currentRow.isAccepting;
      assert.equal(newAnswer, originalAnswer, word);
    }
  });
});

describe("[INT] Grammar → classifyGrammer → isChomskyNormalForm → cyk", () => {
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

  
  test("besorolás → CNF-ellenőrzés → CYK: háromfázisú pipeline konzisztens", function () {

    const cls = classifyGrammer(anbn);
    if (!cls.ok) {
      throw new Error("a grammatika osztályozása sikertelen");
    }

    let hasType2 = false;
    for (let i = 0; i < cls.types.length; i++) {
      if (cls.types[i] === 2) {
        hasType2 = true;
      }
    }
    assert.ok(hasType2, "várt 2-es típus, kapott: " + cls.types.join(", "));

    const cnfResult = isChomskyNormalForm(anbn);
    assert.deepEqual(cnfResult, { ok: true });

    const goodWords = ["ab", "aabb", "aaabbb"];
    for (let i = 0; i < goodWords.length; i++) {
      const word = goodWords[i];
      const result = cyk(anbn, word);
      if (!result.ok) {
        throw new Error("a CYK hibát adott erre: " + word);
      }
      assert.equal(result.accepted, true, "elfogadás: " + word);
    }

    const badWords = ["", "a", "b", "aab", "abb"];
    for (let i = 0; i < badWords.length; i++) {
      const word = badWords[i];
      const result = cyk(anbn, word);
      if (!result.ok) {
        throw new Error("a CYK hibát adott erre: " + word);
      }
      assert.equal(result.accepted, false, "elutasítás: " + word);
    }
  });
});


describe("[INT] cyk → cykDerivation: a levezetés minden lépése érvényes szabályalkalmazás", () => {
  const g: Grammer = {
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

  function isValidStep(from: string, to: string): boolean {
    for (const rule of g.rules) {
      const pos = from.indexOf(rule.from);
      if (pos === -1) continue;
      if (from.slice(0, pos) + rule.to + from.slice(pos + rule.from.length) === to) return true;
    }
    return false;
  }

  for (const word of ["a", "ab"]) {
    test(`"${word}": a levezetés S-sel kezd, a szóval végez, minden lépés érvényes`, () => {
      const r = cyk(g, word);
      assert.ok(r.ok);
      if (!r.ok) return;

      const d = cykDerivation(g, word, r.table);
      assert.ok(d !== null && d.length >= 2);
      assert.equal(d![0], g.start);
      assert.equal(d![d!.length - 1], word);

      for (let i = 0; i < d!.length - 1; i++) {
        assert.ok(isValidStep(d![i], d![i + 1]), `${d![i]} → ${d![i + 1]} nem érvényes lépés`);
      }
    });
  }
});

describe("[INT] Grammar → toNormalForm3Steps: a végeredmény ekvivalens az eredetivel", () => {
  function wordsUpTo(g: Grammer, maxLen: number): string[] {
    const result = new Set<string>();
    const seen = new Set<string>();
    const queue: [string, string][] = [["", g.start]];
    while (queue.length > 0) {
      const [prefix, A] = queue.shift()!;
      for (const rule of g.rules) {
        if (rule.from !== A) continue;
        const to = tokenize(g, rule.to)!;
        const last = to[to.length - 1];
        const nt = last !== undefined && g.nonterminals.includes(last) ? last : null;
        const next = prefix + (nt ? to.slice(0, -1) : to).join("");
        if (next.length > maxLen) continue;
        if (nt === null) {
          result.add(next);
        } else if (!seen.has(`${next}|${nt}`)) {
          seen.add(`${next}|${nt}`);
          queue.push([next, nt]);
        }
      }
    }
    return [...result].sort();
  }

  const cases: [string, Grammer][] = [
    ["egyszerű", {
      nonterminals: ["S", "B", "V"],
      terminals: ["a", "b"],
      rules: [
        { from: "S", to: "abS" }, { from: "S", to: "B" },
        { from: "B", to: "bB" }, { from: "B", to: "V" },
        { from: "V", to: "aa" }, { from: "V", to: "b" },
      ],
      start: "S",
    }],
    ["láncciklus", {
      nonterminals: ["S", "A", "B"],
      terminals: ["a", "b"],
      rules: [
        { from: "S", to: "A" }, { from: "A", to: "B" }, { from: "B", to: "S" },
        { from: "S", to: "ab" }, { from: "A", to: "bA" }, { from: "B", to: "" },
      ],
      start: "S",
    }],
  ];

  for (const [name, g] of cases) {
    test(`${name}: a toNormalForm3Steps kimenetének nyelve megegyezik az eredetivel`, () => {
      const result = toNormalForm3Steps(g);
      assert.ok(result.ok, result.ok ? "" : result.message);
      if (!result.ok) return;

      const last = result.steps[result.steps.length - 1].grammar;
      assert.deepEqual(wordsUpTo(last, 7), wordsUpTo(g, 7));
    });
  }
});
