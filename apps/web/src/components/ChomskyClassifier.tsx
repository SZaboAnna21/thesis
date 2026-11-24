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
    <div className="relative left-1/2 -translate-x-1/2 w-[min(100vw,80rem)] px-4 sm:px-6">
      <p className="mb-6 text-muted-foreground">Adj meg egy nyelvtant, majd checkold hogy melyik Chomsky-osztályba (0–3) tartozik, szabályonként kiértékelve!</p>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

        <div className="lg:w-[36rem] lg:shrink-0 space-y-6">
          <GrammarInput initial={slideExample} onChange={setGrammer} />

          {result.ok && (
            <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 px-6 py-5 shadow-md">
              <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-3">Korl&#225;tozott &#949;-szab&#225;ly (KES)</p>
              {!result.kes.hasStartEpsilon ? (
                <p className="text-base text-gray-700 dark:text-slate-700">
                  Nincs {grammer.start} &#8594; &#949; szab&#225;ly, a KES nem j&#225;tszik szerepet.
                </p>
              ) : result.kes.violatingRules.length === 0 ? (
                <p className="text-base font-semibold text-green-700 dark:text-green-400">
                  Van {grammer.start} &#8594; &#949; szab&#225;ly, &#233;s {grammer.start} sehol nem &#225;ll jobb oldalon &#8212; a KES teljes&#252;l.
                </p>
              ) : (
                <p className="text-base font-semibold text-red-600 dark:text-red-400">
                  A KES s&#233;r&#252;l: van {grammer.start} &#8594; &#949; szab&#225;ly, de {grammer.start} jobb oldalon &#225;ll itt:{" "}
                  <span className="font-mono">{result.kes.violatingRules.map(showRule).join(", ")}</span>. Ez&#233;rt a grammatika nem 1-es t&#237;pus&#250;.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          {!result.ok && (
            <div className="rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 px-6 py-4 text-sm font-semibold text-red-600 dark:text-red-400">
              {result.message}
            </div>
          )}

          {result.ok && (
            <>
              <div className="rounded-2xl border border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30 px-8 py-6 shadow-md">
                <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">Eredm&#233;ny</p>
                <p className="mt-2 text-2xl font-bold text-purple-900 dark:text-purple-100">
                  A grammatika t&#237;pusa: {result.types.map((t) => `𝒢${t}`).join(", ")}
                </p>
                <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">
                  Ez a grammatika t&#237;pusa, nem a nyelv&#233;: ugyanazt a nyelvet egy szigor&#250;bb t&#237;pus&#250; grammatika is gener&#225;lhatja.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-purple-100 dark:border-purple-700">
                  <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">Szab&#225;lyok t&#237;pusonk&#233;nt</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-center font-mono">
                    <thead>
                      <tr className="bg-purple-50 dark:bg-purple-900/20">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-700">Szab&#225;ly</th>
                        {TYPES.map((t) => (
                          <th key={t} className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-slate-700">
                            &#120022;{t}
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
                  Az 1-es oszlop pip&#225;j&#225;ra v&#237;ve az egeret l&#225;tszik a tal&#225;lt u&#8321; A u&#8322; &#8594; u&#8321; v u&#8322; felbont&#225;s. A &#8226; azt jelzi, hogy a szab&#225;ly csak a KES teljes&#252;l&#233;se eset&#233;n 1-es.
                </p>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

