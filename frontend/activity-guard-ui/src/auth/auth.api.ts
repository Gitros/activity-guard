import { apiFetch } from "../lib/api";

export type RegisterRequest = { email: string; password: string };
export type LoginRequest = { email: string; password: string };
export type AuthResponse = { token: string };

export async function register(request: RegisterRequest): Promise<void> {
  await apiFetch<void>("/auth/register", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
