import { useEffect, useRef, useState } from "react";

export type ColumnOption<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  options: ColumnOption<T>[];
  value: T[];
  onChange: (next: T[]) => void;

  title?: string;
  minSelected?: number;
  onReset?: () => void;
};

export default function ColumnPicker<T extends string>({
  options,
  value,
  onChange,
  title = "Columns",
  minSelected = 1,
  onReset,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggle(key: T) {
    const has = value.includes(key);

    // nie pozwól zejść poniżej minSelected
    if (has && value.length <= minSelected) return;

    const next = has ? value.filter((x) => x !== key) : [...value, key];
    onChange(next);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition"
      >
        {title}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-100">{title}</div>
            {onReset && (
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setOpen(false);
                }}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition"
              >
                Reset
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {options.map((opt) => {
              const checked = value.includes(opt.key);
              const disabled = checked && value.length <= minSelected;

              return (
                <label
                  key={opt.key}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 hover:bg-zinc-900 transition"
                >
                  <span className="text-sm text-zinc-200">{opt.label}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(opt.key)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                </label>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-zinc-500">
            Minimum selected: {minSelected}
          </div>
        </div>
      )}
    </div>
  );
}
