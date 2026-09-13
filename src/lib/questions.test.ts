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

  test("rejects a well-formed BNCC code that does not exist", () => {
    expect(() => parseQuestions("matematica", [{ ...validChoice, bncc: "EF05MA99" }])).toThrow(
      /EF05MA99/,
    );
  });

  test("accepts a multi-year Português code that covers 5º ano (EF35LP03)", () => {
    expect(parseQuestions("portugues", [{ ...validChoice, bncc: "EF35LP03" }])).toHaveLength(1);
  });

  test("Inglês takes 6º ano codes (EF06LI…), since the BNCC has no English before 6º ano", () => {
    expect(parseQuestions("ingles", [{ ...validChoice, bncc: "EF06LI01" }])).toHaveLength(1);
    expect(() => parseQuestions("ingles", [{ ...validChoice, bncc: "EF05MA06" }])).toThrow();
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

  test.each(SUBJECTS.map((s) => s.slug))(
    "%s has at least 4 questions, both multiple-choice and typed",
    (slug) => {
      const questions = getQuestions(slug);
      expect(questions.length).toBeGreaterThanOrEqual(4);
      expect(new Set(questions.map((q) => q.type))).toEqual(new Set(["choice", "typed"]));
    },
  );

  test("typed answers only use characters the in-app keyboard can type", () => {
    const typeable = /^[a-z0-9áàâãéêíóôõúç,%\- ]+$/;
    for (const { slug } of SUBJECTS) {
      for (const q of getQuestions(slug)) {
        if (q.type === "typed") expect(q.answer.toLowerCase(), q.id).toMatch(typeable);
      }
    }
  });
});
