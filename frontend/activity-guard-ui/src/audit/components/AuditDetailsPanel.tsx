import type { AuditLogDto } from "../audit.api";

type Props = {
  selected: AuditLogDto | null;
  onClear: () => void;

  formatDate: (iso: string) => string;
  short: (text: string | null | undefined, max?: number) => string;
  copyToClipboard: (text: string) => Promise<void>;

  onOpenRelatedEvents: (q: string) => void;
};

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

export default function AuditDetailsPanel({
  selected,
  onClear,
  formatDate,
  short,
  copyToClipboard,
  onOpenRelatedEvents,
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
            <DetailRow label="Status" value={String(selected.statusCode)} />
            <DetailRow label="Action" value={selected.action} />

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-zinc-500">Correlation ID</div>
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

            <div className="mt-4">
              <button
                onClick={() => {
                  const q = selected.correlationId?.trim() || selected.id;
                  onOpenRelatedEvents(q);
                }}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-500 transition cursor-pointer"
              >
                Open events for this request
              </button>
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
