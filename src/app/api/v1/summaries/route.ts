import Anthropic from "@anthropic-ai/sdk";
import { readUpload } from "@/lib/photo/image";
import { clientKey, createMemoryRateLimiter } from "@/lib/photo/rate-limit";
import { summarizePhoto } from "@/lib/photo/summarize";

// specs/photo-summary.md: 10 photos per person and 200 in total per day (~US$6/day at most).
const limiter = createMemoryRateLimiter({ perKey: 10, total: 200 });

const LIMIT_MESSAGES = {
  person: "Você já mandou 10 fotos hoje. Volte amanhã!",
  global: "O limite de fotos de hoje acabou. Volte amanhã!",
};

function reply(status: number, body: { data: unknown; error: string | null }) {
  return Response.json(body, { status });
}

const fail = (status: number, error: string) => reply(status, { data: null, error });

function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown"
  );
}

/** POST /api/v1/summaries — multipart form with one `photo` field. The photo is never stored. */
export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return fail(503, "O recurso de foto não está disponível agora.");
  }

  const form = await request.formData().catch(() => null);
  const upload = await readUpload(form?.get("photo") ?? null);
  if (!upload.ok) return fail(400, upload.error);

  const limit = await limiter.consume(clientKey(clientIp(request.headers), new Date()));
  if (!limit.allowed) return fail(429, LIMIT_MESSAGES[limit.reason]);

  try {
    const result = await summarizePhoto(new Anthropic(), upload.image);
    return reply(200, { data: result, error: null });
  } catch (error) {
    // Log only the failure kind — never the photo or any text from it.
    const status = error instanceof Anthropic.APIError ? error.status : undefined;
    console.error("Photo summary failed:", error instanceof Error ? error.name : "unknown", status);
    return fail(502, "Não consegui ler a foto agora. Tente de novo daqui a pouco.");
  }
}
