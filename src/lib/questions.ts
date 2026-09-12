import { z } from "zod";
import matematica from "../../data/questions/matematica.json";
import { findSubject, type SubjectSlug } from "./subjects";

const baseFields = {
  id: z.string().min(1),
  bncc: z.string().regex(/^EF0[56][A-Z]{2}\d{2}$/, "must be a BNCC code like EF05MA06"),
  prompt: z.string().min(1),
  explanation: z.array(z.string().min(1)).min(1),
};

const choiceQuestionSchema = z
  .strictObject({
    ...baseFields,
    type: z.literal("choice"),
    options: z.array(z.string().min(1)).min(2),
    answer: z.string().min(1),
  })
  .refine((q) => q.options.includes(q.answer), { message: "answer must be one of the options" });

const typedQuestionSchema = z.strictObject({
  ...baseFields,
  type: z.literal("typed"),
  answer: z.string().min(1),
});

const questionSchema = z.discriminatedUnion("type", [choiceQuestionSchema, typedQuestionSchema]);

export type Question = z.infer<typeof questionSchema>;

// Subjects without a file have no questions yet.
const QUESTION_FILES: Partial<Record<SubjectSlug, unknown>> = { matematica };

export function parseQuestions(slug: SubjectSlug, raw: unknown): Question[] {
  const prefix = findSubject(slug)?.bnccPrefix ?? "";
  const schema = z.array(questionSchema).superRefine((questions, ctx) => {
    const ids = new Set<string>();
    questions.forEach((q, i) => {
      if (!q.bncc.startsWith(prefix)) {
        ctx.addIssue({ code: "custom", path: [i, "bncc"], message: `must start with ${prefix}` });
      }
      if (ids.has(q.id)) {
        ctx.addIssue({ code: "custom", path: [i, "id"], message: `duplicate id "${q.id}"` });
      }
      ids.add(q.id);
    });
  });

  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid question bank for "${slug}" (data/questions/${slug}.json):\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

export function getQuestions(slug: SubjectSlug): Question[] {
  const raw = QUESTION_FILES[slug];
  return raw === undefined ? [] : parseQuestions(slug, raw);
}
