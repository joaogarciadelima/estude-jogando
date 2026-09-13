"use client";

import { useState } from "react";
import { revokeConsent } from "@/lib/photo/consent";

export function RevokeConsentButton() {
  const [revoked, setRevoked] = useState(false);

  if (revoked) {
    return <p role="status">Autorização revogada neste aparelho.</p>;
  }
  return (
    <button
      type="button"
      onClick={() => {
        revokeConsent(localStorage);
        setRevoked(true);
      }}
      className="min-h-12 self-start rounded-full border-2 border-stone-900 px-6 font-semibold"
    >
      Revogar autorização
    </button>
  );
}
