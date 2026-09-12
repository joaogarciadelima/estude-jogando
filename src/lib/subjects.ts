export type SubjectSlug =
  "matematica" | "portugues" | "ciencias" | "historia" | "geografia" | "ingles";

export type Subject = {
  slug: SubjectSlug;
  name: string;
  /** Every question's BNCC code must start with this. Inglês uses 6º ano skills (outside BNCC 5º ano). */
  bnccPrefix: string;
  /** Home card sentence (specs/home.md). */
  description: string;
};

export const SUBJECTS: readonly Subject[] = [
  {
    slug: "matematica",
    name: "Matemática",
    bnccPrefix: "EF05MA",
    description: "Pratique porcentagem, frações, números decimais e muito mais.",
  },
  {
    slug: "portugues",
    name: "Português",
    bnccPrefix: "EF05LP",
    description: "Treine leitura, escrita, pontuação e ortografia.",
  },
  {
    slug: "ciencias",
    name: "Ciências",
    bnccPrefix: "EF05CI",
    // Antonia's sentence from IMG_2886, with punctuation added.
    description: "Aprenda sobre plantas, constelações, corpo humano, entre outras.",
  },
  {
    slug: "historia",
    name: "História",
    bnccPrefix: "EF05HI",
    description: "Descubra como os povos e as culturas se formaram ao longo do tempo.",
  },
  {
    slug: "geografia",
    name: "Geografia",
    bnccPrefix: "EF05GE",
    description: "Explore mapas, cidades, paisagens e o meio ambiente.",
  },
  {
    slug: "ingles",
    name: "Inglês",
    bnccPrefix: "EF06LI",
    description: "Aprenda palavras e frases do dia a dia em inglês.",
  },
];

export function findSubject(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}
