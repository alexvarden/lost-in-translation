/**
 * Server-side only. Do not import from client components.
 * The OpenAI SDK reads OPENAI_API_KEY from the environment.
 */
import OpenAI from "openai";
import type { TranslatorMode } from "@/types";

let _client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is not set. Copy .env.local.example to .env.local and add your key."
      );
    }
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

export const MODELS = {
  translate: "gpt-4o-mini",
  embed: "text-embedding-3-small",
} as const;

export function systemPromptForMode(
  mode: TranslatorMode,
  fromName: string,
  toName: string
): string {
  const base = `You are a translator converting text from ${fromName} to ${toName}.
Return ONLY the translated text. No quotation marks. No preamble. No notes. No explanations.
Do not transliterate — write in the native script of ${toName}.
Preserve the grammatical form of the source (a sentence stays a sentence, a fragment stays a fragment).`;

  const modeLine: Record<TranslatorMode, string> = {
    literal:
      "Style: strictly literal. Prefer word-for-word equivalents even when they sound stilted. Preserve idioms as literal translations rather than swapping them for native idioms.",
    natural:
      "Style: natural and idiomatic. Translate meaning over form. Use the most native-sounding phrasing a fluent ${toName} speaker would produce in conversation.",
    poetic:
      "Style: poetic and evocative. Re-imagine the phrase in ${toName} with attention to rhythm, sound, and imagery. Retain the core meaning but favour a literary register.",
  };

  return `${base}\n${modeLine[mode]}`;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Embedding length mismatch: ${a.length} vs ${b.length}`);
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
