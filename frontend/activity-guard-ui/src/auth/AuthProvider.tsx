import { useMemo, useState } from "react";
import { AuthContext, type AuthContextValue } from "./AuthContext";
import { clearToken, getToken, setToken } from "./token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const value = useMemo<AuthContextValue>(() => {
    return {
      token,
      isAuthed: !!token,
      login: (t: string) => {
        setToken(t);
        setTokenState(t);
      },
      logout: () => {
        clearToken();
        setTokenState(null);
      },
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
