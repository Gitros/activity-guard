import { NavLink } from "react-router-dom";

type Tab = {
  label: string;
  to: string;
};

const tabs: Tab[] = [
  { label: "Audit logs", to: "/audit-logs" },
  { label: "Event logs", to: "/audit-events" },
];

export default function AdminNavTabs() {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex rounded-2xl border border-zinc-800 bg-zinc-900/80 p-1 shadow-xl">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              [
                "px-4 py-2 text-sm rounded-xl transition",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950",
                isActive
                  ? "bg-zinc-950 text-zinc-100 border border-zinc-800"
                  : "text-zinc-300 hover:text-zinc-100 hover:bg-zinc-950/40",
              ].join(" ")
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
