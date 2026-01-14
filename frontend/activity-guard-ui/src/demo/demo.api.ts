import { apiPost } from "../lib/api";

export async function demoPing() {
  return apiPost<{ message: string }>("/demo/ping", {});
}

export async function demoFail() {
  return apiPost("/demo/fail", {});
}

export async function demoAdminOnly() {
  return apiPost<{ message: string }>("/demo/admin-only", {});
}
