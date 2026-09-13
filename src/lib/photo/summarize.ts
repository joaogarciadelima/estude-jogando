import type Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import type { ImageInput } from "./image";

export const PHOTO_MODEL = "claude-opus-5";

export type PhotoSummaryResult =
  | { status: "ok"; summary: string; explanation: string[] }
  | { status: "no-text" }
  | { status: "refused" };

const SummarySchema = z.object({
  hasText: z.boolean(),
  summary: z.string(),
  explanation: z.array(z.string()),
});

const SYSTEM_PROMPT = `You help a Brazilian child in 5º ano (about 10 years old) understand a text they photographed, such as a page from a school book.

Write everything in Brazilian Portuguese, with short sentences and words a 10-year-old knows.

- If the image has no readable text, or shows something inappropriate for a child, set hasText to false and leave summary and explanation empty.
- Otherwise set hasText to true. In summary, give the main idea of the text in 2 to 4 sentences. In explanation, give 3 to 5 short steps that explain the text's key ideas in order, the way a kind teacher would.
- Use only what is in the text. If part of the photo is unreadable, say so instead of guessing.
- Never repeat personal information that appears in the image, such as names, addresses or phone numbers.`;

export async function summarizePhoto(
  client: Anthropic,
  image: ImageInput,
): Promise<PhotoSummaryResult> {
  const response = await client.beta.messages.parse({
    model: PHOTO_MODEL,
    max_tokens: 8000,
    // On a safety decline, the API re-runs the request on Anthropic's recommended fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(SummarySchema) },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: image.mediaType, data: image.data },
          },
          { type: "text", text: "Resuma e explique este texto para mim." },
        ],
      },
    ],
  });

  if (response.stop_reason === "refusal") return { status: "refused" };
  const output = response.parsed_output;
  if (!output) throw new Error(`Claude returned no structured output (${response.stop_reason})`);
  if (!output.hasText) return { status: "no-text" };
  return { status: "ok", summary: output.summary, explanation: output.explanation };
}
