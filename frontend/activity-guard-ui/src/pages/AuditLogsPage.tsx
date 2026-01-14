import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { getAuditLogs, type AuditLogDto } from "../audit/audit.api";
import { formatDate, short } from "../audit/utils";
import { copyToClipboard } from "../lib/clipboard";
import AuditFilters from "../audit/components/AuditFilters";
import AuditTable, {
  type AuditLogColumn,
} from "../audit/components/AuditTable";
import AuditDetailsPanel from "../audit/components/AuditDetailsPanel";
import AdminPageLayout from "../components/AdminPageLayout";
import ColumnPicker, { type ColumnOption } from "../components/ColumnPicker";
import { loadColumns, saveColumns } from "../lib/columns";

const DEFAULT_COLS: AuditLogColumn[] = [
  "time",
  "user",
  "method",
  "path",
  "status",
  "ok",
];

const COL_OPTIONS: ColumnOption<AuditLogColumn>[] = [
  { key: "time", label: "Time" },
  { key: "user", label: "User" },
  { key: "method", label: "Method" },
  { key: "path", label: "Path" },
  { key: "correlationId", label: "Correlation ID" },
  { key: "status", label: "Status" },
  { key: "ok", label: "OK" },
];

type ApiError = { status: number; title?: string; detail?: string };

export default function AuditLogsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { logout } = useAuth();

  const columnsStorageKey = "ag_columns_auditLogs";

  const [columns, setColumns] = useState<AuditLogColumn[]>(DEFAULT_COLS);

  const [logs, setLogs] = useState<AuditLogDto[]>([]);
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");
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

  // ✅ 1) przy zmianie userKey / storageKey wczytaj kolumny dla danego usera
  useEffect(() => {
    setColumns(loadColumns(columnsStorageKey, DEFAULT_COLS));
  }, [columnsStorageKey]);

  // ✅ 2) zapisuj zmiany kolumn do localStorage
  useEffect(() => {
    saveColumns(columnsStorageKey, columns);
  }, [columnsStorageKey, columns]);

  // ✅ 3) initial load + auto-refresh po demo actions
  useEffect(() => {
    load();

    const handler = () => load();
    window.addEventListener("audit:updated", handler);
    return () => window.removeEventListener("audit:updated", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminPageLayout title="Audit Logs" onRefresh={load}>
      <div className="mt-6 flex justify-end">
        <ColumnPicker
          title="Columns"
          options={COL_OPTIONS}
          value={columns}
          onChange={setColumns}
          minSelected={3}
          onReset={() => setColumns(DEFAULT_COLS)}
        />
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <AuditTable
          logs={logs}
          selectedId={selected?.id ?? null}
          isLoading={isLoading}
          error={error}
          onSelect={setSelected}
          formatDate={formatDate}
          columns={columns}
        />

        <AuditDetailsPanel
          selected={selected}
          onClear={() => setSelected(null)}
          formatDate={formatDate}
          short={short}
          copyToClipboard={copyToClipboard}
          onOpenRelatedEvents={(q) =>
            navigate(`/audit-events?q=${encodeURIComponent(q)}`)
          }
        />
      </div>
    </AdminPageLayout>
  );
}
