/** Claude's per-image limit. The tablet already sends a ~1568px JPEG, far below this. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type MediaType = (typeof MEDIA_TYPES)[number];

export type ImageInput = { data: string; mediaType: MediaType };

type UploadResult = { ok: true; image: ImageInput } | { ok: false; error: string };

function isMediaType(type: string): type is MediaType {
  return (MEDIA_TYPES as readonly string[]).includes(type);
}

/** Validates the uploaded form field and returns it base64-encoded, in memory only. */
export async function readUpload(value: FormDataEntryValue | null): Promise<UploadResult> {
  if (!(value instanceof File)) return { ok: false, error: "Nenhuma foto foi enviada." };
  if (!isMediaType(value.type)) return { ok: false, error: "Mande uma foto em JPG, PNG ou WebP." };
  if (value.size === 0 || value.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "A foto está vazia ou grande demais. Tente tirar outra." };
  }
  const data = Buffer.from(await value.arrayBuffer()).toString("base64");
  return { ok: true, image: { data, mediaType: value.type } };
}
