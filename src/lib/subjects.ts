export type SubjectSlug =
  "matematica" | "portugues" | "ciencias" | "historia" | "geografia" | "ingles";

export type Subject = {
  slug: SubjectSlug;
  name: string;
  /** Every question's BNCC code must start with this. Inglês uses 6º ano skills (outside BNCC 5º ano). */
  bnccPrefix: string;
};

export const SUBJECTS: readonly Subject[] = [
  { slug: "matematica", name: "Matemática", bnccPrefix: "EF05MA" },
  { slug: "portugues", name: "Português", bnccPrefix: "EF05LP" },
  { slug: "ciencias", name: "Ciências", bnccPrefix: "EF05CI" },
  { slug: "historia", name: "História", bnccPrefix: "EF05HI" },
  { slug: "geografia", name: "Geografia", bnccPrefix: "EF05GE" },
  { slug: "ingles", name: "Inglês", bnccPrefix: "EF06LI" },
];

export function findSubject(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}
