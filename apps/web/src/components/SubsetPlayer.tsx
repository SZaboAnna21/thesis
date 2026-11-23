import { useEffect, useMemo, useState } from "react";
import { type Nfa, type SubsetRow, type SubsetStep } from "@fotoc/automata-core";
import { call } from "../useCore";
import { NfaTable } from "./NfaTable";
import { PlayerControls } from "./PlayerControls";
import { showSet } from "./showSet";
import { usePlayer } from "./usePlayer";

type Props = {
  nfa: Nfa;
};

const setKey = (states: string[]) => states.join(",");

function rowMarker(row: SubsetRow) {
  if (row.isStart && row.isAccepting) return "⇆";
  if (row.isStart) return "→";
  if (row.isAccepting) return "←";
  return "";
}

function newTargets(steps: SubsetStep[], k: number): Set<string> {
  const known = new Set([
    ...steps.slice(0, k + 1).map((s) => setKey(s.row.set)),
    ...(k === 0 ? [] : steps[k - 1].queue.map(setKey)),
  ]);
  const found = new Set<string>();
  for (const target of Object.values(steps[k].row.next)) {
    if (!known.has(setKey(target))) {
      known.add(setKey(target));
      found.add(setKey(target));
    }
  }
  return found;
}

export function SubsetPlayer({ nfa }: Props) {
  const [steps, setSteps] = useState<SubsetStep[] | null>(null);
  useEffect(() => {
    setSteps(null);
    call<SubsetStep[]>("determinize", nfa).then(setSteps);
  }, [nfa]);

  const player = usePlayer(steps ? steps.length + 1 : 1);
  const index = player.index;

  const fresh = useMemo(
    () => (index === 0 || !steps ? new Set<string>() : newTargets(steps, index - 1)),
    [steps, index],
  );

  if (!steps)
    return (
      <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6 text-center text-sm text-purple-400 dark:border-purple-600 dark:bg-purple-900/20">
        Számítás…
      </div>
    );

  const current = index === 0 ? undefined : steps[index - 1];
  const queue = current ? current.queue : [steps[0].row.set];
  const isLast = index === steps.length;

  return (
    <div
      className="space-y-4 outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      tabIndex={0}
      onKeyDown={player.onKeyDown}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm dark:border-purple-600 dark:bg-slate-50">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
              Az NDVA
            </p>
            <NfaTable nfa={nfa} active={current?.row.set ?? []} />
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm dark:border-purple-600 dark:bg-purple-900/40">
            {current ? (
              <RowExplanation nfa={nfa} row={current.row} fresh={fresh} />
            ) : (
              <StartExplanation nfa={nfa} start={steps[0].row.set} />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm dark:border-purple-600 dark:bg-slate-50">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
              A készülő VDA
            </p>
            <QueueView queue={queue} />
            <div className="mt-3">
              <SubsetTable nfa={nfa} rows={steps.slice(0, index).map((s) => s.row)} fresh={fresh} />
            </div>
          </div>

          {isLast && <Summary nfa={nfa} rows={steps.map((s) => s.row)} />}
        </div>
      </div>

      <PlayerControls player={player} />
    </div>
  );
}

function StartExplanation({ nfa, start }: { nfa: Nfa; start: string[] }) {
  const viaEps = start.filter((state) => !nfa.starts.includes(state));

  return (
    <>
      <p className="font-semibold text-gray-900 dark:text-slate-900">Kiindulás</p>
      <p className="mt-1 text-gray-700 dark:text-slate-700">
        A VDA kezdőállapota a kezdőállapotok halmaza, <b>egyetlen</b> állapotként:{" "}
        <b className="font-mono">{showSet(nfa.starts.filter((s) => nfa.states.includes(s)))}</b>
        {viaEps.length > 0 && (
          <>
            , kiegészítve az ε-lezárttal: <b className="font-mono">{showSet(start)}</b>
          </>
        )}
        .
      </p>
      <p className="mt-1 text-gray-700 dark:text-slate-700">
        Ez kerül elsőként a sorba. Mindig a sor elejéről veszünk ki egy halmazt, és kiszámoljuk a sorát.
      </p>
    </>
  );
}

function RowExplanation({ nfa, row, fresh }: { nfa: Nfa; row: SubsetRow; fresh: Set<string> }) {
  return (
    <>
      <p className="font-semibold text-gray-900 dark:text-slate-900">
        Kivesszük a sor elejéről: <span className="font-mono">{showSet(row.set)}</span>
      </p>
      <ul className="mt-2 space-y-1">
        {nfa.alphabet.map((letter) => {
          const target = row.next[letter];
          const union = nfa.states.filter((s) => row.set.some((q) => nfa.transitions[q]?.[letter]?.includes(s)));
          const isNew = fresh.has(setKey(target));
          return (
            <li key={letter} className="font-mono text-gray-800 dark:text-slate-800">
              <span className="font-semibold">{letter}:</span>{" "}
              {row.set.length === 0
                ? "az üres halmazbol sehova nem lépünk"
                : row.set.map((q) => showSet(nfa.transitions[q]?.[letter] ?? [])).join(" ∪ ")}{" "}
              = {showSet(union)}
              {setKey(union) !== setKey(target) && <> → ε-lezárt: {showSet(target)}</>}
              <span
                className={
                  "ml-2 rounded px-1.5 py-0.5 font-sans text-xs " +
                  (isNew
                    ? "bg-purple-600 text-white dark:bg-purple-500"
                    : "bg-gray-200 text-gray-600 dark:bg-slate-300 dark:text-slate-700")
                }
              >
                {isNew ? "új → a sor végére" : "már ismert"}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-gray-700 dark:text-slate-700">
        {row.isAccepting
          ? `Elfogadó, mert van benne elfogadó állapot: ${row.set.filter((s) => nfa.accepting.includes(s)).join(", ")}.`
          : row.set.length === 0
            ? "Ez a csapda: nem elfogadó, és minden betűre önmagaba lép."
            : "Nem elfogadó, mert nincs benne elfogadó állapot."}
      </p>
    </>
  );
}

function QueueView({ queue }: { queue: string[][] }) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-sm">
      <span className="font-semibold text-gray-700 dark:text-slate-700">Sor:</span>
      {queue.length === 0 ? (
        <span className="text-gray-400 dark:text-slate-500">üres, kész vagyunk</span>
      ) : (
        queue.map((set, k) => (
          <span
            key={setKey(set)}
            className={
              "rounded-lg border px-2 py-0.5 font-mono " +
              (k === 0
                ? "border-purple-400 bg-purple-100 text-purple-800 dark:border-purple-500 dark:bg-purple-900/40 dark:text-purple-200"
                : "border-gray-200 bg-white text-gray-700 dark:border-slate-300 dark:bg-slate-50 dark:text-slate-700")
            }
          >
            {showSet(set)}
          </span>
        ))
      )}
    </div>
  );
}

function SubsetTable({ nfa, rows, fresh }: { nfa: Nfa; rows: SubsetRow[]; fresh: Set<string> }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-200">
      <table className="w-full text-center font-mono text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-100">
            <th className="p-2"></th>
            {nfa.alphabet.map((letter) => (
              <th key={letter} className="p-2 text-gray-600 dark:text-slate-600">
                {letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr className="border-t border-gray-100 dark:border-slate-200">
              <td colSpan={nfa.alphabet.length + 1} className="p-3 font-sans text-gray-400 dark:text-slate-500">
                Még nincs kiszámolt sor.
              </td>
            </tr>
          )}
          {rows.map((row, k) => {
            const isCurrent = k === rows.length - 1;
            return (
              <tr
                key={setKey(row.set)}
                className={
                  "border-t border-gray-100 dark:border-slate-200 " +
                  (isCurrent ? "bg-purple-50 font-semibold dark:bg-purple-900/30" : "")
                }
              >
                <td className="p-2 text-left">
                  <span className="inline-block w-5 text-gray-400 dark:text-slate-500">{rowMarker(row)}</span>
                  {showSet(row.set)}
                </td>
                {nfa.alphabet.map((letter) => (
                  <td key={letter} className="p-2">
                    {showSet(row.next[letter])}
                    {isCurrent && fresh.has(setKey(row.next[letter])) && (
                      <span className="ml-1 rounded bg-purple-600 px-1 font-sans text-xs font-normal text-white dark:bg-purple-500">
                        új
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Summary({ nfa, rows }: { nfa: Nfa; rows: SubsetRow[] }) {
  const all = 2 ** nfa.states.length;
  const hasTrap = rows.some((row) => row.set.length === 0);

  return (
    <div className="rounded-2xl border border-green-300 bg-green-50 p-4 text-sm text-green-800 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200">
      <p className="font-semibold">Kész a VDA!</p>
      <p className="mt-1">
        {rows.length} állapot a lehetséges 2<sup>{nfa.states.length}</sup> = {all} részhalmaz helyett: csak az elérhető
        halmazokat vettük fel.
        {hasTrap && " Az üres halmaz a csapda, nem szabad kihagyni, különben a VDA nem lenne teljes."}
      </p>
    </div>
  );
}
