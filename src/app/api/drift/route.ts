import { NextResponse } from "next/server";
import { getOpenAI, MODELS, cosineSimilarity } from "@/lib/openai";

export const runtime = "nodejs";

interface DriftBody {
  a?: unknown;
  b?: unknown;
}

export async function POST(req: Request) {
  let body: DriftBody;
  try {
    body = (await req.json()) as DriftBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const a = typeof body.a === "string" ? body.a.trim() : "";
  const b = typeof body.b === "string" ? body.b.trim() : "";
  if (!a || !b) {
    return NextResponse.json({ error: "both `a` and `b` required" }, { status: 400 });
  }
  if (a.length > 2000 || b.length > 2000) {
    return NextResponse.json(
      { error: "each text must be under 2000 characters" },
      { status: 400 }
    );
  }

  try {
    const client = getOpenAI();
    const embedding = await client.embeddings.create({
      model: MODELS.embed,
      input: [a, b],
    });
    const [eA, eB] = embedding.data;
    if (!eA || !eB) {
      return NextResponse.json({ error: "Embedding API returned empty" }, { status: 502 });
    }
    const cosine = cosineSimilarity(eA.embedding, eB.embedding);
    // Normalise: cosine for text embeddings typically 0.3..1.0 for related content.
    // Map 0.3..1.0 -> 0..100 retention, clamped.
    const retention = Math.max(0, Math.min(100, Math.round(((cosine - 0.3) / 0.7) * 100)));
    return NextResponse.json({ cosine, retention });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
