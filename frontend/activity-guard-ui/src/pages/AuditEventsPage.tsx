import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  getAuditEvents,
  type AuditEventDto,
} from "../auditEvents/auditEvents.api";

import AdminPageLayout from "../components/AdminPageLayout";
import AuditEventFilters from "../auditEvents/components/AuditEventFilters";
import AuditEventTable, {
  type AuditEventColumn,
} from "../auditEvents/components/AuditEventTable";
import AuditEventDetailsPanel from "../auditEvents/components/AuditEventDetailsPanel";

import { formatDate, short } from "../audit/utils";
import { copyToClipboard } from "../lib/clipboard";

import ColumnPicker, { type ColumnOption } from "../components/ColumnPicker";
import { loadColumns, saveColumns } from "../lib/columns";

const DEFAULT_EVENT_COLS: AuditEventColumn[] = [
  "time",
  "event",
  "user",
  "method",
  "path",
  "ok",
];

const EVENT_COL_OPTIONS: ColumnOption<AuditEventColumn>[] = [
  { key: "time", label: "Time" },
  { key: "event", label: "Event" },
  { key: "user", label: "User" },
  { key: "method", label: "Method" },
  { key: "path", label: "Path" },
  { key: "ok", label: "OK" },
  { key: "correlationId", label: "Correlation ID" },
];

type ApiError = { status: number; title?: string; detail?: string };

export default function AuditEventsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const columnsStorageKey = "ag_columns_auditEvents";

  // ✅ wczytujemy od razu (bez dodatkowego effecta)
  const [columns, setColumns] = useState<AuditEventColumn[]>(() =>
    loadColumns(columnsStorageKey, DEFAULT_EVENT_COLS)
  );

  useEffect(() => {
    saveColumns(columnsStorageKey, columns);
  }, [columnsStorageKey, columns]);

  const [events, setEvents] = useState<AuditEventDto[]>([]);
  const [q, setQ] = useState("");
  const [eventType, setEventType] = useState("");
  const [success, setSuccess] = useState<"all" | "true" | "false">("all");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AuditEventDto | null>(null);

  const successParam = useMemo(() => {
    if (success === "all") return undefined;
    return success === "true";
  }, [success]);

  async function load() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAuditEvents({
        q: q.trim() || undefined,
        eventType: eventType.trim() || undefined,
        success: successParam,
        take: 200,
      });

      setEvents(data);
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

    const handler = () => load();
    window.addEventListener("audit:updated", handler);
    return () => window.removeEventListener("audit:updated", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminPageLayout title="Audit Events" onRefresh={load}>
      <div className="mt-6 flex justify-end">
        <ColumnPicker
          title="Columns"
          options={EVENT_COL_OPTIONS}
          value={columns}
          onChange={setColumns}
          minSelected={3}
          onReset={() => setColumns(DEFAULT_EVENT_COLS)}
        />
      </div>

      <AuditEventFilters
        q={q}
        onQChange={setQ}
        eventType={eventType}
        onEventTypeChange={setEventType}
        success={success}
        onSuccessChange={setSuccess}
        onApply={load}
        onReset={() => {
          setQ("");
          setEventType("");
          setSuccess("all");
        }}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <AuditEventTable
          events={events}
          selectedId={selected?.id ?? null}
          isLoading={isLoading}
          error={error}
          onSelect={setSelected}
          formatDate={formatDate}
          columns={columns}
        />

        <AuditEventDetailsPanel
          selected={selected}
          onClear={() => setSelected(null)}
          formatDate={formatDate}
          short={short}
          copyToClipboard={copyToClipboard}
          onOpenRelatedLog={(qq) =>
            navigate(`/audit-logs?q=${encodeURIComponent(qq)}`)
          }
        />
      </div>
    </AdminPageLayout>
  );
}
