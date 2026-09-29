/** 125 → "2:05", 3725 → "1:02:05". Returns undefined for missing/invalid values. */
export function formatDuration(totalSeconds: number | undefined | null): string | undefined {
  if (totalSeconds == null || !Number.isFinite(totalSeconds) || totalSeconds < 0) return undefined;
  const s = Math.round(totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}
