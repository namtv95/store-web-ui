export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function normalize(value: unknown): string {
  return String(value ?? "").toLowerCase();
}
