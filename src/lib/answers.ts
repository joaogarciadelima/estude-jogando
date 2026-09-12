/**
 * Lenient comparison for typed answers (specs/game-overview.md):
 * case-insensitive, accent-insensitive, "," or "." as decimal separator,
 * leading/trailing/repeated spaces ignored.
 */
export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/,/g, ".")
    .trim()
    .replace(/\s+/g, " ");
}

export function isCorrectAnswer(given: string, expected: string): boolean {
  return normalizeAnswer(given) === normalizeAnswer(expected);
}
