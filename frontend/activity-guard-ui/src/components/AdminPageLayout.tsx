import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import DemoActionsPanel from "./DemoActionsPanel";
import AdminNavTabs from "./AdminNavTabs";

type Props = {
  title: string;
  onRefresh: () => void;
  children: ReactNode;
};

export default function AdminPageLayout({ title, onRefresh, children }: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT */}
          <h1 className="text-2xl font-semibold">{title}</h1>

          {/* CENTER */}
          <div className="flex flex-col items-center gap-3">
            <AdminNavTabs />
            <DemoActionsPanel />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
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

        {children}
      </div>
    </div>
  );
}
