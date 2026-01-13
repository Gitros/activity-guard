import { useState } from "react";

type AuthMode = "login" | "register";

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  return (
    <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-zinc-100">
          {mode === "login" ? "Sign in" : "Create account"}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          {mode === "login"
            ? "Access your ActivityGuard account"
            : "Create a new ActivityGuard account"}
        </p>
      </div>
      <form className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Password</label>
          <input
            type="password"
            placeholder="*******"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-zinc-950 cursor-pointer transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      {/* Switch mode */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-sm text-zinc-400 transition hover:text-zinc-200 cursor-pointer"
        >
          {mode === "login"
            ? "Don't have an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
