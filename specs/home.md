# Home: subject list

Source: no sketch of the home page exists. The card format comes from Antonia's Ciências card, `desenhos-antonia-ideia/IMG_2886.jpeg`. Related: `specs/game-overview.md`, `specs/question-screen.md`.

## Context

`IMG_2886.jpeg` is a small card: "Ciencias" in pink marker, a decorative pink ribbon on the left, and a line in blue pen. Verbatim (original spelling kept):

> Ciencias
> Aprenda sobre plantas, constelações, corpo humano entre outras

Today the question screen is only reachable by typing `/matematica` in the address bar. The home page should let a kid pick a subject.

Decisions confirmed with the user:
- Each subject card shows the subject name and a short sentence, following the Ciências card.
- Every card links to its subject. Subjects without questions yet open the existing "Ainda não há questões de …" screen.

## Acceptance criteria

- [x] The home keeps the "Estude Jogando" title and adds the line "Escolha uma matéria para começar."
- [x] Six cards, in this order: Matemática, Português, Ciências, História, Geografia, Inglês. Each card is a single link to `/<subject>`.
- [x] Each card is filled with its subject color, with text in that subject's AA-checked `on-` color.
- [x] Each card shows the subject name and its sentence:
  - Matemática: "Pratique porcentagem, frações, números decimais e muito mais."
  - Português: "Treine leitura, escrita, pontuação e ortografia."
  - Ciências: "Aprenda sobre plantas, constelações, corpo humano, entre outras." (Antonia's sentence, with punctuation added)
  - História: "Descubra como os povos e as culturas se formaram ao longo do tempo."
  - Geografia: "Explore mapas, cidades, paisagens e o meio ambiente."
  - Inglês: "Aprenda palavras e frases do dia a dia em inglês."
- [x] On a tablet in landscape, all six cards fit on screen without scrolling (3 × 2 grid), and every card is at least 44×44 CSS px.
- [x] Tapping Matemática opens the Matemática question screen.

## Files

- `src/app/page.tsx`: the home page.
- `src/lib/subjects.ts`: gains a `description` per subject.
- `src/components/subject-theme.ts`: moved from `src/components/question/`, now that both screens use it.

## Out of scope

- A way back from the question screen to the home (specced in `specs/question-screen.md`).
- Progress or completion badges on the cards (needs game mechanics).
- Hiding or marking subjects that have no questions yet.

## Open questions

1. The five sentences other than Ciências are drafts written by Claude. They need review.
