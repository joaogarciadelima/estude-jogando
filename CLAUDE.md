# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Estude Jogando" — a study game for Brazilian 5th graders (quinto ano, ~10 years old). Subjects: Matemática, Português, Ciências, História, Geografia, Inglês.
Planned as a React/Next.js web app, primarily for a **tablet in landscape** (touch-first). **No code exists yet** — there are no build/test/lint commands; don't invent them. Re-run `/init` after scaffolding.

## Language

- All user-facing UI text in **pt-BR**, written for a 10-year-old (short sentences, no jargon).
- Everything else in **English**: identifiers, comments, commit messages, branch names, specs.

## Requirements

- `desenhos-antonia-ideia/` holds photos of Antonia's hand-drawn sketches. They are **inspiration, not the spec** — you may propose beyond them.
- Written requirements live in `specs/<feature>.md` and are the source of truth. Use the `sketch-to-spec` skill to transcribe a sketch into a spec.

## Privacy (public GitHub repo)

- Never commit the sketch photos (gitignored; they carry GPS EXIF) or any other image/data about a child.
- Never paste a child's personal data into code, fixtures, issues, or commits — use synthetic examples.

## Content licensing

- The question bank is original content, licensed CC BY 4.0 (separate from the MIT code). Never copy question wording from INEP/Saeb, OBMEP, OBA, Canguru or any other third-party source — use them only as style references. Details: `specs/game-overview.md` → "Content sources".

## Conventions

- The parent `~/projects/CLAUDE.md` and its `docs/` are a generic template. Where they conflict with this file (e.g. Portuguese commits, placeholder stack), this file wins.
