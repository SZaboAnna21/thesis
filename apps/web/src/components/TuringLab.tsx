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
  const seen = new Set<string>();

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

    const key = `${from}|${read}|${to}|${write}|${dirStr}`;
    if (!seen.has(key)) {
      seen.add(key);
      transitions.push({ from, read, to, write, dir: dirStr as Direction });
    }
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

type Snapshot = { tm: TuringMachine; word: string };

export function TuringLab() {
  const [fields, setFields] = useState<Fields>(DEFAULT_FIELDS);
  const [word, setWord] = useState("");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

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

  function handleRun() {
    if (ready) setSnapshot({ tm, word });
  }

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-[min(100vw,80rem)] px-4 sm:px-6">
      <p className="mb-6 text-muted-foreground">Add meg az átmeneteket soronként (állapot szimbólum → állapot szimbólum irány), a kezdő- és elfogadó állapotokat, majd add meg a vizsgált szót és indítsd el a szimulációt. A szalag tartalma és a fej pozíciója lépésről lépésre követhető.</p>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

        <div className="lg:w-[38rem] lg:shrink-0">
          <div className="grid gap-6 rounded-3xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-8 shadow-lg md:grid-cols-[1fr_14rem]">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-700">Átmenetek</span>
              <span className="ml-2 text-xs text-gray-500 dark:text-slate-500">soronként „állapot szimbólum → állapot szimbólum irány”</span>
              <textarea
                value={fields.rules}
                onChange={(e) => update({ rules: e.target.value })}
                spellCheck={false}
                className="mt-2 h-52 w-full rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 p-3 font-mono text-sm text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400 resize-none"
              />
            </label>

            <div className="space-y-4">
              <Field label="Kezdőállapot (q₀)" value={fields.startState} onChange={(v) => update({ startState: v.trim() })} />
              <Field label="Elfogadó állapot (qᵢ)" value={fields.acceptState} onChange={(v) => update({ acceptState: v.trim() })} />
              <Field label="Elutasító állapot (qₙ)" value={fields.rejectState} onChange={(v) => update({ rejectState: v.trim() })} />
              <Field label="Blank szimbólum (□)" value={fields.blankSymbol} onChange={(v) => update({ blankSymbol: v.trim() })} />
            </div>

            <div className="space-y-1 md:col-span-2">
              {errors.map((e) => (
                <p key={e.line} className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {e.line}. sor: {e.message}
                </p>
              ))}
              {ready && (
                <p className="text-xs text-gray-500 dark:text-slate-500">
                  Q = {"{" + allStates.join(", ") + "}"} &nbsp;&middot;&nbsp;
                  {transitions.length} átmenet
                </p>
              )}
            </div>

            {ready && (
              <label className="flex flex-wrap items-center gap-3 text-sm md:col-span-2">
                <span className="font-semibold text-gray-700 dark:text-slate-700">Bemeneti szó:</span>
                <input
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRun(); }}
                  placeholder="ε (üres szó)"
                  className="h-10 rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 px-3 font-mono text-gray-900 dark:text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400"
                />
              </label>
            )}

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleRun}
                disabled={!ready}
                className="rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed px-10 py-4 text-lg font-bold text-white shadow-lg shadow-purple-200 dark:shadow-purple-900 transition-all"
              >
                Futtat
              </button>
            </div>
          </div>
        </div>

        {snapshot && (
          <div className="min-w-0 flex-1">
            <TuringSimulator key={JSON.stringify(snapshot)} tm={snapshot.tm} initialWord={snapshot.word} />
          </div>
        )}

      </div>
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
      <span className="text-sm font-semibold text-gray-700 dark:text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 h-10 w-full rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 px-3 font-mono text-sm text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400"
      />
    </label>
  );
}
