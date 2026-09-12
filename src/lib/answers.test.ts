import { describe, expect, test } from "vitest";
import { isCorrectAnswer, normalizeAnswer } from "./answers";

describe("normalizeAnswer", () => {
  test.each([
    ["  historia ", "historia"],
    ["História", "historia"],
    ["CORAÇÃO", "coracao"],
    ["233,6", "233.6"],
    ["são   paulo", "sao paulo"],
  ])("%j -> %j", (input, expected) => {
    expect(normalizeAnswer(input)).toBe(expected);
  });
});

describe("isCorrectAnswer", () => {
  test("ignores case, accents and extra spaces (spec example)", () => {
    expect(isCorrectAnswer("  historia ", "História")).toBe(true);
  });

  test("accepts dot or comma as decimal separator (spec example)", () => {
    expect(isCorrectAnswer("233.6", "233,6")).toBe(true);
    expect(isCorrectAnswer("233,6", "233,6")).toBe(true);
  });

  test("rejects a different answer", () => {
    expect(isCorrectAnswer("233,7", "233,6")).toBe(false);
  });

  test("rejects an empty answer", () => {
    expect(isCorrectAnswer("   ", "35")).toBe(false);
  });
});
