/**
 * Guardian consent for the photo feature (specs/photo-summary.md), stored only on the device.
 * Bump CONSENT_VERSION whenever the privacy notice changes: older consents stop being valid.
 */
export const CONSENT_VERSION = "2026-09-13";
export const CONSENT_STORAGE_KEY = "estude-jogando:photo-consent";

const ADULT_AGE = 18;
const EARLIEST_BIRTH_YEAR = 1900;

type Consent = { version: string; acceptedAt: string };

export function isAdultBirthYear(input: string, now: Date): boolean {
  if (!/^\d{4}$/.test(input.trim())) return false;
  const year = Number(input.trim());
  return year >= EARLIEST_BIRTH_YEAR && now.getFullYear() - year >= ADULT_AGE;
}

export function hasValidConsent(storage: Pick<Storage, "getItem">): boolean {
  try {
    const consent = JSON.parse(storage.getItem(CONSENT_STORAGE_KEY) ?? "null") as Consent | null;
    return consent?.version === CONSENT_VERSION;
  } catch {
    return false;
  }
}

export function saveConsent(storage: Pick<Storage, "setItem">, now: Date): void {
  const consent: Consent = { version: CONSENT_VERSION, acceptedAt: now.toISOString() };
  storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
}

export function revokeConsent(storage: Pick<Storage, "removeItem">): void {
  storage.removeItem(CONSENT_STORAGE_KEY);
}
