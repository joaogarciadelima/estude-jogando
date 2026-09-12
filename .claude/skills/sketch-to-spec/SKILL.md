---
name: sketch-to-spec
description: Turn one of Antonia's hand-drawn sketch photos (desenhos-antonia-ideia/) into a written feature spec at specs/<feature>.md. Use when the user shares or points to a new sketch, or asks to transcribe/spec a drawing.
argument-hint: "[path to sketch image]"
---

Transcribe the sketch at `$ARGUMENTS` (if empty, list `desenhos-antonia-ideia/` and ask which one) into a feature spec.

1. Read the image. Transcribe every handwritten word verbatim in Portuguese, including labels on boxes/buttons and which colors are used for what.
2. Show the transcription and your reading of the layout to the user. Flag anything illegible or ambiguous (e.g. a digit that could be 1 or 4) and ask — do not guess.
3. Check `specs/` for an existing spec covering the same feature. If one exists, propose edits to it instead of creating a new file.
4. Write `specs/<kebab-case-feature>.md` in English with these sections:
   - **Context** — what the sketch shows; quote the original Portuguese text.
   - **Acceptance criteria** — checkable bullets. UI strings stay in pt-BR, quoted.
   - **Files** — expected files/routes to touch (or "TBD — no code yet").
   - **Out of scope** — what the sketch implies but this spec deliberately excludes.
   - **Open questions** — anything unresolved from step 2.
5. Never copy the image into `specs/` or reference it by embedding — the photos are gitignored because they contain GPS EXIF. Refer to it by filename only.
