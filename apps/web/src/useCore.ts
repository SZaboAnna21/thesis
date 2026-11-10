import CoreWorker from "./core.worker?worker";

type Pending = {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

let _worker: Worker | null = null;
const _pending = new Map<number, Pending>();
let _nextId = 0;

function getWorker(): Worker {
  if (!_worker) {
    _worker = new CoreWorker();
    _worker.onmessage = ({ data }: MessageEvent<{ id: number; result?: unknown; error?: string }>) => {
      const p = _pending.get(data.id);
      _pending.delete(data.id);
      if (data.error !== undefined) p?.reject(new Error(data.error));
      else p?.resolve(data.result);
    };
    _worker.onerror = (e) => {
      const err = new Error(e.message ?? "Worker hiba");
      for (const p of _pending.values()) p.reject(err);
      _pending.clear();
      _worker = null;
    };
  }
  return _worker;
}

export function call<T>(fn: string, ...args: unknown[]): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = _nextId++;
    _pending.set(id, { resolve: resolve as (v: unknown) => void, reject });
    getWorker().postMessage({ id, fn, args });
  });
}
