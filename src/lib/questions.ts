import { z } from "zod";
import bnccSkills from "../../data/bncc/habilidades.json";
import ciencias from "../../data/questions/ciencias.json";
import geografia from "../../data/questions/geografia.json";
import historia from "../../data/questions/historia.json";
import ingles from "../../data/questions/ingles.json";
import matematica from "../../data/questions/matematica.json";
import portugues from "../../data/questions/portugues.json";
import { findSubject, type SubjectSlug } from "./subjects";

const baseFields = {
  id: z.string().min(1),
  bncc: z.string().min(1),
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

// Vendored from bncc-dados (see data/bncc/README.md).
const SKILLS = new Map(bnccSkills.map((s) => [s.codigo, s]));

// One file per subject; Record makes TypeScript require every subject.
const QUESTION_FILES: Record<SubjectSlug, unknown> = {
  matematica,
  portugues,
  ciencias,
  historia,
  geografia,
  ingles,
};

function bnccProblem(slug: SubjectSlug, code: string): string | undefined {
  const subject = findSubject(slug);
  const skill = SKILLS.get(code);
  if (!subject) return `unknown subject "${slug}"`;
  if (!skill) return `${code} is not a BNCC skill listed in data/bncc/habilidades.json`;
  const { component, year } = subject.bncc;
  if (skill.componente !== component || !skill.anos.includes(year)) {
    return `${code} is not a ${subject.name} skill for ${year}º ano`;
  }
  return undefined;
}

export function parseQuestions(slug: SubjectSlug, raw: unknown): Question[] {
  const schema = z.array(questionSchema).superRefine((questions, ctx) => {
    const ids = new Set<string>();
    questions.forEach((q, i) => {
      const problem = bnccProblem(slug, q.bncc);
      if (problem) ctx.addIssue({ code: "custom", path: [i, "bncc"], message: problem });
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
  return parseQuestions(slug, QUESTION_FILES[slug]);
}
