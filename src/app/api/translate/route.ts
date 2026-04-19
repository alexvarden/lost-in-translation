import { NextResponse } from "next/server";
import { getOpenAI, MODELS, systemPromptForMode } from "@/lib/openai";
import { getLanguage } from "@/lib/languages";
import type { TranslatorMode } from "@/types";

export const runtime = "nodejs";

interface TranslateBody {
  text?: unknown;
  from?: unknown;
  to?: unknown;
  mode?: unknown;
}

const VALID_MODES: TranslatorMode[] = ["literal", "natural", "poetic"];

export async function POST(req: Request) {
  let body: TranslateBody;
  try {
    body = (await req.json()) as TranslateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const from = typeof body.from === "string" ? body.from : "";
  const to = typeof body.to === "string" ? body.to : "";
  const mode = typeof body.mode === "string" ? (body.mode as TranslatorMode) : "natural";

  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  if (!from) return NextResponse.json({ error: "from required" }, { status: 400 });
  if (!to) return NextResponse.json({ error: "to required" }, { status: 400 });
  if (!VALID_MODES.includes(mode)) {
    return NextResponse.json({ error: `mode must be one of ${VALID_MODES.join(", ")}` }, { status: 400 });
  }
  if (text.length > 800) {
    return NextResponse.json({ error: "text must be under 800 characters" }, { status: 400 });
  }

  const fromLang = getLanguage(from);
  const toLang = getLanguage(to);

  // If from === to, just echo the text — this can happen if a user picks the
  // same language twice. Skip the API call; return instantly.
  if (fromLang.code === toLang.code) {
    return NextResponse.json({ translated: text, latencyMs: 0 });
  }

  const started = Date.now();
  try {
    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: MODELS.translate,
      temperature: mode === "poetic" ? 0.8 : mode === "natural" ? 0.3 : 0.1,
      messages: [
        {
          role: "system",
          content: systemPromptForMode(mode, fromLang.name, toLang.name),
        },
        { role: "user", content: text },
      ],
    });
    const translated = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!translated) {
      return NextResponse.json(
        { error: "Empty translation returned" },
        { status: 502 }
      );
    }
    return NextResponse.json({ translated, latencyMs: Date.now() - started });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
