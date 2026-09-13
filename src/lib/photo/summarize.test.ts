// @vitest-environment node
import type Anthropic from "@anthropic-ai/sdk";
import { describe, expect, test, vi } from "vitest";
import { PHOTO_MODEL, summarizePhoto } from "./summarize";

const IMAGE = { data: "AQID", mediaType: "image/jpeg" as const };

function fakeClient(response: Record<string, unknown>) {
  const parse = vi.fn().mockResolvedValue(response);
  const client = { beta: { messages: { parse } } } as unknown as Anthropic;
  return { client, parse };
}

describe("summarizePhoto", () => {
  test("sends the image to Claude Opus 5 with the default refusal fallback", async () => {
    const { client, parse } = fakeClient({
      stop_reason: "end_turn",
      parsed_output: { hasText: true, summary: "Resumo.", explanation: ["Passo 1."] },
    });
    await summarizePhoto(client, IMAGE);

    const params = parse.mock.calls[0][0];
    expect(PHOTO_MODEL).toBe("claude-opus-5");
    expect(params.model).toBe(PHOTO_MODEL);
    expect(params.fallbacks).toBe("default");
    expect(params.betas).toContain("server-side-fallback-2026-07-01");
    expect(params.output_config.format).toBeDefined();
    expect(params.messages[0].content[0]).toEqual({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: "AQID" },
    });
  });

  test("returns the summary and explanation", async () => {
    const { client } = fakeClient({
      stop_reason: "end_turn",
      parsed_output: { hasText: true, summary: "A água evapora.", explanation: ["O Sol aquece."] },
    });
    expect(await summarizePhoto(client, IMAGE)).toEqual({
      status: "ok",
      summary: "A água evapora.",
      explanation: ["O Sol aquece."],
    });
  });

  test("reports a photo without readable text", async () => {
    const { client } = fakeClient({
      stop_reason: "end_turn",
      parsed_output: { hasText: false, summary: "", explanation: [] },
    });
    expect(await summarizePhoto(client, IMAGE)).toEqual({ status: "no-text" });
  });

  test("reports a refusal instead of reading the content", async () => {
    const { client } = fakeClient({ stop_reason: "refusal", parsed_output: null });
    expect(await summarizePhoto(client, IMAGE)).toEqual({ status: "refused" });
  });

  test("throws when Claude returns no structured output", async () => {
    const { client } = fakeClient({ stop_reason: "max_tokens", parsed_output: null });
    await expect(summarizePhoto(client, IMAGE)).rejects.toThrow(/no structured output/);
  });
});
