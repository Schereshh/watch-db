export function formatVoteCount(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatVoteAverage(value: number): string {
  return value > 0 ? value.toFixed(1) : "N/A";
}

export function formatRuntime(minutes: number | null): string {
  if (minutes === null) return "Unknown runtime";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatReleaseDate(value: string): string {
  if (!value) return "Unknown release";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatLanguage(value: string): string {
  if (!value) return "Unknown";

  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
    return displayNames.of(value) ?? value.toUpperCase();
  } catch {
    return value.toUpperCase();
  }
}