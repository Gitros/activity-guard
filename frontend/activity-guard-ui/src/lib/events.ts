export const AUDIT_UPDATED_EVENT = "audit:updated";

export function emitAuditUpdated() {
  window.dispatchEvent(new Event(AUDIT_UPDATED_EVENT));
}
