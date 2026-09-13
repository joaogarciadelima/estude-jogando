/** Claude downscales anything larger, so there is no point sending more pixels. */
export const MAX_PHOTO_SIDE = 1568;
const JPEG_QUALITY = 0.85;

export function fitWithin(width: number, height: number, max: number) {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

/**
 * Browser-only. Shrinks the photo and re-encodes it as JPEG before upload.
 * Re-encoding through a canvas also drops EXIF metadata, including GPS location.
 */
export async function resizePhoto(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_PHOTO_SIDE);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context unavailable");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode the photo"))),
      "image/jpeg",
      JPEG_QUALITY,
    ),
  );
}
