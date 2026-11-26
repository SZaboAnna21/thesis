import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  EPS,
  isDeterministic,
  parsePdaRules,
  type AcceptMode,
  type Nfa,
  type Pda,
  type PdaConfig,
  type PdaMove,
} from "@fotoc/automata-core";
import { call } from "../useCore";
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


const showStack = (stack: string[]) => (stack.length === 0 ? "ε" : stack.join(""));
const splitList = (text: string) => text.split(",").map((s) => s.trim()).filter(Boolean);
const addUnique = (list: string[], extra: string[]) => [...list, ...extra.filter((s) => s && !list.includes(s))];

function dedupMoves(transitions: Pda["transitions"]): Pda["transitions"] {
  const out: Pda["transitions"] = {};
  for (const [z, byState] of Object.entries(transitions)) {
    out[z] = {};
    for (const [q, byLetter] of Object.entries(byState)) {
      out[z][q] = {};
      for (const [letter, moves] of Object.entries(byLetter)) {
        const seen = new Set<string>();
        out[z][q][letter] = moves.filter((m) => {
          const key = m.next + "|" + m.push.join(",");
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
    }
  }
  return out;
}

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
      transitions: dedupMoves(parsed.transitions),
      Zsymbols: addUnique(parsed.Zsymbols, [fields.bottom]),
      Qstates: addUnique(parsed.Qstates, [fields.start, ...splitList(fields.accepting)]),
      z0startsymbol: fields.bottom,
      startState: fields.start,
      accepting: splitList(fields.accepting),
    }),
    [parsed, fields.bottom, fields.start, fields.accepting],
  );

  const ready = parsed.errors.length === 0 && fields.bottom !== "" && fields.start !== "";

  type RunSnapshot = { pda: Pda; mode: AcceptMode; word: string };
  const [snapshot, setSnapshot] = useState<RunSnapshot | null>(null);

  function update(changes: Partial<Fields>) {
    setFields({ ...fields, ...changes });
  }

  function handleRun() {
    if (ready) setSnapshot({ pda, mode: fields.mode, word });
  }

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-[min(100vw,80rem)] px-4 sm:px-6">
      <p className="mb-6 text-muted-foreground">Add meg a veremautomata szabályait soronként, a veremalapot, a kezdőállapotot és az elfogadás módját (végállapot vagy üres verem), majd futtasd le a szimulációt a vizsgált szóra.</p>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

        <div className="lg:w-[38rem] lg:shrink-0">
          <div className="grid gap-6 rounded-3xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-8 shadow-lg md:grid-cols-[1fr_14rem]">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-700">Szabályok</span>
              <span className="ml-2 text-xs text-gray-500 dark:text-slate-500">soronként "z q a -&gt; u p", ε-átmenetnél "z q -&gt; u p"</span>
              <textarea
                value={fields.rules}
                onChange={(e) => update({ rules: e.target.value })}
                spellCheck={false}
                className="mt-2 h-48 w-full rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 p-3 font-mono text-sm text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400 resize-none"
              />
            </label>

            <div className="space-y-4">
              <Field label="Verem alja (z₀)" value={fields.bottom} onChange={(bottom) => update({ bottom: bottom.trim() })} />
              <Field label="Kezdőállapot (q₀)" value={fields.start} onChange={(start) => update({ start: start.trim() })} />
              <Field
                label="Végállapotok (F)"
                value={fields.accepting}
                placeholder="q2, q3"
                onChange={(accepting) => update({ accepting })}
              />
              <fieldset>
                <legend className="text-sm font-semibold text-gray-700 dark:text-slate-700">Elfogadás</legend>
                <ModeRadio mode="final-state" current={fields.mode} onChange={(mode) => update({ mode })}>
                  végállapottal, L(A)
                </ModeRadio>
                <ModeRadio mode="empty-stack" current={fields.mode} onChange={(mode) => update({ mode })}>
                  üres veremmel, N(A)
                </ModeRadio>
              </fieldset>
            </div>

            <div className="space-y-1 md:col-span-2">
              {parsed.errors.map((error) => (
                <p key={error.line} className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {error.line}. sor: {error.message}
                </p>
              ))}
              {ready && (
                <p className="text-xs text-gray-500 dark:text-slate-500">
                  Z = {showSet(pda.Zsymbols)}, Q = {showSet(pda.Qstates)}, Σ = {showSet(pda.inputSymbols)}.{" "}
                  {isDeterministic(pda) ? (
                    <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-bold text-green-700 dark:text-green-300">determinisztikus</span>
                  ) : (
                    <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">nemdeterminisztikus</span>
                  )}
                </p>
              )}
            </div>

            {ready && (
              <label className="flex flex-wrap items-center gap-3 text-sm md:col-span-2">
                <span className="font-semibold text-gray-700 dark:text-slate-700">Bemeneti szó:</span>
                <input
                  value={word}
                  onChange={(e) => setWord(e.target.value.trim())}
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
            <PdaRunView key={JSON.stringify(snapshot)} pda={snapshot.pda} mode={snapshot.mode} word={snapshot.word} />
          </div>
        )}

      </div>
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
      <span className="text-sm font-semibold text-gray-700 dark:text-slate-700">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 px-3 font-mono text-sm text-gray-900 dark:text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400"
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
      <input type="radio" checked={mode === current} onChange={() => onChange(mode)} className="accent-purple-600" />
      {children}
    </label>
  );
}

