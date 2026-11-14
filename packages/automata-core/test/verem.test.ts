import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { EPS } from "../src/nfa.ts";
import {
  acceptingPath,
  applyMove,
  bestPath,
  configKey,
  epsilonClosure,
  findPdaCounterexample,
  isDeterministic,
  parsePdaRules,
  runningPda,
  startConfig,
  wordchecker,
  type Pda,
} from "../src/verem.ts";

const LIMITS = { maxConfigs: 5000, maxStack: 50 };

function pdaFrom(rules: string, bottom: string, start: string, accepting: string[] = []): Pda {
  const parsed = parsePdaRules(rules);
  assert.deepEqual(parsed.errors, []);
  return {
    Zsymbols: parsed.Zsymbols,
    Qstates: parsed.Qstates,
    inputSymbols: parsed.inputSymbols,
    transitions: parsed.transitions,
    z0startsymbol: bottom,
    startState: start,
    accepting,
  };
}

const anbn = pdaFrom(
  `# q0 a -> # a q0
   a q0 a -> a a q0
   a q0 b -> q1
   a q1 b -> q1
   # q1 -> q1`,
  "#",
  "q0",
);

const wcwr = pdaFrom(
  `# q0 a -> # a q1
   # q0 b -> # b q1
   a q1 a -> a a q1
   a q1 b -> a b q1
   b q1 a -> b a q1
   b q1 b -> b b q1
   a q1 c -> a q2
   b q1 c -> b q2
   a q2 a -> q2
   b q2 b -> q2
   # q2 -> # q3`,
  "#",
  "q0",
  ["q3"],
);

const wwr = pdaFrom(
  `# q0 a -> # a q1
   # q0 b -> # b q1
   a q1 a -> a a q1
   a q1 b -> a b q1
   b q1 a -> b a q1
   b q1 b -> b b q1
   a q1 -> a q2
   b q1 -> b q2
   a q2 a -> q2
   b q2 b -> q2
   # q2 -> # q3`,
  "#",
  "q0",
  ["q3"],
);

const pumpForever = pdaFrom(`# q -> # # q`, "#", "q", ["f"]);

const isAnbn = (w: string) => /^(a+)(b+)$/.test(w) && w.indexOf("b") * 2 === w.length;
const reverse = (w: string) => [...w].reverse().join("");

describe("parsePdaRules", () => {
  test("betűs és ε-szabályt is felismer", () => {
    const { transitions } = parsePdaRules("# q0 a -> # a q0\n# q1 -> q1");
    assert.deepEqual(transitions["#"]["q0"]["a"], [{ push: ["#", "a"], next: "q0" }]);
    assert.deepEqual(transitions["#"]["q1"][EPS], [{ push: [], next: "q1" }]);
  });

  test("a → nyíl és a jobb oldali ε is jó", () => {
    const { transitions, errors } = parsePdaRules("a q b → ε q");
    assert.deepEqual(errors, []);
    assert.deepEqual(transitions["a"]["q"]["b"], [{ push: [], next: "q" }]);
  });

  test("összegyűjti a szimbólumokat és az állapotokat", () => {
    assert.deepEqual(anbn.Zsymbols, ["#", "a"]);
    assert.deepEqual(anbn.Qstates, ["q0", "q1"]);
    assert.deepEqual(anbn.inputSymbols, ["a", "b"]);
  });

  test("ugyanarra a bal oldalra több szabály is lehet", () => {
    const { transitions } = parsePdaRules("a q a -> a a q\na q a -> q");
    assert.equal(transitions["a"]["q"]["a"].length, 2);
  });

  test("a hibás sorokat sorszámmal jelzi, a jókat megtartja", () => {
    const { transitions, errors } = parsePdaRules("# q a -> # q\n\nrossz sor\n# q a b c -> q\n# q ->");
    assert.deepEqual(
      errors.map((e) => e.line),
      [3, 4, 5],
    );
    assert.equal(transitions["#"]["q"]["a"].length, 1);
  });
});

describe("konfigurációk", () => {
  test("a kezdőkonfigurációban csak z0 van a veremben", () => {
    const c = startConfig(anbn);
    assert.deepEqual(c.stack, ["#"]);
    assert.equal(c.state, "q0");
    assert.equal(c.from, null);
  });

  test("applyMove a verem tetejét cseréli le", () => {
    const c = { stack: ["#", "a"], state: "q", from: null, letter: null, move: null };
    assert.deepEqual(applyMove(c, "a", { push: ["a", "b"], next: "p" }).stack, ["#", "a", "b"]);
    assert.deepEqual(applyMove(c, "b", { push: [], next: "p" }).stack, ["#"]);
  });

  test("configKey az állapotot és a vermet is figyelembe veszi", () => {
    const c = { stack: ["#", "a"], state: "q", from: null, letter: null, move: null };
    assert.notEqual(configKey(c), configKey({ ...c, state: "p" }));
    assert.notEqual(configKey(c), configKey({ ...c, stack: ["#"] }));
  });
});

