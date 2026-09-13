"use client";

import { useState, useSyncExternalStore } from "react";
import { BackLink } from "@/components/BackLink";
import { hasValidConsent, saveConsent } from "@/lib/photo/consent";
import { resizePhoto } from "@/lib/photo/resize";
import type { PhotoSummaryResult } from "@/lib/photo/summarize";
import { AdultGate } from "./AdultGate";

type Phase =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done"; result: PhotoSummaryResult }
  | { kind: "error"; message: string };

const GENERIC_ERROR = "Não consegui ler a foto agora. Tente de novo daqui a pouco.";

// Consent lives in localStorage, which only exists in the browser: the server renders nothing.
function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

async function sendPhoto(file: File): Promise<Phase> {
  try {
    const form = new FormData();
    form.append("photo", await resizePhoto(file), "foto.jpg");
    const response = await fetch("/api/v1/summaries", { method: "POST", body: form });
    const body = (await response.json()) as {
      data: PhotoSummaryResult | null;
      error: string | null;
    };
    if (!response.ok || !body.data) return { kind: "error", message: body.error ?? GENERIC_ERROR };
    return { kind: "done", result: body.data };
  } catch {
    return { kind: "error", message: GENERIC_ERROR };
  }
}

export function PhotoScreen() {
  const storedConsent = useSyncExternalStore(
    subscribeToStorage,
    () => hasValidConsent(localStorage),
    () => null,
  );
  const [justConsented, setJustConsented] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  if (storedConsent === null) return null;

  function handleConsent() {
    saveConsent(localStorage, new Date());
    setJustConsented(true);
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setPhase({ kind: "sending" });
    setPhase(await sendPhoto(file));
  }

  return (
    <main className="flex min-h-dvh flex-col gap-6 p-6">
      <BackLink className="self-start" />
      {!(storedConsent || justConsented) ? (
        <AdultGate onConsent={handleConsent} />
      ) : phase.kind === "done" ? (
        <Result result={phase.result} onAgain={() => setPhase({ kind: "idle" })} />
      ) : (
        <Capture phase={phase} onFile={handleFile} />
      )}
    </main>
  );
}

function Capture({ phase, onFile }: { phase: Phase; onFile: (file: File | undefined) => void }) {
  const sending = phase.kind === "sending";
  return (
    <section className="flex max-w-2xl flex-col gap-5 text-xl">
      <h1 className="text-4xl font-bold">Mandar foto de um texto</h1>
      <p>Fotografe só o texto, de perto e com boa luz. Não fotografe rostos nem nomes.</p>
      <label
        className={`flex min-h-20 cursor-pointer items-center justify-center rounded-3xl bg-stone-900 px-8 text-3xl font-semibold text-white ${
          sending ? "pointer-events-none opacity-40" : ""
        }`}
      >
        {sending ? "Lendo o texto…" : "Tirar foto do texto"}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          disabled={sending}
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {phase.kind === "error" && (
        <p role="alert" className="font-semibold text-red-700">
          {phase.message}
        </p>
      )}
    </section>
  );
}

const NO_SUMMARY_MESSAGES = {
  "no-text": "Não encontrei um texto nessa foto. Tente tirar outra, mais de perto e com boa luz.",
  refused: "Não posso ajudar com essa foto. Tente com a foto de um texto da escola.",
};

function Result({ result, onAgain }: { result: PhotoSummaryResult; onAgain: () => void }) {
  return (
    <section className="flex max-w-3xl flex-col gap-5 text-2xl">
      {result.status === "ok" ? (
        <>
          <h2 className="text-3xl font-bold">Resumo</h2>
          <p>{result.summary}</p>
          <h2 className="text-3xl font-bold">Explicação</h2>
          <ol className="list-decimal space-y-2 pl-8">
            {result.explanation.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </>
      ) : (
        <p>{NO_SUMMARY_MESSAGES[result.status]}</p>
      )}
      <button
        type="button"
        onClick={onAgain}
        className="min-h-14 self-start rounded-full bg-stone-900 px-8 text-2xl font-semibold text-white"
      >
        Mandar outra foto
      </button>
    </section>
  );
}
