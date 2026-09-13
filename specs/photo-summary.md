# Photo summary

Source: Antonia's requirements note, `desenhos-antonia-ideia/descricao-jogo-antonia.jpeg`: "Que se eu mandar foto de texto, ele resume e me explica." Related: `specs/game-overview.md`.

## Context

A kid photographs a text (a textbook page, for example) with the tablet and gets back, in pt-BR, a summary and a step-by-step explanation at a 5th-grade level. The feature sends a child's photo to a third-party AI provider, so it is designed around LGPD art. 14 (children's data) and cost control.

Decisions confirmed with the user:
- **Audience: public.** Any child may use it, so a parent or guardian must authorize it first.
- **Consent: adult gate.** The guardian reads a short notice (with a link to the full notice), confirms they are the parent or legal guardian, and types their birth year, which must mean 18 or older. The consent is stored only on the device (`localStorage`), with the notice version and date, and can be revoked. No personal data is collected. The check is weak, but proportionate because nothing is stored.
- **The photo is never stored.** It goes tablet → our server → Claude and is discarded. No disk, database or logs. The summary exists only on screen.
- **Model: `claude-opus-5`**, with the server-side refusal fallback on (`fallbacks: "default"`).
- **Limits: 10 photos per person per day and 200 per day in total** (about US$6/day at most, estimated at ~US$0.03 per photo).
- **Deployment target: undecided.** The limiter sits behind an interface. The only implementation is in memory, which is correct only for a single server instance.

Implementation decisions:
- The tablet shrinks the photo to at most 1568px on the long side and re-encodes it as JPEG before uploading. Claude downscales larger images anyway. This also removes EXIF metadata, including GPS.
- "Per person" means per IP address. The limiter only sees a SHA-256 hash of the IP plus the date, never the raw IP.
- The API follows the parent `docs/api-conventions.md`: `POST /api/v1/summaries`, JSON `{ data, error }`.
- Effort is `medium` to hold cost near the estimate; it can be tuned in `src/lib/photo/summarize.ts`.

## Acceptance criteria

**Consent (adult gate)**
- [x] `/foto` shows the adult gate until consent for the current notice version exists on the device.
- [x] "Autorizar" is accepted only with the guardian checkbox ticked and a birth year that means 18 or older. Otherwise a pt-BR message says what's missing.
- [x] After authorizing, the photo screen shows, and it still shows after a reload.
- [x] `/privacidade` shows the full notice and a "Revogar autorização" button that deletes the consent from the device.

**Photo**
- [x] A large "Tirar foto do texto" button opens the tablet camera (or the file picker).
- [x] The photo is resized on the device (long side ≤ 1568px, JPEG) before it is sent.
- [x] While waiting, the screen shows "Lendo o texto…".
- [x] The result shows a "Resumo" and an "Explicação" as numbered steps, in pt-BR, plus a "Mandar outra foto" button.
- [x] If the photo has no readable text, a friendly pt-BR message asks for a clearer photo of a text.

**Server (`POST /api/v1/summaries`)**
- [x] Accepts one image (`photo` field; JPEG, PNG or WebP; at most 5 MB). Anything else returns 400 with a pt-BR message.
- [x] Returns 429 with a pt-BR message after 10 photos from the same IP in a day, or 200 in total in a day (days in America/Sao_Paulo time).
- [x] Returns 503 with a pt-BR message when `ANTHROPIC_API_KEY` is not configured.
- [x] Calls `claude-opus-5` with `fallbacks: "default"` and a structured output, and handles a refusal with a pt-BR message instead of an error.
- [x] Never writes the image, its text or the summary to disk or logs.

**Home**
- [x] The home page has a "Mandar foto de um texto" link to `/foto`, and the six subject cards still fit the tablet screen.

## Files

- `src/app/foto/page.tsx`, `src/components/photo/*`: consent gate, capture and result.
- `src/app/privacidade/page.tsx`: privacy notice and consent revocation.
- `src/app/api/v1/summaries/route.ts`: the endpoint.
- `src/lib/photo/`: consent, image validation and resizing, rate limiter, Claude call.
- `.env.example`: `ANTHROPIC_API_KEY`.

## Out of scope

- A persistent rate limiter (e.g. Upstash Redis). **Required before any public deploy with more than one server instance.**
- History of past photos, accounts, stronger guardian verification (e.g. e-mail).
- Special handling for handwritten text; output in languages other than pt-BR.

## Blockers before going public

1. **Legal review of the privacy notice** (`/privacidade`) by a lawyer. It is a draft written by Claude, not legal advice.
2. **Controller identity and contact** in the notice (who runs the app, an e-mail for guardians) — placeholder today.
3. **Check the Anthropic API data terms** (retention, use for training, international transfer under LGPD art. 33) and decide what the notice should say. Today it only links to Anthropic's privacy policy.
4. **A persistent rate limiter** for the chosen deployment target.

## Open questions

None besides the blockers above.
