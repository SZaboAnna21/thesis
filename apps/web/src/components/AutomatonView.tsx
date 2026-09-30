import type { Dfa, State } from "@fotoc/automata-core";

type Props = {
  dfa: Dfa;
  activeState?: State;
};

// Egyelőre átmenettáblaként jeleníti meg az automatát, később gráfrajz lesz.
export function AutomatonView({ dfa, activeState }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Állapot</th>
          {dfa.alphabet.map((symbol) => (
            <th key={symbol}>{symbol}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dfa.states.map((state) => (
          <tr key={state} style={{ fontWeight: state === activeState ? "bold" : undefined }}>
            <td>
              {state === dfa.start && "→ "}
              {state}
              {dfa.accepting.includes(state) && " *"}
            </td>
            {dfa.alphabet.map((symbol) => (
              <td key={symbol}>{dfa.transitions[state]?.[symbol] ?? "–"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
