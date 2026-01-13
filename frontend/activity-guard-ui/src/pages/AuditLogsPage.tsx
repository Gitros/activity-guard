import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function AuditLogsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Audit Logs</h1>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-300">
            Tu za chwilę wrzucimy tabelę z logami z backendu.
          </p>
        </div>
      </div>
    </div>
  );
}
