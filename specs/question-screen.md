# Question screen

Source: `desenhos-antonia-ideia/IMG_2885.jpeg`. Related: `specs/game-overview.md`.

## Context

A landscape wireframe of the screen where the kid answers one question, drawn for Matemática. Verbatim (original spelling kept):

| Element | Text |
|---|---|
| Title, top left, large red marker | "Matematica" |
| Question, below title | "Calcule 40% de 584." |
| Big frame, top right | "Quadro de resposta / multipla escolha" |
| Frame, bottom right | "teclados" |
| Two-part pill button, bottom left (top half) | "Conferir resultado" |
| Two-part pill button, bottom left (bottom half) | "Explicar como resolver" |

All frames and the title are red, which is Matemática's theme color in `game-overview.md`. The same layout is assumed to apply to every subject, with that subject's name and color. The sample question only illustrates the layout: "40%" is outside BNCC skill EF05MA06, which covers 10/25/50/75/100% only.

Decisions confirmed with the user:
- Primary device is a tablet in landscape.
- "Explicar como resolver" is available at any time, including before answering.
- A wrong answer reveals the correct answer right away.
- The keyboard is drawn by the app and appears only for typed-answer questions.
- After checking, a "Próxima" button advances to the next question (no auto-advance).
- The explanation appears in the left column, in the empty space between the question and the buttons.

## Acceptance criteria

**Layout (tablet, landscape)**
- [ ] Two columns. Left: subject title, question text below it, the two action buttons at the bottom. Right: answer area on top (~60%), keyboard area below (~40%).
- [ ] The subject title shows the correctly accented name (e.g. "Matemática"), and the title and frames use that subject's theme color.
- [ ] Every tappable element is at least 44×44 CSS px.

**Answer area ("Quadro de resposta")**
- [ ] Multiple-choice question: the options are listed in the answer area and the kid selects exactly one. The keyboard area is hidden and the answer area fills the right column.
- [ ] Typed-answer question: the answer area shows what the kid has typed so far.

**Keyboard ("teclados")**
- [ ] Shown only for typed-answer questions, rendered by the app inside the keyboard area.
- [ ] Keys: A–Z, 0–9, delete, space, "," (pt-BR decimals), "%", "-", and accented letters á à â ã é ê í ó ô õ ú ç.
- [ ] The device's native keyboard never opens on this screen.

**"Conferir resultado"**
- [ ] (Proposed) Disabled until an option is selected or at least one character is typed.
- [ ] Correct answer: the screen shows clear positive feedback.
- [ ] Wrong answer: the screen marks it wrong and shows the correct answer immediately. The kid gets no second attempt at that question.
- [ ] After checking, the answer can no longer be changed.
- [ ] After checking, a "Próxima" button appears and advances to the next question only when tapped.

**"Explicar como resolver"**
- [ ] Enabled at all times, before or after checking.
- [ ] Shows a step-by-step explanation in pt-BR, written at a 5th-grade level, for that specific question.
- [ ] The explanation appears in the left column between the question and the buttons; the question and answer area stay visible.

## Files

TBD — no code yet.

## Out of scope

- Where questions and explanations come from (see `game-overview.md` open question 1).
- Scoring, progress, rewards and question ordering.
- Portrait and phone layouts.
- The photo summary feature.

## Open questions

1. Deferred to a future game-mechanics spec: if scoring is added, does opening the explanation before answering affect the score?
