import { EPS, type Nfa } from "@fotoc/automata-core";
import { showSet } from "./showSet";

type Props = {
  nfa: Nfa;
  active?: string[];
};

function stateMarker(nfa: Nfa, state: string) {
  const isStart = nfa.starts.includes(state);
  const isAccepting = nfa.accepting.includes(state);

  if (isStart && isAccepting) return "⇆";
  if (isStart) return "→";
  if (isAccepting) return "←";
  return "";
}

export function NfaTable({ nfa, active = [] }: Props) {
  const hasEps = nfa.states.some((state) => (nfa.transitions[state]?.[EPS] ?? []).length > 0);
  const columns = hasEps ? [...nfa.alphabet, EPS] : nfa.alphabet;

  return (
    <div className="overflow-x-auto rounded border bg-white p-3">
      <table className="w-full text-center font-mono text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-1"></th>
            {columns.map((letter) => (
              <th key={letter} className={"p-1 " + (letter === EPS ? "text-brand-600" : "")}>
                {letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nfa.states.map((state) => {
            const isActive = active.includes(state);
            return (
              <tr
                key={state}
                className={"border-t transition-colors " + (isActive ? "bg-brand-100 font-semibold" : "")}
              >
                <td className="p-1 text-left">
                  <span className="inline-block w-5 text-gray-500">{stateMarker(nfa, state)}</span>
                  {state}
                </td>
                {columns.map((letter) => (
                  <td key={letter} className="p-1 text-gray-700">
                    {showSet(nfa.transitions[state]?.[letter] ?? [])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-gray-500">→ kezdőállapot, ← elfogadó, ⇆ mindkettő</p>
    </div>
  );
}
