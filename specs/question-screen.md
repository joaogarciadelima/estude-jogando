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

All frames and the title are red, which is Matemática's theme color in `game-overview.md`. The same layout applies to every subject, with that subject's name and color. The sample question only illustrates the layout: "40%" is outside BNCC skill EF05MA06, which covers 10/25/50/75/100% only.

Decisions confirmed with the user:
- Primary device is a tablet in landscape.
- "Explicar como resolver" is available at any time, including before answering.
- A wrong answer reveals the correct answer right away.
- The keyboard is drawn by the app and appears only for typed-answer questions. Letters are in QWERTY order.
- After checking, a "Próxima" button advances to the next question (no auto-advance).
- The explanation appears in the left column, in the empty space between the question and the buttons.
- "Próxima" on the last question shows "Você terminou!" with a "Recomeçar" button.

Implementation decisions:
- "Próxima" takes the place of "Conferir resultado" in the top half of the pill, so the sketch's layout is kept.
- The Playwright iPad landscape viewport is only 944×656. For 44px keys to fit, the columns are ~36/64 (the sketch is ~40/60), no keyboard row has more than 11 keys (so `, % -` sit next to `ZXCVBNM`), and the keyboard frame is only as tall as its keys.

## Acceptance criteria

**Layout (tablet, landscape)**
- [x] Two columns. Left: subject title, question text below it, the two action buttons at the bottom. Right: answer area on top, keyboard area below it.
- [x] The subject title shows the correctly accented name (e.g. "Matemática"), and the title and frames use that subject's theme color.
- [x] Every tappable element is at least 44×44 CSS px and fits inside the iPad landscape viewport (checked in E2E).

**Answer area ("Quadro de resposta")**
- [x] Multiple-choice question: the options are listed in the answer area and the kid selects exactly one. The keyboard area is hidden and the answer area fills the right column.
- [x] Typed-answer question: the answer area shows what the kid has typed so far.

**Keyboard ("teclados")**
- [x] Shown only for typed-answer questions, rendered by the app inside the keyboard area.
- [x] Keys, QWERTY order: rows `1234567890` / `QWERTYUIOP` / `ASDFGHJKLÇ` / `ZXCVBNM,%-` / `ÁÀÂÃÉÊÍÓÔÕÚ`, then "espaço" and "apagar". Letters type lowercase.
- [x] The device's native keyboard never opens on this screen (no `<input>`/`<textarea>` is rendered).

**"Conferir resultado"**
- [x] Disabled until an option is selected or at least one character is typed.
- [x] Correct answer: the screen shows "Muito bem! Resposta certa."
- [x] Wrong answer: the screen shows "Não foi dessa vez. A resposta certa é …" immediately. The kid gets no second attempt at that question.
- [x] After checking, the answer can no longer be changed (options and keys are disabled).
- [x] After checking, "Próxima" appears and advances to the next question only when tapped.

**"Explicar como resolver"**
- [x] Enabled at all times, before or after checking. Tapping again hides it; it closes on "Próxima".
- [x] Shows the question's step-by-step explanation in pt-BR.
- [x] The explanation appears in the left column between the question and the buttons; the question and answer area stay visible.

**End of subject**
- [x] "Próxima" on the last question shows "Você terminou!" and a "Recomeçar" button that restarts from the first question.
- [x] A subject with no questions yet shows "Ainda não há questões de <matéria>."
- [x] Only the six subject routes exist (`/matematica`, `/portugues`, …); any other slug is a 404.

## Files

- `src/app/[subject]/page.tsx`: route, one statically generated page per subject.
- `src/components/question/QuestionScreen.tsx`: layout and action pill.
- `src/components/question/AnswerArea.tsx`: options, typed-answer display and feedback.
- `src/components/question/Keyboard.tsx`: the in-app keyboard.
- `src/components/question/question-state.ts`: screen state reducer.
- `src/components/question/subject-theme.ts`: subject color class names.
- Tests: colocated `*.test.tsx` files, plus `e2e/question-screen.spec.ts`.

## Out of scope

- Where questions and explanations come from (see `game-overview.md`).
- Scoring, progress, rewards and question ordering.
- Portrait and phone layouts.
- The photo summary feature.
- Navigation to a subject: the home page doesn't link to the subjects yet.

## Open questions

1. Deferred to a future game-mechanics spec: if scoring is added, does opening the explanation before answering affect the score?
