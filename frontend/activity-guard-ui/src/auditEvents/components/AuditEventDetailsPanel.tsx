import InfoCard from "../../components/InfoCard";
import type { AuditEventDto } from "../auditEvents.api";

type Props = {
  selected: AuditEventDto | null;
  onClear: () => void;

  formatDate: (iso: string) => string;
  short: (text: string | null | undefined, max?: number) => string;
  copyToClipboard: (text: string) => Promise<void>;

  onOpenRelatedLog: (q: string) => void;
};

export default function AuditEventDetailsPanel({
  selected,
  onClear,
  formatDate,
  short,
  copyToClipboard,
  onOpenRelatedLog,
}: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 lg:sticky lg:top-6 h-fit">
      {!selected ? (
        <div className="text-zinc-300">Click a row to see details.</div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">
                Event details
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {formatDate(selected.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <InfoCard label="EventType">{selected.eventType}</InfoCard>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <div className="text-xs text-zinc-500">AuditLogId</div>
              <div className="mt-1 break-all text-zinc-200">
                {selected.auditLogId}
              </div>
              <button
                onClick={() => copyToClipboard(selected.auditLogId)}
                className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 transition"
              >
                Copy
              </button>
            </div>

            <InfoCard label="User">{selected.userEmail ?? "—"}</InfoCard>

            <InfoCard label="Target">
              {(selected.targetType ?? "—") +
                (selected.targetId ? ` / ${selected.targetId}` : "")}
            </InfoCard>

            <InfoCard label="Metadata">
              {short(selected.metadataJson ?? "—", 300) || "—"}
            </InfoCard>

            <InfoCard label="Request">
              <div className="text-zinc-200">
                {selected.method ?? "—"} {selected.path ?? ""}
              </div>
              <div className="mt-1 text-zinc-400 text-xs">
                Status: {selected.statusCode ?? "—"} | OK:{" "}
                {selected.logSuccess == null
                  ? "—"
                  : selected.logSuccess
                  ? "YES"
                  : "NO"}
              </div>
            </InfoCard>

            <button
              onClick={() => {
                const q = selected.correlationId?.trim() || selected.auditLogId;
                onOpenRelatedLog(q);
              }}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-500 transition"
            >
              Open related request log
            </button>

            {selected.correlationId && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-zinc-500">Correlation ID</div>
                    <div className="mt-1 break-all text-zinc-200">
                      {selected.correlationId}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selected.correlationId!)}
                    className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 transition"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5">
            <button
              onClick={onClear}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 transition"
            >
              Clear selection
            </button>
          </div>
        </>
      )}
    </div>
  );
}
