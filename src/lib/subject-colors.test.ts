import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { SUBJECTS } from "./subjects";

// WCAG AA for normal-size text.
const MIN_TEXT_CONTRAST = 4.5;
const PAGE_BACKGROUND = "#ffffff";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf-8");

function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6});`));
  if (!match) throw new Error(`Missing hex token --color-${name} in globals.css`);
  return match[1];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

describe.each(SUBJECTS.map((s) => s.slug))("%s color tokens", (slug) => {
  test("text on the subject color meets AA", () => {
    expect(contrast(token(`on-${slug}`), token(slug))).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
  });

  test("ink color on the white page meets AA", () => {
    expect(contrast(token(`${slug}-ink`), PAGE_BACKGROUND)).toBeGreaterThanOrEqual(
      MIN_TEXT_CONTRAST,
    );
  });
});

test("contrast helper matches the WCAG reference (black on white = 21:1)", () => {
  expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
});
