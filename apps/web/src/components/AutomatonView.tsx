import type { Dfa, State } from "@fotoc/automata-core";

type Props = {
  dfa: Dfa;
  activeState?: State;
};

function stateMarker(dfa: Dfa, state: State) {
  const isStart = state === dfa.start;
  const isAccepting = dfa.accepting.includes(state);

  if (isStart && isAccepting) return "⇆ ";
  if (isStart) return "→ ";
  if (isAccepting) return "← ";
  return "";
}

// Egyelőre átmenettáblaként jeleníti meg az automatát, később gráfrajz lesz.
export function AutomatonView({ dfa, activeState }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {dfa.alphabet.map((letter) => (
            <th key={letter}>{letter}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dfa.states.map((state) => (
          <tr key={state} style={{ fontWeight: state === activeState ? "bold" : undefined }}>
            <td>
              {stateMarker(dfa, state)}
              {state}
            </td>
            {dfa.alphabet.map((letter) => (
              <td key={letter}>{dfa.transitions[state][letter]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
