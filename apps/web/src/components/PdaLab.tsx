import { useMemo, useState, type ReactNode } from "react";
import {
  EPS,
  acceptingPath,
  bestPath,
  isDeterministic,
  parsePdaRules,
  runningPda,
  type AcceptMode,
  type Nfa,
  type Pda,
  type PdaConfig,
  type PdaLimits,
  type PdaMove,
} from "@fotoc/automata-core";
import { AutomatonGraph, type GraphTransition } from "./AutomatonGraph";
import { PlayerControls } from "./PlayerControls";
import { showSet } from "./showSet";
import { usePlayer } from "./usePlayer";

type Fields = {
  rules: string;
  bottom: string;
  start: string;
  accepting: string;
  mode: AcceptMode;
};

const lectureExample: Fields = {
  rules: `# q0 a -> # a q0
a q0 a -> a a q0
a q0 b -> q1
a q1 b -> q1
# q1 -> q1`,
  bottom: "#",
  start: "q0",
  accepting: "",
  mode: "empty-stack",
};

const LIMITS: PdaLimits = { maxConfigs: 5000, maxStack: 50 };

const showStack = (stack: string[]) => (stack.length === 0 ? "ε" : stack.join(""));
const splitList = (text: string) => text.split(",").map((s) => s.trim()).filter(Boolean);
const addUnique = (list: string[], extra: string[]) => [...list, ...extra.filter((s) => s && !list.includes(s))];

function showRule(z: string, q: string, letter: string, move: PdaMove) {
  const left = letter === EPS ? `${z} ${q}` : `${z} ${q} ${letter}`;
  return `${left} → ${[...move.push, move.next].join(" ")}`;
}

function edgeLabel(z: string, letter: string, move: PdaMove) {
  return `${letter};${z}→${move.push.length === 0 ? "ε" : move.push.join("")}`;
}

function toGraph(pda: Pda): Nfa {
  const labels: string[] = [];
  const transitions: Nfa["transitions"] = {};
  for (const [z, byState] of Object.entries(pda.transitions)) {
    for (const [q, byLetter] of Object.entries(byState)) {
      for (const [letter, moves] of Object.entries(byLetter)) {
        for (const move of moves) {
          const label = edgeLabel(z, letter, move);
          if (!labels.includes(label)) labels.push(label);
          ((transitions[q] ??= {})[label] ??= []).push(move.next);
        }
      }
    }
  }
  return { states: pda.Qstates, alphabet: labels, transitions, starts: [pda.startState], accepting: pda.accepting };
}

function readCount(path: PdaConfig[], k: number) {
  return path.slice(1, k + 1).filter((c) => c.letter !== EPS).length;
}

function transitionOf(config: PdaConfig): GraphTransition {
  const from = config.from!;
  return {
    from: from.state,
    to: config.state,
    letter: edgeLabel(from.stack[from.stack.length - 1], config.letter!, config.move!),
  };
}

