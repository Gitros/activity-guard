type SuccessFilter = "all" | "true" | "false";

type Props = {
  q: string;
  onQChange: (value: string) => void;

  eventType: string;
  onEventTypeChange: (value: string) => void;

  success: SuccessFilter;
  onSuccessChange: (value: SuccessFilter) => void;

  onApply: () => void;
  onReset: () => void;
};

export default function AuditEventFilters({
  q,
  onQChange,
  eventType,
  onEventTypeChange,
  success,
  onSuccessChange,
  onApply,
  onReset,
}: Props) {
  return (
    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-zinc-400">Search</label>
          <input
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            placeholder="email, eventType, path, correlationId..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Success</label>
          <select
            value={success}
            onChange={(e) => onSuccessChange(e.target.value as SuccessFilter)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All</option>
            <option value="true">Success</option>
            <option value="false">Failed</option>
          </select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-zinc-400">EventType</label>
          <input
            value={eventType}
            onChange={(e) => onEventTypeChange(e.target.value)}
            placeholder="DEMO_PING, DEMO_FAIL..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={onApply}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-500 transition"
          >
            Apply
          </button>

          <button
            onClick={onReset}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
