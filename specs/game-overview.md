# Game overview

Source: `desenhos-antonia-ideia/descricao-jogo-antonia.jpeg` (formerly `IMG_2887.jpeg`).

## Context

Antonia's handwritten requirements note for the whole game. Verbatim (original spelling kept):

> Quero que o jogo tenha essas materias:
> Matematica, Português, Ciencias, História, geografia, inglês
> O jogo sera feito para o quinto ano.
> Que tenha como digitar letras e numeros.
> Que se eu mandar foto de texto, ele resume e me explica.
> Que tenha questões de multipla escolha.

Each subject is underlined in its own color: Matemática red, Português orange, Ciências pink, História green, Geografia blue, Inglês yellow. Decisions confirmed with the user:
- The underline colors are the subjects' UI colors.
- "Digitar letras e numeros" means typed-answer questions, alongside multiple choice.
- Content follows the BNCC for 5º ano.
- There is one flat difficulty level per subject.
- Inglês questions and answers are in English; instructions, feedback and explanations are in pt-BR.
- Typed answers are checked leniently (case, accents, decimal separator, extra spaces). Accentuation is therefore never tested through typed answers; this is accepted.
- Inglês stays, even though the BNCC has no English for 5º ano (Língua Inglesa starts in 6º ano). Inglês questions use 6º ano skills (EF06LI…) and are marked as outside BNCC 5º ano.
- The question bank is original content: AI drafts the questions and explanations, and an adult reviews them before they are committed.

### Content sources (researched 2026-09-12)

No Brazilian source of 5º ano questions is both open and redistributable:
- INEP/Saeb items are CC BY-ND (no adaptations allowed).
- OBMEP, OBA and Canguru have no open license ("todos os direitos reservados" by default, Lei 9.610 art. 29).
- Prova São Paulo is CC BY-NC-SA, but many of its items quote third-party texts.

These may be used as style and difficulty references only; none of their wording goes into the repo.

The one open asset is the BNCC skill list. [bncc-dados](https://github.com/bncc-dev/bncc-dados) publishes it as JSON/CSV under CC BY 4.0, and 186 of its skills include 5º ano (LP 78, MA 25, CI 13, GE 12, HI 10, LI 0; the rest are Arte, Educação Física and Ensino Religioso). Note that EF05MA06 limits percentages to 10%, 25%, 50%, 75% and 100%.

## Acceptance criteria

- [ ] The game offers exactly six subjects, labeled "Matemática", "Português", "Ciências", "História", "Geografia", "Inglês".
- [ ] Each subject has a theme color used consistently wherever it appears: Matemática red, Português orange, Ciências pink, História green, Geografia blue, Inglês yellow.
- [ ] Text shown on or next to a subject color meets WCAG AA contrast (4.5:1). Yellow and pink especially need dark text, not white.
- [ ] All question content targets the Brazilian 5th grade ("quinto ano").
- [ ] Every Matemática, Português, Ciências, História and Geografia question is tagged with the BNCC 5º ano skill code it practices (EF05…).
- [ ] Every Inglês question is tagged with an EF06LI… skill code and marked as outside BNCC 5º ano.
- [ ] Skill codes and texts come from a vendored copy of bncc-dados, credited as its CC BY 4.0 license requires.
- [ ] Every question has a correct answer and a pt-BR explanation (used by "Explicar como resolver").
- [ ] Every question is reviewed by an adult before it is committed. No wording is copied from INEP, OBMEP, OBA, Canguru or any other third-party source.
- [ ] The question bank is licensed CC BY 4.0, separately from the MIT-licensed code.
- [ ] There are no difficulty levels: each subject's questions form a single pool.
- [ ] Inglês questions and answer options are in English; instructions, feedback and explanations are in pt-BR.
- [ ] Two question types exist:
  - [ ] **Multiple choice**: the kid picks one option from a list.
  - [ ] **Typed answer**: the kid types letters and/or numbers into an input and submits it.
- [ ] Typed answers are compared after normalizing both sides: case-insensitive, accent-insensitive, "," and "." accepted as decimal separators, leading/trailing/repeated spaces ignored. E.g. "  historia " matches "História", and "233.6" matches "233,6".
- [ ] A kid can send a photo of a text and gets back, in pt-BR, a summary of it and an explanation at a 5th-grade level.
- [ ] All UI text is pt-BR, with correct accents (the note's spelling is not copied into the UI).

## Files

TBD — no code yet.

## Out of scope

- How the photo summary works in detail: AI provider, OCR, where it runs, whether photos are stored, and consent. It goes in its own spec (`specs/photo-summary.md`) because it processes a child's data.
- The question screen layout ("Conferir resultado" / "Explicar como resolver" buttons, "teclado" box). It's in the Matemática wireframe (`IMG_2885.jpeg`), specced in `specs/question-screen.md`.
- Subject content descriptions (e.g. the Ciências card in `IMG_2886.jpeg`).
- Game mechanics (points, levels, rewards). The name "Estude Jogando" implies them, but this note doesn't mention any.

## Open questions

None.
