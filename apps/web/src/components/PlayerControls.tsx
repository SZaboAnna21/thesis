import type { ButtonHTMLAttributes } from "react";
import { SPEEDS, type Player } from "./usePlayer";

export function PlayerControls({ player }: { player: Player }) {
  const { index, last, isPlaying, speed, setSpeed, go, togglePlay } = player;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={() => go(0)} disabled={index === 0} title="Elejére">⏮</Button>
      <Button onClick={() => go(index - 1)} disabled={index === 0} title="Vissza (←)">◀</Button>
      <Button onClick={togglePlay} disabled={last === 0} title="Lejátszás / szünet (szóköz)" primary>
        {isPlaying ? "⏸" : "▶"}
      </Button>
      <Button onClick={() => go(index + 1)} disabled={index === last} title="Előre (→)">▶|</Button>
      <Button onClick={() => go(last)} disabled={index === last} title="Végére">⏭</Button>

      <input
        type="range"
        min={0}
        max={last}
        value={index}
        onChange={(e) => go(Number(e.target.value))}
        className="min-w-24 flex-1 accent-brand-600"
        aria-label="Lépés"
      />
      <span className="text-sm tabular-nums text-gray-600">
        {index + 1} / {last + 1}
      </span>

      <select
        className="rounded border p-1 text-sm"
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
        aria-label="Sebesség"
      >
        {SPEEDS.map((s) => (
          <option key={s.ms} value={s.ms}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Button({ primary, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={
        "rounded border px-3 py-1 text-sm disabled:opacity-40 " +
        (primary ? "border-brand-600 bg-brand-600 text-white" : "bg-white hover:bg-gray-50")
      }
    />
  );
}
