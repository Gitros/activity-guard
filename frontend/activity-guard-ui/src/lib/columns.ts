export function getColumnsKey(page: string, userKey: string | null) {
  return `ag_columns_${page}_${userKey ?? "anon"}`;
}

export function loadColumns<T extends string>(
  storageKey: string,
  fallback: T[]
): T[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed.filter((x) => typeof x === "string") as T[];
  } catch {
    return fallback;
  }
}

export function saveColumns<T extends string>(storageKey: string, cols: T[]) {
  localStorage.setItem(storageKey, JSON.stringify(cols));
}
