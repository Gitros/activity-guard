import { apiFetch } from "../lib/api";

export type AuditLogDto = {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  path: string;
  method: string;
  statusCode: number;
  success: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  correlationId: string;
  createdAt: string;
};

export async function getAuditLogs(params?: {
  q?: string;
  success?: boolean;
  take?: number;
}): Promise<AuditLogDto[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.success !== undefined) qs.set("success", String(params.success));
  qs.set("take", String(params?.take ?? 100));

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AuditLogDto[]>(`/audit-logs${suffix}`);
}
