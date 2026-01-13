import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { getAuditLogs, type AuditLogDto } from "../audit/audit.api";

type ApiError = { status: number; title?: string; detail?: string };

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

function short(text: string | null | undefined, max = 80) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function DetailRow({
  label,
  value,
  title,
}: {
  label: string;
  value: string;
  title?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-right text-zinc-200 break-words" title={title}>
        {value}
      </div>
    </div>
  );
}

export default function AuditLogsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [logs, setLogs] = useState<AuditLogDto[]>([]);
  const [q, setQ] = useState("");
  const [success, setSuccess] = useState<"all" | "true" | "false">("all");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AuditLogDto | null>(null);

  const successParam = useMemo(() => {
    if (success === "all") return undefined;
    return success === "true";
  }, [success]);

  async function load() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAuditLogs({
        q: q.trim() || undefined,
        success: successParam,
        take: 100,
      });
      setLogs(data);
      setSelected((prev) => {
        if (!prev) return data[0] ?? null;
        const stillThere = data.find((x) => x.id === prev.id);
        return stillThere ?? data[0] ?? null;
      });
    } catch (err) {
      const e = err as ApiError;

      if (e.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }

      setError(e.detail || e.title || `Request failed (${e.status})`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Audit Logs</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-zinc-400">Search</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="email, path, method, correlationId..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-400">
                Success
              </label>
              <select
                value={success}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setSuccess(e.target.value as any)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All</option>
                <option value="true">Success</option>
                <option value="false">Failed</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={load}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-500 transition"
            >
              Apply
            </button>

            <button
              onClick={() => {
                setQ("");
                setSuccess("all");
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* TABLE */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-zinc-300">Loading...</div>
            ) : error ? (
              <div className="p-6 text-red-200">{error}</div>
            ) : logs.length === 0 ? (
              <div className="p-6 text-zinc-300">No logs found.</div>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-zinc-950/60 text-zinc-300">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Time</th>
                      <th className="px-4 py-3 text-left font-medium">User</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Method
                      </th>
                      <th className="px-4 py-3 text-left font-medium">Path</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-medium">OK</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-800">
                    {logs.map((x) => {
                      const active = selected?.id === x.id;

                      return (
                        <tr
                          key={x.id}
                          onClick={() => setSelected(x)}
                          className={`cursor-pointer ${
                            active ? "bg-zinc-950/60" : "hover:bg-zinc-950/40"
                          }`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-zinc-200">
                            {formatDate(x.createdAt)}
                          </td>

                          <td className="px-4 py-3 text-zinc-200">
                            {x.userEmail ?? (
                              <span className="text-zinc-500">—</span>
                            )}
                          </td>

                          <td className="px-4 py-3">
                            <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-zinc-200">
                              {x.method}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-zinc-200">{x.path}</td>
                          <td className="px-4 py-3 text-zinc-200">
                            {x.statusCode}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                x.success
                                  ? "bg-emerald-500/20 text-emerald-200"
                                  : "bg-red-500/20 text-red-200"
                              }`}
                            >
                              {x.success ? "YES" : "NO"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* DETAILS PANEL */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 lg:sticky lg:top-6 h-fit">
            {!selected ? (
              <div className="text-zinc-300">Click a row to see details.</div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-zinc-100">
                      Log details
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      {formatDate(selected.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      selected.success
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "bg-red-500/20 text-red-200"
                    }`}
                  >
                    {selected.success ? "SUCCESS" : "FAILED"}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <DetailRow label="User" value={selected.userEmail ?? "—"} />
                  <DetailRow label="Method" value={selected.method} />
                  <DetailRow label="Path" value={selected.path} />
                  <DetailRow
                    label="Status"
                    value={String(selected.statusCode)}
                  />
                  <DetailRow label="Action" value={selected.action} />

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs text-zinc-500">
                          Correlation ID
                        </div>
                        <div className="mt-1 break-all text-zinc-200">
                          {selected.correlationId}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(selected.correlationId)}
                        className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <DetailRow label="IP" value={selected.ipAddress ?? "—"} />
                  <DetailRow
                    label="User-Agent"
                    value={short(selected.userAgent ?? "—", 120) || "—"}
                    title={selected.userAgent ?? undefined}
                  />
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => setSelected(null)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 transition"
                  >
                    Clear selection
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
