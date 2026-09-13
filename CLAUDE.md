# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

"Estude Jogando" — a study game for Brazilian 5th graders (quinto ano, ~10 years old). Subjects: Matemática, Português, Ciências, História, Geografia, Inglês.
Next.js 16 (App Router, `src/`, Tailwind 4) web app, primarily for a **tablet in landscape** (touch-first).

## Commands

Use **pnpm** (not npm).

- `pnpm test` — Vitest, single run (`pnpm test:watch` to watch). Unit tests are colocated as `src/**/*.test.tsx`. Single test: `pnpm test src/app/page.test.tsx` or `pnpm test -t "<name>"`.
- `pnpm test:e2e` — Playwright in `e2e/`. It starts its own dev server on port **3100** and runs Chromium with an iPad landscape viewport. First run needs `pnpm exec playwright install chromium`.
- `pnpm typecheck` — runs `next typegen` before `tsc`; plain `tsc` fails without the generated route types (e.g. `LayoutProps`).
- `pnpm lint`, `pnpm format:check`.
- Before calling work done: `pnpm lint && pnpm typecheck && pnpm test`, plus `pnpm test:e2e` for UI changes.
- A PostToolUse hook runs Prettier on every file you edit. Markdown is excluded via `.prettierignore`.
- `ANTHROPIC_API_KEY` goes in `.env.local` (see `.env.example`); server-only, never `NEXT_PUBLIC_`.
- Real Claude API calls cost money. Tests mock the SDK; ask before running anything that calls the API for real.

## Language

- All user-facing UI text in **pt-BR**, written for a 10-year-old (short sentences, no jargon).
- Everything else in **English**: identifiers, comments, commit messages, branch names, specs.

## Requirements

- `desenhos-antonia-ideia/` holds photos of Antonia's hand-drawn sketches. They are **inspiration, not the spec** — you may propose beyond them.
- Written requirements live in `specs/<feature>.md` and are the source of truth. Use the `sketch-to-spec` skill to transcribe a sketch into a spec.

## Privacy (public GitHub repo)

- Never commit the sketch photos (gitignored; they carry GPS EXIF) or any other image/data about a child.
- Never paste a child's personal data into code, fixtures, issues, or commits — use synthetic examples.
- Photo feature (`specs/photo-summary.md`): never store or log the photo, its text or the summary. Changing `/privacidade` means bumping `CONSENT_VERSION`. The spec lists blockers before any public deploy.

## Content licensing

- The question bank is original content, licensed CC BY 4.0 (separate from the MIT code). Never copy question wording from INEP/Saeb, OBMEP, OBA, Canguru or any other third-party source — use them only as style references. Details: `specs/game-overview.md` → "Content sources".

## Conventions

- The parent `~/projects/CLAUDE.md` and its `docs/` are a generic template. Where they conflict with this file (e.g. Portuguese commits, placeholder stack), this file wins.