export function PdaLab() {
  const [fields, setFields] = useState<Fields>(lectureExample);
  const [word, setWord] = useState("aabb");

  const parsed = useMemo(() => parsePdaRules(fields.rules), [fields.rules]);
  const pda: Pda = useMemo(
    () => ({
      ...parsed,
      Zsymbols: addUnique(parsed.Zsymbols, [fields.bottom]),
      Qstates: addUnique(parsed.Qstates, [fields.start, ...splitList(fields.accepting)]),
      z0startsymbol: fields.bottom,
      startState: fields.start,
      accepting: splitList(fields.accepting),
    }),
    [parsed, fields.bottom, fields.start, fields.accepting],
  );

  const ready = parsed.errors.length === 0 && fields.bottom !== "" && fields.start !== "";

  function update(changes: Partial<Fields>) {
    setFields({ ...fields, ...changes });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 rounded border bg-white p-4 md:grid-cols-[1fr_14rem]">
        <label className="block text-sm">
          <span className="font-semibold">Szabályok</span>
          <span className="ml-2 text-gray-500">soronként „z q a -&gt; u p”, ε-átmenetnél „z q -&gt; u p”</span>
          <textarea
            value={fields.rules}
            onChange={(e) => update({ rules: e.target.value })}
            spellCheck={false}
            className="mt-1 h-48 w-full rounded border p-2 font-mono text-sm"
          />
        </label>

        <div className="space-y-3 text-sm">
          <Field label="Verem alja (z₀)" value={fields.bottom} onChange={(bottom) => update({ bottom: bottom.trim() })} />
          <Field label="Kezdőállapot (q₀)" value={fields.start} onChange={(start) => update({ start: start.trim() })} />
          <Field
            label="Végállapotok (F)"
            value={fields.accepting}
            placeholder="q2, q3"
            onChange={(accepting) => update({ accepting })}
          />
          <fieldset>
            <legend className="font-semibold">Elfogadás</legend>
            <ModeRadio mode="final-state" current={fields.mode} onChange={(mode) => update({ mode })}>
              végállapottal, L(A)
            </ModeRadio>
            <ModeRadio mode="empty-stack" current={fields.mode} onChange={(mode) => update({ mode })}>
              üres veremmel, N(A)
            </ModeRadio>
          </fieldset>
        </div>

        <div className="space-y-1 text-sm md:col-span-2">
          {parsed.errors.map((error) => (
            <p key={error.line} className="text-red-600">
              {error.line}. sor: {error.message}
            </p>
          ))}
          {ready && (
            <p className="text-gray-600">
              Z = {showSet(pda.Zsymbols)}, Q = {showSet(pda.Qstates)}, Σ = {showSet(pda.inputSymbols)}.{" "}
              {isDeterministic(pda) ? (
                <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-800">determinisztikus</span>
              ) : (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">nemdeterminisztikus</span>
              )}
            </p>
          )}
        </div>
      </div>

      {ready && (
        <>
          <label className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">Bemeneti szó:</span>
            <input
              value={word}
              onChange={(e) => setWord(e.target.value.trim())}
              placeholder="ε (üres szó)"
              className="rounded border px-2 py-1 font-mono"
            />
          </label>
          <PdaRunView key={JSON.stringify(fields) + "|" + word} pda={pda} mode={fields.mode} word={word} />
        </>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-semibold">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border px-2 py-1 font-mono"
      />
    </label>
  );
}

function ModeRadio({
  mode,
  current,
  onChange,
  children,
}: {
  mode: AcceptMode;
  current: AcceptMode;
  onChange: (mode: AcceptMode) => void;
  children: ReactNode;
}) {
  return (
    <label className="mt-1 flex items-center gap-2">
      <input type="radio" checked={mode === current} onChange={() => onChange(mode)} className="accent-brand-600" />
      {children}
    </label>
  );
}

function PdaRunView({ pda, mode, word }: { pda: Pda; mode: AcceptMode; word: string }) {
  const graph = useMemo(() => toGraph(pda), [pda]);
  const run = useMemo(() => runningPda(pda, word, LIMITS), [pda, word]);
  const accepted = useMemo(() => acceptingPath(pda, run, mode), [pda, run, mode]);
  const path = accepted ?? bestPath(run);
  const player = usePlayer(path.length);
  const index = player.index;
  const config = path[index];
  const position = readCount(path, index);
  const isLast = index === path.length - 1;
  const foreign = [...word].filter((letter) => !pda.inputSymbols.includes(letter));

  const taken = path.slice(1, index + 1).map(transitionOf);

  return (
    <div
      className="space-y-4 rounded border bg-white p-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
      tabIndex={0}
      onKeyDown={player.onKeyDown}
    >
      {foreign.length > 0 && (
        <p className="text-sm text-amber-700">
          A(z) {showSet([...new Set(foreign)])} betűre nincs szabály, ott az automata biztosan elakad.
        </p>
      )}

      <Tape word={word} position={position} />
      <StackView stack={config.stack} bottom={pda.z0startsymbol} />

      <AutomatonGraph
        automaton={graph}
        active={[config.state]}
        visited={path.slice(0, index + 1).map((c) => c.state)}
        taken={taken.slice(-1)}
        takenBefore={taken.slice(0, -1)}
      />

      <div className="rounded border border-brand-200 bg-brand-50 p-3 text-sm">
        <StepExplanation config={config} />
        <p className="mt-1 break-all font-mono text-gray-700">
          {path
            .slice(0, index + 1)
            .map((c, k) => (c.stack.length === 0 ? "" : c.stack.join("")) + c.state + word.slice(readCount(path, k)))
            .join(" ⇒ ")}
        </p>
      </div>

      <PlayerControls player={player} />

      {isLast && (
        <Verdict
          pda={pda}
          mode={mode}
          word={word}
          config={config}
          position={position}
          accepted={accepted !== null}
          truncated={run.truncated}
        />
      )}
    </div>
  );
}

function Tape({ word, position }: { word: string; position: number }) {
  if (word === "") return <p className="font-mono text-2xl text-gray-500">ε</p>;

  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Bemenet</p>
      <div className="flex flex-wrap gap-1">
        {[...word].map((letter, k) => (
          <span
            key={k}
            className={
              "flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-xl transition-colors duration-300 " +
              (k === position
                ? "border-brand-700 bg-brand-600 text-white shadow-md"
                : k < position
                  ? "border-brand-200 bg-brand-50 text-brand-400"
                  : "border-gray-300 bg-white text-gray-900")
            }
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}

function StackView({ stack, bottom }: { stack: string[]; bottom: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Verem (alja balra, teteje jobbra)</p>
      <div className="flex min-h-12 flex-wrap items-center gap-1">
        {stack.length === 0 && <span className="text-sm text-gray-500">üres a verem</span>}
        {stack.map((symbol, k) => (
          <span
            key={k}
            className={
              "flex h-12 min-w-12 items-center justify-center rounded border-2 px-2 font-mono text-xl " +
              (k === stack.length - 1
                ? "border-brand-700 bg-brand-600 text-white"
                : k === 0 && symbol === bottom
                  ? "border-gray-400 bg-gray-100 text-gray-700"
                  : "border-brand-300 bg-brand-50 text-brand-900")
            }
          >
            {symbol}
          </span>
        ))}
      </div>
    </div>
  );
}

function stackEffect(z: string, move: PdaMove) {
  if (move.push.length === 0) return `${z} kikerül a veremből (POP).`;
  if (move.push.length === 1 && move.push[0] === z) return "A verem változatlan marad.";
  if (move.push.length > 1 && move.push[0] === z) return `${z} fölé kerül: ${move.push.slice(1).join("")} (PUSH).`;
  return `${z} helyére ${move.push.join("")} kerül.`;
}

function StepExplanation({ config }: { config: PdaConfig }) {
  if (!config.from || !config.move || config.letter === null) {
    return (
      <p>
        <b>Kezdőkonfiguráció:</b> a veremben csak a(z) <b className="font-mono">{showStack(config.stack)}</b> van, az
        állapot <b className="font-mono">{config.state}</b>.
      </p>
    );
  }

  const from = config.from;
  const z = from.stack[from.stack.length - 1];
  return (
    <p>
      <b>{config.letter === EPS ? "ε-átmenet, nem olvasunk betűt:" : `„${config.letter}” beolvasása:`}</b>{" "}
      <span className="font-mono">{showRule(z, from.state, config.letter, config.move)}</span>. {stackEffect(z, config.move)}
    </p>
  );
}

function Verdict({
  pda,
  mode,
  word,
  config,
  position,
  accepted,
  truncated,
}: {
  pda: Pda;
  mode: AcceptMode;
  word: string;
  config: PdaConfig;
  position: number;
  accepted: boolean;
  truncated: boolean;
}) {
  if (accepted) {
    return (
      <p className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800">
        {mode === "final-state"
          ? <>A szó elfogyott, és {config.state} végállapot, tehát az automata <b>elfogadja</b> a szót.</>
          : <>A szó elfogyott, és a verem üres, tehát az automata <b>elfogadja</b> a szót.</>}
        {!isDeterministic(pda) && " Ez az egyik elfogadó út, a többi ág nem számít."}
      </p>
    );
  }

  if (truncated) {
    return (
      <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
        Nem sikerült eldönteni: az ε-átmenetek miatt túl nagyra nőtt a keresés (legfeljebb {LIMITS.maxStack} hosszú verem,{" "}
        {LIMITS.maxConfigs} konfiguráció).
      </p>
    );
  }

  const top = config.stack[config.stack.length - 1];
  let reason: string;
  if (position < word.length) {
    reason =
      `Minden ág elakadt. A legtovább jutó a(z) ${position + 1}. betűnél („${word[position]}”) állt meg: ` +
      (top === undefined ? "üres veremmel nincs több lépés." : `${config.state} állapotban, ${top} veremtetővel nincs rá szabály.`);
  } else {
    reason =
      mode === "final-state"
        ? "A szó elfogyott, de egyik ág sem jutott végállapotba."
        : "A szó elfogyott, de egyik ágon sem ürült ki a verem.";
  }

  return (
    <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
      Az automata <b>elutasítja</b> a szót. {reason}
    </p>
  );
}
