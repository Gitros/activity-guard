export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export function short(text: string | null | undefined, max = 80) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}
