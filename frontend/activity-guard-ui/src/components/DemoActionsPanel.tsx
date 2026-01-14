import { useState } from "react";
import { demoAdminOnly, demoFail, demoPing } from "../demo/demo.api";
import { emitAuditUpdated } from "../lib/events";

type Result =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { ok: true; status: number; body?: any }
  | { ok: false; status: number; message: string };

export default function DemoActionsPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function run(fn: () => Promise<any>) {
    setIsRunning(true);
    setResult(null);

    try {
      const res = await fn();
      setResult({ ok: true, status: 200, body: res });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const status = err?.status ?? 0;
      const message = err?.detail || err?.title || "Request failed";
      setResult({ ok: false, status, message });
    } finally {
      setIsRunning(false);
      emitAuditUpdated();
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 h-[260px] flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">
            Demo actions
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Kliknij, żeby wygenerować log + event (Ping / Fail / Admin-only).
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button
          disabled={isRunning}
          onClick={() => run(demoPing)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          PING (200)
        </button>

        <button
          disabled={isRunning}
          onClick={() => run(demoFail)}
          className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          FAIL (400)
        </button>

        <button
          disabled={isRunning}
          onClick={() => run(demoAdminOnly)}
          className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          ADMIN-ONLY
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-auto">
        {result ? (
          <div
            className={`rounded-xl border px-3 py-2 text-sm ${
              result.ok
                ? "border-emerald-900/50 bg-emerald-950/30 text-emerald-200"
                : "border-red-900/50 bg-red-950/30 text-red-200"
            }`}
          >
            {result.ok ? (
              <div className="break-words">
                <div className="font-medium">OK</div>
                <div className="text-xs opacity-80">
                  Status: {result.status}
                </div>
                {result.body ? (
                  <pre className="mt-2 max-h-40 overflow-auto text-xs text-zinc-200">
                    {JSON.stringify(result.body, null, 2)}
                  </pre>
                ) : null}
              </div>
            ) : (
              <div className="break-words">
                <div className="font-medium">ERROR</div>
                <div className="text-xs opacity-80">
                  Status: {result.status}
                </div>
                <div className="mt-1">{result.message}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full rounded-xl border border-zinc-800 bg-zinc-950/40" />
        )}
      </div>
    </div>
  );
}