describe("epsilonClosure", () => {
  test("végigköveti az ε-lépéseket", () => {
    const pda = pdaFrom("# p -> # a q\na q -> r", "#", "p");
    const { configs, truncated } = epsilonClosure(pda, [startConfig(pda)], LIMITS);
    assert.deepEqual(configs.map(configKey).sort(), ["p|#", "q|# a", "r|#"]);
    assert.equal(truncated, false);
  });

  test("ε-körnél nem akad el", () => {
    const pda = pdaFrom("# p -> # q\n# q -> # p", "#", "p");
    const { configs, truncated } = epsilonClosure(pda, [startConfig(pda)], LIMITS);
    assert.equal(configs.length, 2);
    assert.equal(truncated, false);
  });

  test("végtelen veremnövelésnél levág és jelzi", () => {
    const { configs, truncated } = epsilonClosure(pumpForever, [startConfig(pumpForever)], LIMITS);
    assert.equal(truncated, true);
    assert.ok(configs.every((c) => c.stack.length <= LIMITS.maxStack));
  });
});

describe("wordchecker", () => {
  test("aⁿbⁿ üres veremmel, 8 hosszig minden szóra", () => {
    const result = findPdaCounterexample(anbn, "empty-stack", ["a", "b"], isAnbn, 8, LIMITS);
    assert.equal(result.counterexample, null);
    assert.equal(result.undecided, 0);
  });

  test("ha kiürül a verem, de marad input, elutasít", () => {
    assert.equal(wordchecker(anbn, "aabb", "empty-stack", LIMITS), "accepted");
    assert.equal(wordchecker(anbn, "aabbb", "empty-stack", LIMITS), "rejected");
  });

  test("wcwᴿ végállapottal", () => {
    const inL = (w: string) => {
      const [u, v, ...rest] = w.split("c");
      return rest.length === 0 && v !== undefined && u.length > 0 && v === reverse(u);
    };
    const result = findPdaCounterexample(wcwr, "final-state", ["a", "b", "c"], inL, 7, LIMITS);
    assert.equal(result.counterexample, null);
  });

  test("wwᴿ: a nemdeterminisztikus tipp is működik", () => {
    const inL = (w: string) => w.length > 0 && w.length % 2 === 0 && w === reverse(w);
    const result = findPdaCounterexample(wwr, "final-state", ["a", "b"], inL, 8, LIMITS);
    assert.equal(result.counterexample, null);
  });

  test("a két elfogadási mód eltérhet", () => {
    assert.equal(wordchecker(wcwr, "aca", "final-state", LIMITS), "accepted");
    assert.equal(wordchecker(wcwr, "aca", "empty-stack", LIMITS), "rejected");
  });

  test("ε-szó: a kezdő ε-lépések is számítanak", () => {
    const pda = pdaFrom("# q -> f", "#", "q", ["f"]);
    assert.equal(wordchecker(pda, "", "final-state", LIMITS), "accepted");
    assert.equal(wordchecker(pda, "", "empty-stack", LIMITS), "accepted");
  });

  test("levágás után, ha nincs elfogadó futás, unknown", () => {
    assert.equal(wordchecker(pumpForever, "", "final-state", LIMITS), "unknown");
  });
});

describe("runningPda és utak", () => {


  test("acceptingPath a kezdőkonfigurációtól az elfogadóig vezet", () => {
    const path = acceptingPath(anbn, runningPda(anbn, "aabb", LIMITS), "empty-stack");
    assert.ok(path);
    assert.ok(path !== null);
    assert.equal(path[0].state, "q0"); 
      
  });

  test("elutasított szóra acceptingPath null", () => {
    assert.equal(acceptingPath(anbn, runningPda(anbn, "abab", LIMITS), "empty-stack"), null);
  });

  test("bestPath az utolsó nem üres lépésig jut", () => {
    const path = bestPath(runningPda(anbn, "abab", LIMITS));
    
    assert.ok(path !== null);
    assert.equal(path[0].state, "q0");
  });
});

describe("isDeterministic", () => {
  test("wcwᴿ determinisztikus", () => {
    assert.equal(isDeterministic(wcwr), true);
  });

  test("wwᴿ nem, mert a q1-ben ε- és betűs lépés is van", () => {
    assert.equal(isDeterministic(wwr), false);
  });

  test("két szabály ugyanarra a hármasra nem determinisztikus", () => {
    assert.equal(isDeterministic(pdaFrom("a q a -> a a q\na q a -> q", "a", "q")), false);
  });
});

describe("findPdaCounterexample", () => {
  test("a legrövidebb eltérő szót adja vissza", () => {
    const result = findPdaCounterexample(anbn, "empty-stack", ["a", "b"], (w) => w === "" || isAnbn(w), 6, LIMITS);
    assert.deepEqual(result.counterexample, { word: "", expected: true, result: "rejected" });
    assert.equal(result.checked, 1);
  });

  test("az eldönthetetlen szavakat külön számolja", () => {
    const result = findPdaCounterexample(pumpForever, "final-state", ["a"], () => false, 3, LIMITS);
    assert.equal(result.counterexample, null);
    assert.equal(result.undecided, 4);
    assert.equal(result.checked, 4);
  });
});
