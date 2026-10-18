import { useMemo } from "react";
import { determinize, type Nfa, type SubsetRow, type SubsetStep } from "@fotoc/automata-core";
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
  const steps = useMemo(() => determinize(nfa), [nfa]);
  const player = usePlayer(steps.length + 1);
  const index = player.index;
  const current = index === 0 ? undefined : steps[index - 1];
  const queue = current ? current.queue : [steps[0].row.set];
  const fresh = useMemo(() => (index === 0 ? new Set<string>() : newTargets(steps, index - 1)), [steps, index]);
  const isLast = index === steps.length;

  return (
    <div
      className="space-y-4 rounded border bg-white p-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
      tabIndex={0}
      onKeyDown={player.onKeyDown}
    >
      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Az NDVA</p>
        <NfaTable nfa={nfa} active={current?.row.set ?? []} />
      </div>

      <div className="rounded border border-brand-200 bg-brand-50 p-3 text-sm">
        {current ? (
          <RowExplanation nfa={nfa} row={current.row} fresh={fresh} />
        ) : (
          <StartExplanation nfa={nfa} start={steps[0].row.set} />
        )}
      </div>

      <QueueView queue={queue} />

      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-gray-500">A készülő VDA</p>
        <SubsetTable nfa={nfa} rows={steps.slice(0, index).map((s) => s.row)} fresh={fresh} />
      </div>

      {isLast && <Summary nfa={nfa} rows={steps.map((s) => s.row)} />}

      <PlayerControls player={player} />
    </div>
  );
}

function StartExplanation({ nfa, start }: { nfa: Nfa; start: string[] }) {
  const viaEps = start.filter((state) => !nfa.starts.includes(state));

  return (
    <>
      <p className="font-semibold">Kiindulás</p>
      <p className="mt-1">
        A VDA kezdőállapota a kezdőállapotok halmaza, <b>egyetlen</b> állapotként:{" "}
        <b className="font-mono">{showSet(nfa.starts.filter((s) => nfa.states.includes(s)))}</b>
        {viaEps.length > 0 && (
          <>
            , kiegészítve az ε-lezárttal: <b className="font-mono">{showSet(start)}</b>
          </>
        )}
        .
      </p>
      <p className="mt-1">Ez kerül elsőként a sorba. Mindig a sor elejéről veszünk ki egy halmazt, és kiszámoljuk a sorát.</p>
    </>
  );
}

function RowExplanation({ nfa, row, fresh }: { nfa: Nfa; row: SubsetRow; fresh: Set<string> }) {
  return (
    <>
      <p className="font-semibold">
        Kivesszük a sor elejéről: <span className="font-mono">{showSet(row.set)}</span>
      </p>
      <ul className="mt-2 space-y-1">
        {nfa.alphabet.map((letter) => {
          const target = row.next[letter];
          const union = nfa.states.filter((s) => row.set.some((q) => nfa.transitions[q]?.[letter]?.includes(s)));
          const isNew = fresh.has(setKey(target));
          return (
            <li key={letter} className="font-mono">
              <span className="font-semibold">{letter}:</span>{" "}
              {row.set.length === 0
                ? "az üres halmazból sehova nem lépünk"
                : row.set.map((q) => showSet(nfa.transitions[q]?.[letter] ?? [])).join(" ∪ ")}{" "}
              = {showSet(union)}
              {setKey(union) !== setKey(target) && <> → ε-lezárt: {showSet(target)}</>}
              <span
                className={
                  "ml-2 rounded px-1.5 py-0.5 font-sans text-xs " +
                  (isNew ? "bg-brand-600 text-white" : "bg-gray-200 text-gray-600")
                }
              >
                {isNew ? "új → a sor végére" : "már ismert"}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2">
        {row.isAccepting
          ? `Elfogadó, mert van benne elfogadó állapot: ${row.set.filter((s) => nfa.accepting.includes(s)).join(", ")}.`
          : row.set.length === 0
            ? "Ez a csapda: nem elfogadó, és minden betűre önmagába lép."
            : "Nem elfogadó, mert nincs benne elfogadó állapot."}
      </p>
    </>
  );
}

function QueueView({ queue }: { queue: string[][] }) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-sm">
      <span className="font-semibold">Sor:</span>
      {queue.length === 0 ? (
        <span className="text-gray-500">üres, kész vagyunk</span>
      ) : (
        queue.map((set, k) => (
          <span
            key={setKey(set)}
            className={"rounded border px-2 py-0.5 font-mono " + (k === 0 ? "border-brand-500 bg-brand-100" : "bg-white")}
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
    <div className="overflow-x-auto rounded border bg-white p-3">
      <table className="w-full text-center font-mono text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-1"></th>
            {nfa.alphabet.map((letter) => (
              <th key={letter} className="p-1">
                {letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr className="border-t">
              <td colSpan={nfa.alphabet.length + 1} className="p-2 font-sans text-gray-400">
                Még nincs kiszámolt sor.
              </td>
            </tr>
          )}
          {rows.map((row, k) => {
            const isCurrent = k === rows.length - 1;
            return (
              <tr key={setKey(row.set)} className={"border-t " + (isCurrent ? "nf3-in bg-brand-100 font-semibold" : "")}>
                <td className="p-1 text-left">
                  <span className="inline-block w-5 text-gray-500">{rowMarker(row)}</span>
                  {showSet(row.set)}
                </td>
                {nfa.alphabet.map((letter) => (
                  <td key={letter} className="p-1">
                    {showSet(row.next[letter])}
                    {isCurrent && fresh.has(setKey(row.next[letter])) && (
                      <span className="ml-1 rounded bg-brand-600 px-1 font-sans text-xs font-normal text-white">új</span>
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
    <div className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800">
      <p className="font-semibold">Kész a VDA!</p>
      <p className="mt-1">
        {rows.length} állapot a lehetséges 2<sup>{nfa.states.length}</sup> = {all} részhalmaz helyett: csak az elérhető
        halmazokat vettük fel.
        {hasTrap && " Az üres halmaz a csapda, nem szabad kihagyni, különben a VDA nem lenne teljes."}
      </p>
    </div>
  );
}
