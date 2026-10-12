import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { chainLayers, lengthReduction, removeChains, toNormalForm3Steps, type Nf3Phase, type Nf3Step } from "../src/normalform3.ts";
import { tokenize } from "../src/chomsky.ts";
import type { Grammer } from "../src/grammer.ts";

function grammar(rules: string[], nonterminals: string[], terminals = ["a", "b", "c"]): Grammer {
  return {
    nonterminals,
    terminals,
    start: "S",
    rules: rules.map((rule) => {
      const [from, to] = rule.split("->");
      return { from, to };
    }),
  };
}

const ruleSet = (g: Grammer) => g.rules.map((r) => `${r.from}->${r.to}`).sort();

// Jobblineáris grammatika összes legfeljebb maxLen hosszú szava.
function words(g: Grammer, maxLen: number): string[] {
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

// Hosszredukció után minden szabály X → aY, X → Y vagy X → ε.
function assertShort(g: Grammer) {
  for (const rule of g.rules) {
    const to = tokenize(g, rule.to);
    assert.ok(to !== null, `${rule.from} -> ${rule.to}: ismeretlen szimbólum (felvetted az új nemterminálist?)`);
    const ok =
      to.length === 0 ||
      (to.length === 1 && g.nonterminals.includes(to[0])) ||
      (to.length === 2 && g.terminals.includes(to[0]) && g.nonterminals.includes(to[1]));
    assert.ok(ok, `${rule.from} -> ${rule.to} még nem rövid`);
  }
}

const lectureExample = grammar(["S->abS", "S->B", "B->bB", "B->V", "V->aa", "V->b"], ["S", "B", "V"]);

describe("lengthReduction", () => {
  test("a jegyzet példája", () => {
    const out = lengthReduction(lectureExample);
    assert.deepEqual(
      ruleSet(out),
      ["S->aZ1", "Z1->bS", "S->B", "B->bB", "B->V", "V->aZ2", "Z2->aE", "V->bE", "E->"].sort(),
    );
    assert.deepEqual([...out.nonterminals].sort(), ["B", "E", "S", "V", "Z1", "Z2"]);
  });

  test("a rövid szabályokhoz nem nyúl", () => {
    const g = grammar(["S->aS", "S->A", "A->bA", "A->"], ["S", "A"]);
    assert.deepEqual(ruleSet(lengthReduction(g)), ruleSet(g));
  });

  test("E-ből csak egy kell", () => {
    const out = lengthReduction(grammar(["S->a", "S->bb", "S->cS"], ["S"]));
    assert.equal(out.rules.filter((r) => r.to === "").length, 1);
  });

  test("foglalt nevek mellé újat választ", () => {
    const g = grammar(["S->abE", "E->Z1", "Z1->a"], ["S", "E", "Z1"]);
    const out = lengthReduction(g);
    assertShort(out);
    assert.deepEqual(words(out, 6), words(g, 6));
  });

  const cases: [string, Grammer][] = [
    ["jegyzet", lectureExample],
    ["S -> ε és egybetűs zárás", grammar(["S->", "S->a", "S->bS", "S->cA", "A->c"], ["S", "A"])],
    ["hosszú, nemterminális nélkül", grammar(["S->abcabc", "S->aaB", "B->bbbS", "B->c"], ["S", "B"])],
  ];
  for (const [name, g] of cases) {
    test(`${name}: csak rövid szabályok, és a nyelv nem változik`, () => {
      const out = lengthReduction(g);
      assertShort(out);
      assert.deepEqual(words(out, 7), words(g, 7));
    });
  }
});

// A rétegeken belül a sorrend mindegy, ezért rendezve hasonlítunk.
const sortedLayers = (layers: string[][]) => layers.map((layer) => [...layer].sort());

describe("chainLayers", () => {
  const reduced = lengthReduction(lectureExample);

  test("a jegyzet példája: H(S)", () => {
    assert.deepEqual(sortedLayers(chainLayers(reduced, "S")), [["S"], ["B", "S"], ["B", "S", "V"]]);
  });

  test("a jegyzet példája: H(B)", () => {
    assert.deepEqual(sortedLayers(chainLayers(reduced, "B")), [["B"], ["B", "V"]]);
  });

  test("ahonnan nem indul láncszabály, ott H(A) = {A}", () => {
    assert.deepEqual(chainLayers(reduced, "V"), [["V"]]);
    assert.deepEqual(chainLayers(reduced, "Z1"), [["Z1"]]);
  });

  test("az X → aY nem láncszabály", () => {
    const g = grammar(["S->aA", "A->B", "B->"], ["S", "A", "B"]);
    assert.deepEqual(chainLayers(g, "S"), [["S"]]);
  });

  test("láncciklus: megáll, és mindenki benne van", () => {
    const g = grammar(["S->A", "A->B", "B->S", "B->a"], ["S", "A", "B"]);
    assert.deepEqual(sortedLayers(chainLayers(g, "S")), [["S"], ["A", "S"], ["A", "B", "S"]]);
    assert.deepEqual(sortedLayers(chainLayers(g, "B")), [["B"], ["B", "S"], ["A", "B", "S"]]);
  });

  test("egy rétegben több új is jöhet", () => {
    const g = grammar(["S->A", "S->B", "A->C", "C->c"], ["S", "A", "B", "C"]);
    assert.deepEqual(sortedLayers(chainLayers(g, "S")), [["S"], ["A", "B", "S"], ["A", "B", "C", "S"]]);
  });

  test("A → A nem ad új réteget", () => {
    const g = grammar(["S->S", "S->a"], ["S"]);
    assert.deepEqual(chainLayers(g, "S"), [["S"]]);
  });
});

// 3-as normálforma: minden szabály X → aY vagy X → ε.
function assertNormalForm(g: Grammer) {
  for (const rule of g.rules) {
    const to = tokenize(g, rule.to)!;
    const ok =
      to.length === 0 ||
      (to.length === 2 && g.terminals.includes(to[0]) && g.nonterminals.includes(to[1]));
    assert.ok(ok, `${rule.from} -> ${rule.to} nem normálformájú`);
  }
}

describe("removeChains", () => {
  test("a jegyzet példája: pontosan a várt szabályok", () => {
    const out = removeChains(lengthReduction(lectureExample));
    assert.deepEqual(
      ruleSet(out),
      [
        "S->aZ1", "S->bB", "S->aZ2", "S->bE",
        "B->bB", "B->aZ2", "B->bE",
        "V->aZ2", "V->bE",
        "Z1->bS", "Z2->aE", "E->",
      ].sort(),
    );
  });

  test("a láncszabályok eltűnnek (vizsgacsapda!)", () => {
    const out = removeChains(lengthReduction(lectureExample));
    assert.ok(!out.rules.some((r) => r.from === "S" && r.to === "B"), "S -> B bennmaradt");
    assert.ok(!out.rules.some((r) => r.from === "B" && r.to === "V"), "B -> V bennmaradt");
  });

  test("nincs duplikált szabály", () => {
    // S és A is eléri B-t, és S-nek már eleve van S -> bB szabálya
    const g = grammar(["S->A", "S->bB", "A->B", "B->bB", "B->"], ["S", "A", "B"]);
    const out = removeChains(g);
    assert.equal(new Set(ruleSet(out)).size, out.rules.length);
  });

  test("láncmentes grammatikán nem változtat", () => {
    const g = grammar(["S->aS", "S->bA", "A->"], ["S", "A"]);
    assert.deepEqual(ruleSet(removeChains(g)), ruleSet(g));
  });

  test("az ε-szabályt is örökli", () => {
    const g = grammar(["S->A", "A->", "A->aA"], ["S", "A"]);
    assert.deepEqual(ruleSet(removeChains(g)), ["A->", "A->aA", "S->", "S->aA"]);
  });

  const cases: [string, Grammer][] = [
    ["jegyzet", lectureExample],
    ["láncciklus", grammar(["S->A", "A->B", "B->S", "S->ab", "A->bA", "B->"], ["S", "A", "B"])],
    ["S -> ε és egybetűs zárás", grammar(["S->", "S->a", "S->bS", "S->cA", "A->c"], ["S", "A"])],
    ["hosszú, nemterminális nélkül", grammar(["S->abcabc", "S->aaB", "B->bbbS", "B->c"], ["S", "B"])],
    ["foglalt nevek", grammar(["S->abE", "E->Z1", "Z1->a"], ["S", "E", "Z1"])],
  ];
  for (const [name, g] of cases) {
    test(`${name}: hosszredukció + láncmentesítés = normálforma, a nyelv nem változik`, () => {
      const out = removeChains(lengthReduction(g));
      assertNormalForm(out);
      assert.deepEqual(words(out, 7), words(g, 7));
    });
  }
});

const PHASE_ORDER: Nf3Phase[] = ["input", "length", "chain-closure", "chain-inherit", "chain-remove", "unreachable", "done"];

function stepsOf(g: Grammer): Nf3Step[] {
  const result = toNormalForm3Steps(g);
  assert.ok(result.ok, result.ok ? "" : result.message);
  return result.steps;
}

describe("toNormalForm3Steps", () => {
  test("nem 3-as típusú grammatikára hibát ad", () => {
    const result = toNormalForm3Steps(grammar(["S->aSb", "S->"], ["S"]));
    assert.equal(result.ok, false);
  });

  test("ismeretlen szimbólumra hibát ad", () => {
    const result = toNormalForm3Steps(grammar(["S->aX"], ["S"]));
    assert.equal(result.ok, false);
  });

  test("az első lépés a kiinduló, az utolsó a kész grammatika", () => {
    const steps = stepsOf(lectureExample);
    assert.equal(steps[0].phase, "input");
    assert.deepEqual(ruleSet(steps[0].grammar), ruleSet(lectureExample));
    assert.equal(steps[steps.length - 1].phase, "done");
    assert.deepEqual(
      ruleSet(steps[steps.length - 1].grammar),
      ruleSet(removeChains(lengthReduction(lectureExample))),
    );
  });

  test("a fázisok jó sorrendben jönnek", () => {
    const phases = stepsOf(lectureExample).map((s) => s.phase);
    for (let i = 1; i < phases.length; i++) {
      assert.ok(
        PHASE_ORDER.indexOf(phases[i - 1]) <= PHASE_ORDER.indexOf(phases[i]),
        `${phases[i - 1]} után nem jöhet ${phases[i]}`,
      );
    }
    for (const phase of ["length", "chain-closure", "chain-remove"] as Nf3Phase[]) {
      assert.ok(phases.includes(phase), `hiányzik: ${phase}`);
    }
  });

  test("minden lépésnek van címe és magyarázata", () => {
    for (const step of stepsOf(lectureExample)) {
      assert.ok(step.title.length > 0, `${step.phase}: üres cím`);
      assert.ok(step.explanation.length > 0, `${step.title}: üres magyarázat`);
    }
  });

  test("minden lépés az előzőből jön: removed ki, added be", () => {
    const steps = stepsOf(lectureExample);
    for (let i = 1; i < steps.length; i++) {
      const prev = new Set(ruleSet(steps[i - 1].grammar));
      for (const r of steps[i].removed) prev.delete(`${r.from}->${r.to}`);
      for (const r of steps[i].added) prev.add(`${r.from}->${r.to}`);
      assert.deepEqual([...prev].sort(), ruleSet(steps[i].grammar), steps[i].title);
    }
  });

  test("a H(A) lépések megkapják a rétegeket", () => {
    const closure = stepsOf(lectureExample).filter((s) => s.phase === "chain-closure");
    const withS = closure.find((s) => s.chainSets?.["S"]);
    assert.ok(withS, "egyik chain-closure lépésben sincs chainSets.S");
    assert.deepEqual(sortedLayers(withS.chainSets!["S"]), [["S"], ["B", "S"], ["B", "S", "V"]]);
  });

  test("láncmentes grammatikán is végigmegy", () => {
    const steps = stepsOf(grammar(["S->aS", "S->bA", "A->"], ["S", "A"]));
    assert.equal(steps[0].phase, "input");
    assert.equal(steps[steps.length - 1].phase, "done");
  });
});
