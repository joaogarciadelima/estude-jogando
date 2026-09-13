export type SubjectSlug =
  "matematica" | "portugues" | "ciencias" | "historia" | "geografia" | "ingles";

export type Subject = {
  slug: SubjectSlug;
  name: string;
  /**
   * BNCC component (bncc-dados id) and school year every question's skill must belong to.
   * Inglês uses 6º ano: the BNCC has no English before 6º ano.
   */
  bncc: { component: string; year: number };
  /** Home card sentence (specs/home.md). */
  description: string;
};

export const SUBJECTS: readonly Subject[] = [
  {
    slug: "matematica",
    name: "Matemática",
    bncc: { component: "ef-comp-ma", year: 5 },
    description: "Pratique porcentagem, frações, números decimais e muito mais.",
  },
  {
    slug: "portugues",
    name: "Português",
    bncc: { component: "ef-comp-lp", year: 5 },
    description: "Treine leitura, escrita, pontuação e ortografia.",
  },
  {
    slug: "ciencias",
    name: "Ciências",
    bncc: { component: "ef-comp-ci", year: 5 },
    // Antonia's sentence from IMG_2886, with punctuation added.
    description: "Aprenda sobre plantas, constelações, corpo humano, entre outras.",
  },
  {
    slug: "historia",
    name: "História",
    bncc: { component: "ef-comp-hi", year: 5 },
    description: "Descubra como os povos e as culturas se formaram ao longo do tempo.",
  },
  {
    slug: "geografia",
    name: "Geografia",
    bncc: { component: "ef-comp-ge", year: 5 },
    description: "Explore mapas, cidades, paisagens e o meio ambiente.",
  },
  {
    slug: "ingles",
    name: "Inglês",
    bncc: { component: "ef-comp-li", year: 6 },
    description: "Aprenda palavras e frases do dia a dia em inglês.",
  },
];

export function findSubject(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}
