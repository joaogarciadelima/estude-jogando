import { beforeEach, describe, expect, test } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  hasValidConsent,
  isAdultBirthYear,
  revokeConsent,
  saveConsent,
} from "./consent";

const NOW = new Date("2026-09-13T12:00:00-03:00");

describe("isAdultBirthYear", () => {
  test.each([
    ["1985", true],
    ["2008", true], // turns 18 in 2026
    ["2009", false],
    ["2015", false],
    ["1899", false],
    ["85", false],
    ["abcd", false],
    ["", false],
  ])("%j -> %s", (input, expected) => {
    expect(isAdultBirthYear(input, NOW)).toBe(expected);
  });
});

describe("consent storage", () => {
  beforeEach(() => localStorage.clear());

  test("no consent by default", () => {
    expect(hasValidConsent(localStorage)).toBe(false);
  });

  test("saved consent is valid and records version and date", () => {
    saveConsent(localStorage, NOW);
    expect(hasValidConsent(localStorage)).toBe(true);
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? "{}")).toEqual({
      version: CONSENT_VERSION,
      acceptedAt: NOW.toISOString(),
    });
  });

  test("consent for an older notice version is not valid", () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ version: "2000-01-01", acceptedAt: NOW.toISOString() }),
    );
    expect(hasValidConsent(localStorage)).toBe(false);
  });

  test("corrupted storage is treated as no consent", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "{not json");
    expect(hasValidConsent(localStorage)).toBe(false);
  });

  test("revoking removes the consent", () => {
    saveConsent(localStorage, NOW);
    revokeConsent(localStorage);
    expect(hasValidConsent(localStorage)).toBe(false);
  });
});
