import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink";
import { RevokeConsentButton } from "@/components/photo/RevokeConsentButton";
import { CONSENT_VERSION } from "@/lib/photo/consent";

export const metadata: Metadata = { title: "Aviso de privacidade · Estude Jogando" };

// DRAFT written by Claude, not legal advice. It needs a lawyer's review, the controller's contact,
// and a check of the Anthropic terms it cites before any public deploy (specs/photo-summary.md).
// Changing this text? Bump CONSENT_VERSION so guardians authorize again.
export default function PrivacidadePage() {
  const [year, month, day] = CONSENT_VERSION.split("-");

  return (
    <main className="flex min-h-dvh max-w-3xl flex-col gap-4 p-6 text-lg">
      <BackLink className="self-start" />
      <h1 className="text-4xl font-bold">Aviso de privacidade: foto de texto</h1>
      <p className="text-stone-700">
        Versão de {day}/{month}/{year}.
      </p>

      <h2 className="text-2xl font-bold">O que o recurso faz</h2>
      <p>
        A criança tira uma foto de um texto, e o app mostra um resumo e uma explicação em português.
      </p>

      <h2 className="text-2xl font-bold">Quais dados usamos</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>
          A foto enviada. Pedimos que ela mostre só o texto, sem rostos, nomes ou outros dados
          pessoais.
        </li>
        <li>
          O endereço de internet (IP), transformado em um código que não permite recuperá-lo, para
          limitar o número de fotos por dia. Esse código é apagado no dia seguinte.
        </li>
      </ul>

      <h2 className="text-2xl font-bold">O que não fazemos</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Não guardamos a foto nem o resumo: eles só aparecem na tela.</li>
        <li>
          Não pedimos nome, e-mail ou conta. Não mostramos anúncios. Não rastreamos a criança.
        </li>
      </ul>

      <h2 className="text-2xl font-bold">Com quem a foto é compartilhada</h2>
      <p>
        Para ler o texto, a foto é enviada à Anthropic, empresa dos Estados Unidos que fornece a
        inteligência artificial Claude. O tratamento pela Anthropic segue a{" "}
        <a
          href="https://www.anthropic.com/legal/privacy"
          className="font-semibold underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          política de privacidade da Anthropic
        </a>
        .
      </p>

      <h2 className="text-2xl font-bold">Autorização do responsável</h2>
      <p>
        O recurso só funciona depois que uma mãe, um pai ou responsável legal autoriza, como pede a
        Lei Geral de Proteção de Dados (LGPD, art. 14). A autorização fica guardada só neste
        aparelho, e você pode revogá-la a qualquer momento:
      </p>
      <RevokeConsentButton />

      <h2 className="text-2xl font-bold">Contato</h2>
      <p>[A definir antes de publicar: quem é o responsável pelo app e um e-mail de contato.]</p>
    </main>
  );
}
