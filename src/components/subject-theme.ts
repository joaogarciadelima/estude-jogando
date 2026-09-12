import type { SubjectSlug } from "@/lib/subjects";

export type SubjectTheme = {
  /** Frames and borders. */
  border: string;
  /** Text on the white page (AA-checked). */
  ink: string;
  /** Filled surface with its AA-checked text color. */
  fill: string;
};

// Full literal class names so Tailwind can find them when scanning the source.
export const SUBJECT_THEME: Record<SubjectSlug, SubjectTheme> = {
  matematica: {
    border: "border-matematica",
    ink: "text-matematica-ink",
    fill: "bg-matematica text-on-matematica",
  },
  portugues: {
    border: "border-portugues",
    ink: "text-portugues-ink",
    fill: "bg-portugues text-on-portugues",
  },
  ciencias: {
    border: "border-ciencias",
    ink: "text-ciencias-ink",
    fill: "bg-ciencias text-on-ciencias",
  },
  historia: {
    border: "border-historia",
    ink: "text-historia-ink",
    fill: "bg-historia text-on-historia",
  },
  geografia: {
    border: "border-geografia",
    ink: "text-geografia-ink",
    fill: "bg-geografia text-on-geografia",
  },
  ingles: { border: "border-ingles", ink: "text-ingles-ink", fill: "bg-ingles text-on-ingles" },
};
