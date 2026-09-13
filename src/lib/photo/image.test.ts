// @vitest-environment node
import { describe, expect, test } from "vitest";
import { MAX_IMAGE_BYTES, readUpload } from "./image";
import { fitWithin } from "./resize";

const jpeg = (bytes: number) =>
  new File([new Uint8Array(bytes)], "foto.jpg", { type: "image/jpeg" });

describe("readUpload", () => {
  test("accepts a JPEG and returns it as base64 with its media type", async () => {
    const result = await readUpload(
      new File([new Uint8Array([1, 2, 3])], "f.jpg", { type: "image/jpeg" }),
    );
    expect(result).toEqual({ ok: true, image: { data: "AQID", mediaType: "image/jpeg" } });
  });

  test.each(["image/png", "image/webp"])("accepts %s", async (type) => {
    const result = await readUpload(new File([new Uint8Array([1])], "f", { type }));
    expect(result.ok).toBe(true);
  });

  test("rejects a missing photo", async () => {
    expect(await readUpload(null)).toEqual({ ok: false, error: "Nenhuma foto foi enviada." });
  });

  test("rejects a text field instead of a file", async () => {
    expect((await readUpload("oi")).ok).toBe(false);
  });

  test("rejects other file types", async () => {
    const result = await readUpload(new File(["%PDF"], "f.pdf", { type: "application/pdf" }));
    expect(result).toEqual({ ok: false, error: "Mande uma foto em JPG, PNG ou WebP." });
  });

  test("rejects empty and oversized files", async () => {
    expect((await readUpload(jpeg(0))).ok).toBe(false);
    expect((await readUpload(jpeg(MAX_IMAGE_BYTES + 1))).ok).toBe(false);
    expect((await readUpload(jpeg(MAX_IMAGE_BYTES))).ok).toBe(true);
  });
});

describe("fitWithin", () => {
  test("shrinks the long side to the maximum, keeping the aspect ratio", () => {
    expect(fitWithin(4032, 3024, 1568)).toEqual({ width: 1568, height: 1176 });
    expect(fitWithin(3024, 4032, 1568)).toEqual({ width: 1176, height: 1568 });
  });

  test("never enlarges a small image", () => {
    expect(fitWithin(800, 600, 1568)).toEqual({ width: 800, height: 600 });
  });
});