type PdaPathResult = { path: PdaConfig[]; accepted: boolean; truncated: boolean };

function PdaRunView({ pda, mode, word }: { pda: Pda; mode: AcceptMode; word: string }) {
  const graph = useMemo(() => toGraph(pda), [pda]);
  const [pathResult, setPathResult] = useState<PdaPathResult | null>(null);
  useEffect(() => {
    setPathResult(null);
    call<PdaPathResult>("pdaPath", pda, word, mode).then(setPathResult);
  }, [pda, word, mode]);

  const path = pathResult?.path ?? [];
  const player = usePlayer(path.length || 1);
  const index = Math.min(player.index, path.length - 1);

  if (!pathResult)
    return <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md text-center text-sm text-gray-500 dark:text-slate-500">Számítás…</div>;

  const config = path[index];
  const position = readCount(path, index);
  const isLast = index === path.length - 1;
  const foreign = [...word].filter((letter) => !pda.inputSymbols.includes(letter));

  const taken = path.slice(1, index + 1).map(transitionOf);

  return (
    <div
      className="space-y-6 rounded-2xl border border-purple-100 dark:border-purple-600 bg-white dark:bg-slate-100 p-6 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
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

      <div className="rounded-2xl border border-purple-100 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 p-4 text-sm text-gray-700 dark:text-slate-700">
        <StepExplanation config={config} />
        <p className="mt-1 break-all font-mono text-gray-700 dark:text-slate-700">
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
          accepted={pathResult.accepted}
          truncated={pathResult.truncated}
        />
      )}
    </div>
  );
}

function Tape({ word, position }: { word: string; position: number }) {
  if (word === "") return <p className="font-mono text-2xl text-gray-500">ε</p>;

  return (
    <div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">Bemenet</p>
      <div className="flex flex-wrap gap-1">
        {[...word].map((letter, k) => (
          <span
            key={k}
            className={
              "flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-xl transition-colors duration-300 " +
              (k === position
                ? "border-purple-700 bg-purple-600 text-white shadow-md"
                : k < position
                  ? "border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/40 text-purple-400 dark:text-purple-300"
                  : "border-gray-200 dark:border-slate-200 bg-white dark:bg-slate-50 text-gray-900 dark:text-slate-900")
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
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">Verem (alja balra, teteje jobbra)</p>
      <div className="flex min-h-12 flex-wrap items-center gap-1">
        {stack.length === 0 && <span className="text-sm text-gray-500">üres a verem</span>}
        {stack.map((symbol, k) => (
          <span
            key={k}
            className={
              "flex h-12 min-w-12 items-center justify-center rounded border-2 px-2 font-mono text-xl " +
              (k === stack.length - 1
                ? "border-purple-700 bg-purple-600 text-white"
                : k === 0 && symbol === bottom
                  ? "border-gray-300 dark:border-slate-300 bg-gray-100 dark:bg-slate-200 text-gray-700 dark:text-slate-700"
                  : "border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100")
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
      <b>{config.letter === EPS ? "ε-átmenet, nem olvasunk betűt:" : `"${config.letter}" beolvasása:`}</b>{" "}
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
      <p className="rounded-2xl border border-green-300 bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-800 dark:text-green-300">
        {mode === "final-state"
          ? <>A szó elfogyott, és {config.state} végállapot, tehát az automata <b>elfogadja</b> a szót.</>
          : <>A szó elfogyott, és a verem üres, tehát az automata <b>elfogadja</b> a szót.</>}
        {!isDeterministic(pda) && " Ez az egyik elfogadó út, a többi ág nem számít."}
      </p>
    );
  }

  if (truncated) {
    return (
      <p className="rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
        Nem sikerült eldönteni: az ε-átmenetek miatt túl nagyra nőtt a keresés (legfeljebb 50 hosszú verem,{" "}
        5000 konfiguráció).
      </p>
    );
  }

  const top = config.stack[config.stack.length - 1];
  let reason: string;
  if (position < word.length) {
    reason =
      `Minden ág elakadt. A legtovább jutó a(z) ${position + 1}. betűnél ("${word[position]}") állt meg: ` +
      (top === undefined ? "üres veremmel nincs több lépés." : `${config.state} állapotban, ${top} veremtetővel nincs rá szabály.`);
  } else {
    reason =
      mode === "final-state"
        ? "A szó elfogyott, de egyik ág sem jutott végállapotba."
        : "A szó elfogyott, de egyik ágon sem ürült ki a verem.";
  }

  return (
    <p className="rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
      Az automata <b>elutasítja</b> a szót. {reason}
    </p>
  );
}
