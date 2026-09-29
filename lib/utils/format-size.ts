const UNITS = ["B", "KB", "MB", "GB", "TB"];

/** 42_000_000 → "40 MB". Returns undefined for missing/invalid sizes. */
export function formatSize(bytes: number | undefined | null): string | undefined {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return undefined;
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit++;
  }
  const rounded = value >= 100 || unit <= 1 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${UNITS[unit]}`;
}
