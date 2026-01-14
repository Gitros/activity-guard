import { apiFetch } from "../lib/api";

export type AuditEventDto = {
  id: string;
  auditLogId: string;
  eventType: string;
  userEmail?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  metadataJson?: string | null;
  createdAt: string;

  path?: string | null;
  method?: string | null;
  statusCode?: number | null;
  logSuccess?: boolean | null;
  correlationId?: string | null;
};

export type GetAuditEventsParams = {
  q?: string;
  eventType?: string;
  success?: boolean;
  take?: number;
};

export async function getAuditEvents(params: GetAuditEventsParams) {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.eventType) qs.set("eventType", params.eventType);
  if (params.success !== undefined) qs.set("success", String(params.success));
  if (params.take) qs.set("take", String(params.take));

  return apiFetch<AuditEventDto[]>(`/audit-events?${qs.toString()}`);
}
