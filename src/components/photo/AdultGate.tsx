"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { isAdultBirthYear } from "@/lib/photo/consent";

type AdultGateProps = {
  onConsent: () => void;
  now?: () => Date;
};

export function AdultGate({ onConsent, now = () => new Date() }: AdultGateProps) {
  const [isGuardian, setIsGuardian] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isGuardian) return setError("Marque a caixa para confirmar que você é o responsável.");
    if (!isAdultBirthYear(birthYear, now())) {
      return setError("Esta autorização precisa ser dada pela mãe, pai ou responsável adulto.");
    }
    onConsent();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5 text-xl">
      <h1 className="text-4xl font-bold">Antes de começar</h1>
      <p>
        Para resumir e explicar o texto, a foto é enviada para uma inteligência artificial (Claude,
        da empresa Anthropic). A foto não fica guardada. Uma mãe, um pai ou responsável precisa
        autorizar.
      </p>
      <p>
        Leia o{" "}
        <Link href="/privacidade" className="font-semibold underline">
          aviso de privacidade
        </Link>
        .
      </p>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isGuardian}
          onChange={(e) => setIsGuardian(e.target.checked)}
          className="mt-1 size-7 shrink-0"
        />
        Sou mãe, pai ou responsável legal pela criança e autorizo o uso da foto como descrito no
        aviso.
      </label>
      <label className="flex flex-col gap-2">
        Ano em que você nasceu
        <input
          inputMode="numeric"
          maxLength={4}
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          className="min-h-12 w-40 rounded-xl border-2 border-stone-300 px-3 text-2xl"
        />
      </label>
      {error && (
        <p role="alert" className="font-semibold text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="min-h-14 self-start rounded-full bg-stone-900 px-8 text-2xl font-semibold text-white"
      >
        Autorizar
      </button>
    </form>
  );
}
