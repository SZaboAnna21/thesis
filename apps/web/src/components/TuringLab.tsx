import { useMemo, useState } from "react";
import type { Direction, TMTransition, TuringMachine } from "@fotoc/automata-core";
import { TuringSimulator } from "./TuringSimulator";

const DEFAULT_RULES = `# Formátum: állapot olvas -> állapot ír irány
# Irány: L (bal), R (jobb), S (helyben)
# Példa: a^n b^n felismerése

q0 a -> q1 X R
q0 X -> q0 X R
q0 Y -> q0 Y R
q0 □ -> q_i □ S
q1 a -> q1 a R
q1 Y -> q1 Y R
q1 b -> q2 Y L
q1 □ -> q_n □ S
q2 a -> q2 a L
q2 Y -> q2 Y L
q2 X -> q0 X R`;

type ParseError = { line: number; message: string };

function parseTransitions(text: string): { transitions: TMTransition[]; errors: ParseError[] } {
  const transitions: TMTransition[] = [];
  const errors: ParseError[] = [];

  for (const [i, raw] of text.split("\n").entries()) {
    const line = raw.trim();
    if (line === "" || line.startsWith("#")) continue;

    const parts = line.split(/\s+/);
    if (parts.length !== 6 || parts[2] !== "->") {
      errors.push({ line: i + 1, message: `Helytelen formátum — várt: "állapot szimbólum -> állapot szimbólum irány"` });
      continue;
    }

    const [from, read, , to, write, dirStr] = parts;
    if (!["L", "R", "S"].includes(dirStr)) {
      errors.push({ line: i + 1, message: `Érvénytelen irány: "${dirStr}" — lehetséges értékek: L, R, S` });
      continue;
    }

    transitions.push({ from, read, to, write, dir: dirStr as Direction });
  }

  return { transitions, errors };
}

type Fields = {
  rules: string;
  startState: string;
  acceptState: string;
  rejectState: string;
  blankSymbol: string;
};

const DEFAULT_FIELDS: Fields = {
  rules: DEFAULT_RULES,
  startState: "q0",
  acceptState: "q_i",
  rejectState: "q_n",
  blankSymbol: "□",
};

export function TuringLab() {
  const [fields, setFields] = useState<Fields>(DEFAULT_FIELDS);

  const { transitions, errors } = useMemo(() => parseTransitions(fields.rules), [fields.rules]);

  const ready =
    errors.length === 0 &&
    fields.startState !== "" &&
    fields.acceptState !== "" &&
    fields.rejectState !== "" &&
    fields.blankSymbol !== "";

  const tm: TuringMachine = useMemo(
    () => ({
      transitions,
      startState: fields.startState,
      acceptState: fields.acceptState,
      rejectState: fields.rejectState,
      blankSymbol: fields.blankSymbol,
    }),
    [transitions, fields.startState, fields.acceptState, fields.rejectState, fields.blankSymbol],
  );

  const allStates = useMemo(() => {
    const s = new Set([fields.startState, fields.acceptState, fields.rejectState]);
    for (const t of transitions) { s.add(t.from); s.add(t.to); }
    return [...s].filter(Boolean);
  }, [transitions, fields.startState, fields.acceptState, fields.rejectState]);

  function update(changes: Partial<Fields>) {
    setFields((f) => ({ ...f, ...changes }));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 rounded border bg-white p-4 md:grid-cols-[1fr_14rem]">
        <label className="block text-sm">
          <span className="font-semibold">Átmenetek</span>
          <span className="ml-2 text-gray-500">soronként „állapot szimbólum → állapot szimbólum irány"</span>
          <textarea
            value={fields.rules}
            onChange={(e) => update({ rules: e.target.value })}
            spellCheck={false}
            className="mt-1 h-52 w-full rounded border p-2 font-mono text-sm"
          />
        </label>

        <div className="space-y-3 text-sm">
          <Field label="Kezdőállapot (q₀)" value={fields.startState} onChange={(v) => update({ startState: v.trim() })} />
          <Field label="Elfogadó állapot (qᵢ)" value={fields.acceptState} onChange={(v) => update({ acceptState: v.trim() })} />
          <Field label="Elutasító állapot (qₙ)" value={fields.rejectState} onChange={(v) => update({ rejectState: v.trim() })} />
          <Field label="Blank szimbólum (□)" value={fields.blankSymbol} onChange={(v) => update({ blankSymbol: v.trim() })} />
        </div>

        <div className="space-y-1 text-sm md:col-span-2">
          {errors.map((e) => (
            <p key={e.line} className="text-red-600">
              {e.line}. sor: {e.message}
            </p>
          ))}
          {ready && (
            <p className="text-gray-500">
              Q = {"{" + allStates.join(", ") + "}"} &nbsp;·&nbsp;
              {transitions.length} átmenet
            </p>
          )}
        </div>
      </div>

      {ready && <TuringSimulator key={JSON.stringify(tm)} tm={tm} />}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-0.5 w-full rounded border px-2 py-1 font-mono text-sm"
      />
    </label>
  );
}
