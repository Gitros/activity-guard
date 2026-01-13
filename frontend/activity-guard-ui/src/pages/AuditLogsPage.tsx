import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { getAuditLogs, type AuditLogDto } from "../audit/audit.api";
import { formatDate, short } from "../audit/utils";
import { copyToClipboard } from "../lib/clipboard";
import AuditFilters from "../audit/components/AuditFilters";
import AuditTable from "../audit/components/AuditTable";
import AuditDetailsPanel from "../audit/components/AuditDetailsPanel";

type ApiError = { status: number; title?: string; detail?: string };

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

        <AuditFilters
          q={q}
          onQChange={setQ}
          success={success}
          onSuccessChange={setSuccess}
          onApply={load}
          onReset={() => {
            setQ("");
            setSuccess("all");
          }}
        />

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <AuditTable
            logs={logs}
            selectedId={selected?.id ?? null}
            isLoading={isLoading}
            error={error}
            onSelect={setSelected}
            formatDate={formatDate}
          />

          {/* DETAILS PANEL */}
          <AuditDetailsPanel
            selected={selected}
            onClear={() => setSelected(null)}
            formatDate={formatDate}
            short={short}
            copyToClipboard={copyToClipboard}
          />
        </div>
      </div>
    </div>
  );
}
