// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const summarizePhoto = vi.fn();
vi.mock("@/lib/photo/summarize", () => ({ summarizePhoto }));

async function loadRoute() {
  vi.resetModules(); // fresh in-memory rate limiter per test
  return import("./route");
}

function upload(
  ip = "203.0.113.7",
  file: File | string = new File([new Uint8Array([1])], "f.jpg", { type: "image/jpeg" }),
) {
  const form = new FormData();
  form.append("photo", file);
  return new Request("http://localhost/api/v1/summaries", {
    method: "POST",
    body: form,
    headers: { "x-forwarded-for": `${ip}, 10.0.0.1` },
  });
}

beforeEach(() => {
  vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
  summarizePhoto.mockReset().mockResolvedValue({
    status: "ok",
    summary: "Resumo.",
    explanation: ["Passo."],
  });
});

afterEach(() => vi.unstubAllEnvs());

describe("POST /api/v1/summaries", () => {
  test("returns the summary as { data, error }", async () => {
    const { POST } = await loadRoute();
    const response = await POST(upload());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: { status: "ok", summary: "Resumo.", explanation: ["Passo."] },
      error: null,
    });
    expect(summarizePhoto).toHaveBeenCalledWith(expect.anything(), {
      data: "AQ==",
      mediaType: "image/jpeg",
    });
  });

  test("503 when the API key is not configured", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const { POST } = await loadRoute();
    const response = await POST(upload());
    expect(response.status).toBe(503);
    expect((await response.json()).error).toMatch(/não está disponível/);
    expect(summarizePhoto).not.toHaveBeenCalled();
  });

  test("400 for an invalid upload, without spending the daily limit", async () => {
    const { POST } = await loadRoute();
    const bad = await POST(upload("203.0.113.7", "texto"));
    expect(bad.status).toBe(400);
    expect(summarizePhoto).not.toHaveBeenCalled();
    for (let i = 0; i < 10; i++) expect((await POST(upload())).status).toBe(200);
  });

  test("429 after 10 photos from the same person in a day", async () => {
    const { POST } = await loadRoute();
    for (let i = 0; i < 10; i++) await POST(upload());
    const response = await POST(upload());
    expect(response.status).toBe(429);
    expect((await response.json()).error).toMatch(/10 fotos hoje/);
    expect((await POST(upload("198.51.100.1"))).status).toBe(200);
  });

  test("502 with a friendly message when Claude fails, without logging the photo", async () => {
    summarizePhoto.mockRejectedValue(new Error("boom"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { POST } = await loadRoute();
    const response = await POST(upload());
    expect(response.status).toBe(502);
    expect((await response.json()).error).toMatch(/Tente de novo/);
    expect(JSON.stringify(log.mock.calls)).not.toContain("AQ==");
    log.mockRestore();
  });
});
