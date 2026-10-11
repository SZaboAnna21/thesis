import { useState } from "react";
import { classifyGrammer, type ChomskyType, type Grammer, type Rule, type Rulechecked } from "@fotoc/automata-core";
import { GrammarInput } from "./InputGrammer";

// A diák besorolási példája: minden esetet megmutat (0-s szabály, ✓•, KES-sértés).
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

// Az 1-es típus indoklása: a talált u1 A u2 → u1 v u2 felbontás.
function contextHint(r: Rulechecked): string | undefined {
  if (r.needsKEScheck) return "S → ε: csak akkor 1-es, ha a KES teljesül.";
  if (!r.context) return undefined;
  const { u1, A, u2, v } = r.context;
  return `u₁ = ${showWord(u1)}, A = ${A}, u₂ = ${showWord(u2)}, v = ${showWord(v)}`;
}

function TypeCell({ rule, type }: { rule: Rulechecked; type: ChomskyType }) {
  if (!rule.types.includes(type)) {
    return <td className="p-2 text-gray-400">–</td>;
  }
  const kes = type === 1 && rule.needsKEScheck;
  return (
    <td className="p-2 text-green-700" title={type === 1 ? contextHint(rule) : undefined}>
      {kes ? "✓•" : "✓"}
    </td>
  );
}

export function ChomskyClassifier() {
  const [grammer, setGrammer] = useState<Grammer>(slideExample);
  const result = classifyGrammer(grammer);

  return (
    <div className="space-y-4">
      <GrammarInput initial={slideExample} onChange={setGrammer} />

      {!result.ok && <p className="text-sm text-red-600">{result.message}</p>}

      {result.ok && (
        <>
          <div className="rounded border p-3">
            <table className="w-full text-center font-mono">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left">Szabály</th>
                  {TYPES.map((t) => (
                    <th key={t} className="p-2">
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rules.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 text-left">{showRule(r.rule)}</td>
                    {TYPES.map((t) => (
                      <TypeCell key={t} rule={r} type={t} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-gray-500">
              Az 1-es oszlop pipájára víve az egeret látszik a talált u₁ A u₂ → u₁ v u₂ felbontás. A • azt jelzi,
              hogy a szabály csak a KES teljesülése esetén 1-es.
            </p>
          </div>

          <div className="rounded border p-3 text-sm">
            <h3 className="font-semibold text-gray-600">Korlátozott ε-szabály (KES)</h3>
            {!result.kes.hasStartEpsilon ? (
              <p>Nincs {grammer.start} → ε szabály, a KES nem játszik szerepet.</p>
            ) : result.kes.violatingRules.length === 0 ? (
              <p className="text-green-700">
                Van {grammer.start} → ε szabály, és {grammer.start} sehol nem áll jobb oldalon, tehát a KES teljesül.
              </p>
            ) : (
              <p className="text-red-600">
                A KES sérül: van {grammer.start} → ε szabály, de {grammer.start} jobb oldalon áll itt:{" "}
                <span className="font-mono">{result.kes.violatingRules.map(showRule).join(", ")}</span>. Ezért a
                grammatika nem 1-es típusú.
              </p>
            )}
          </div>

          <div className="rounded border border-brand-200 bg-brand-50 p-3">
            <p className="font-semibold">
              A grammatika típusa: {result.types.map((t) => `𝒢${t}`).join(", ")}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Ez a grammatika típusa, nem a nyelvé: ugyanazt a nyelvet egy szigorúbb típusú grammatika is
              generálhatja.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
