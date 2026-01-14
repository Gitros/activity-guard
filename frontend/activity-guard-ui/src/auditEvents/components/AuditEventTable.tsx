import type { AuditEventDto } from "../auditEvents.api";

export type AuditEventColumn =
  | "time"
  | "event"
  | "user"
  | "method"
  | "path"
  | "ok"
  | "correlationId";

type Props = {
  events: AuditEventDto[];
  selectedId: string | null;

  isLoading: boolean;
  error: string | null;

  onSelect: (ev: AuditEventDto) => void;
  formatDate: (iso: string) => string;

  columns: AuditEventColumn[];
};

export default function AuditEventTable({
  events,
  selectedId,
  isLoading,
  error,
  onSelect,
  formatDate,
  columns,
}: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      {isLoading ? (
        <div className="p-6 text-zinc-300">Loading...</div>
      ) : error ? (
        <div className="p-6 text-red-200">{error}</div>
      ) : events.length === 0 ? (
        <div className="p-6 text-zinc-300">No events found.</div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-950/60 text-zinc-300">
              <tr>
                {columns.includes("time") && (
                  <th className="px-4 py-3 text-left font-medium">Time</th>
                )}
                {columns.includes("event") && (
                  <th className="px-4 py-3 text-left font-medium">Event</th>
                )}
                {columns.includes("user") && (
                  <th className="px-4 py-3 text-left font-medium">User</th>
                )}
                {columns.includes("method") && (
                  <th className="px-4 py-3 text-left font-medium">Method</th>
                )}
                {columns.includes("path") && (
                  <th className="px-4 py-3 text-left font-medium">Path</th>
                )}
                {columns.includes("ok") && (
                  <th className="px-4 py-3 text-left font-medium">OK</th>
                )}
                {columns.includes("correlationId") && (
                  <th className="px-4 py-3 text-left font-medium">
                    Correlation
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {events.map((x) => {
                const active = selectedId === x.id;

                return (
                  <tr
                    key={x.id}
                    onClick={() => onSelect(x)}
                    className={`cursor-pointer ${
                      active ? "bg-zinc-950/60" : "hover:bg-zinc-950/40"
                    }`}
                  >
                    {columns.includes("time") && (
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-200">
                        {formatDate(x.createdAt)}
                      </td>
                    )}

                    {columns.includes("event") && (
                      <td className="px-4 py-3 text-zinc-200">
                        <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1">
                          {x.eventType}
                        </span>
                      </td>
                    )}

                    {columns.includes("user") && (
                      <td className="px-4 py-3 text-zinc-200">
                        {x.userEmail ?? (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>
                    )}

                    {columns.includes("method") && (
                      <td className="px-4 py-3 text-zinc-200">
                        {x.method ? (
                          <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1">
                            {x.method}
                          </span>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>
                    )}

                    {columns.includes("path") && (
                      <td className="px-4 py-3 text-zinc-200">
                        {x.path ?? <span className="text-zinc-500">—</span>}
                      </td>
                    )}

                    {columns.includes("ok") && (
                      <td className="px-4 py-3">
                        {x.logSuccess == null ? (
                          <span className="text-zinc-500">—</span>
                        ) : (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              x.logSuccess
                                ? "bg-emerald-500/20 text-emerald-200"
                                : "bg-red-500/20 text-red-200"
                            }`}
                          >
                            {x.logSuccess ? "YES" : "NO"}
                          </span>
                        )}
                      </td>
                    )}

                    {columns.includes("correlationId") && (
                      <td className="px-4 py-3 text-zinc-200 font-mono text-xs">
                        {x.correlationId ? (
                          x.correlationId.slice(0, 8) + "…"
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
