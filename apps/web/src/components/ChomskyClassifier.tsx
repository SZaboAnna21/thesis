import { useState } from "react";
import { classifyGrammer, type ChomskyType, type Grammer, type Rule, type Rulechecked } from "@fotoc/automata-core";
import { GrammarInput } from "./InputGrammer";

const slideExample: Grammer = {
  nonterminals: ["S", "A", "B"],
  terminals: ["a", "b"],
  start: "S",
  rules: [
    { from: "S", to: "ASB" },
    { from: "S", to: "" },
    { from: "AB", to: "BA" },
    { from: "BA", to: "AB" },
    { from: "A", to: "a" },
    { from: "B", to: "b" },
  ],
};

const TYPES: ChomskyType[] = [0, 1, 2, 3];

const showRule = (rule: Rule) => `${rule.from} → ${rule.to || "ε"}`;
const showWord = (symbols: string[]) => symbols.join("") || "ε";

function contextHint(r: Rulechecked): string | undefined {
  if (r.needsKEScheck) return "S → ε: csak akkor 1-es, ha a KES teljesül.";
  if (!r.context) return undefined;
  const { u1, A, u2, v } = r.context;
  return `u₁ = ${showWord(u1)}, A = ${A}, u₂ = ${showWord(u2)}, v = ${showWord(v)}`;
}

function TypeCell({ rule, type }: { rule: Rulechecked; type: ChomskyType }) {
  if (!rule.types.includes(type)) {
    return <td className="px-4 py-3 text-gray-300 dark:text-slate-500 text-lg">–</td>;
  }
  const kes = type === 1 && rule.needsKEScheck;
  return (
    <td className="px-4 py-3 text-green-600 dark:text-green-400 text-lg font-bold" title={type === 1 ? contextHint(rule) : undefined}>
      {kes ? "✓•" : "✓"}
    </td>
  );
}

export function ChomskyClassifier() {
  const [grammer, setGrammer] = useState<Grammer>(slideExample);
  const result = classifyGrammer(grammer);

  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Chomsky-osztályozó</h2>
        <p className="mt-2 text-purple-100">
          Add meg a grammatikát, és nézd meg, hogy melyik Chomsky-típusba sorolhatók a szabályok.
        </p>

      <GrammarInput initial={slideExample} onChange={setGrammer} />

      {!result.ok && (
        <div className="rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 px-6 py-4 text-sm font-semibold text-red-600 dark:text-red-400">
          {result.message}
        </div>
      )}

      {result.ok && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30 px-8 py-6 shadow-md">
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">Eredmény</p>
            <p className="mt-2 text-2xl font-bold text-purple-900 dark:text-purple-100">
              A grammatika típusa: {result.types.map((t) => `𝒢${t}`).join(", ")}
            </p>
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">
              Ez a grammatika típusa, nem a nyelvé: ugyanazt a nyelvet egy szigorúbb típusú grammatika is generálhatja.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-purple-100 dark:border-purple-700">
              <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">Szabályok típusonként</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center font-mono">
                <thead>
                  <tr className="bg-purple-50 dark:bg-purple-900/20">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-700">Szabály</th>
                    {TYPES.map((t) => (
                      <th key={t} className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-slate-700">
                        𝒢{t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rules.map((r, i) => (
                    <tr key={i} className="border-t border-gray-100 dark:border-slate-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors">
                      <td className="px-6 py-3 text-left text-base text-gray-900 dark:text-slate-900">{showRule(r.rule)}</td>
                      {TYPES.map((t) => (
                        <TypeCell key={t} rule={r} type={t} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-6 py-3 text-xs text-gray-500 dark:text-slate-500 border-t border-gray-100 dark:border-slate-300">
              Az 1-es oszlop pipájára víve az egeret látszik a talált u₁ A u₂ → u₁ v u₂ felbontás. A • azt jelzi, hogy a szabály csak a KES teljesülése esetén 1-es.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 px-6 py-5 shadow-md">
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-3">Korlátozott ε-szabály (KES)</p>
            {!result.kes.hasStartEpsilon ? (
              <p className="text-base text-gray-700 dark:text-slate-700">
                Nincs {grammer.start} → ε szabály, a KES nem játszik szerepet.
              </p>
            ) : result.kes.violatingRules.length === 0 ? (
              <p className="text-base font-semibold text-green-700 dark:text-green-400">
                Van {grammer.start} → ε szabály, és {grammer.start} sehol nem áll jobb oldalon — a KES teljesül.
              </p>
            ) : (
              <p className="text-base font-semibold text-red-600 dark:text-red-400">
                A KES sérül: van {grammer.start} → ε szabály, de {grammer.start} jobb oldalon áll itt:{" "}
                <span className="font-mono">{result.kes.violatingRules.map(showRule).join(", ")}</span>. Ezért a grammatika nem 1-es típusú.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
