import { describe, expect, test } from "vitest";
import { getQuestions, parseQuestions } from "./questions";
import { SUBJECTS } from "./subjects";

const validChoice = {
  id: "ma-test-1",
  type: "choice",
  bncc: "EF05MA06",
  prompt: "Quanto é 50% de 10?",
  options: ["5", "10"],
  answer: "5",
  explanation: ["50% é a metade.", "10 ÷ 2 = 5."],
};

describe("parseQuestions", () => {
  test("accepts a valid question", () => {
    expect(parseQuestions("matematica", [validChoice])).toHaveLength(1);
  });

  test("rejects a choice question whose answer is not an option", () => {
    expect(() => parseQuestions("matematica", [{ ...validChoice, answer: "7" }])).toThrow(
      /matematica/,
    );
  });

  test("rejects a BNCC code from another subject", () => {
    expect(() => parseQuestions("matematica", [{ ...validChoice, bncc: "EF05LP01" }])).toThrow();
  });

  test("rejects unknown fields", () => {
    expect(() => parseQuestions("matematica", [{ ...validChoice, extra: true }])).toThrow();
  });

  test("rejects duplicate ids", () => {
    expect(() => parseQuestions("matematica", [validChoice, validChoice])).toThrow();
  });

  test("requires an explanation", () => {
    expect(() => parseQuestions("matematica", [{ ...validChoice, explanation: [] }])).toThrow();
  });
});

describe("question bank", () => {
  test.each(SUBJECTS.map((s) => s.slug))("%s loads without validation errors", (slug) => {
    expect(() => getQuestions(slug)).not.toThrow();
  });

  test("matematica has both multiple-choice and typed questions", () => {
    const types = new Set(getQuestions("matematica").map((q) => q.type));
    expect(types).toEqual(new Set(["choice", "typed"]));
  });

  test("subjects without a question file return an empty list", () => {
    expect(getQuestions("ingles")).toEqual([]);
  });
});
