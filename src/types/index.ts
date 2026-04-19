/**
 * Core types for Lost in Translation.
 * See `/Users/alexvarden/.windsurf/plans/lost-in-translation-4af98b.md` for the full design.
 */

export type TextDirection = "ltr" | "rtl";

export type ScriptGroup =
  | "latin-western"
  | "latin-eastern"
  | "cyrillic"
  | "cjk"
  | "arabic"
  | "brahmic"
  | "other";

export interface Language {
  /** ISO 639-1 (or a stable custom code if needed, e.g. "zh-hant"). */
  code: string;
  /** Display name shown on the card, e.g. "Japanese". */
  name: string;
  /** Native endonym for the searchable dropdown, e.g. "日本語". */
  endonym: string;
  /** Emoji flag. */
  flag: string;
  /** Script group used for grouping in the picker. */
  script: ScriptGroup;
  /** Human label for the script group (e.g. "Arabic script"). */
  scriptLabel: string;
  /** Text direction for rendering the translation. */
  dir: TextDirection;
  /** Short flavour note for the info hover (optional). */
  note?: string;
}

export type TranslatorMode = "literal" | "natural" | "poetic";

export interface Step {
  /** Stable ID; survives reorder. */
  id: string;
  /** Language ISO code. Must match a `Language.code` in `languages.ts`. */
  languageCode: string;
  /** Translation produced at this step after a run. */
  translation?: string;
  /**
   * `translation` rendered back into the origin (first step's) language,
   * so the user can read the semantic drift in their own language.
   * Undefined when this step IS the origin language (it would be a no-op).
   */
  backTranslation?: string;
  /** Cosine distance (0..1) from the ORIGINAL phrase embedding. */
  driftFromOrigin?: number;
  /** Convenience: 100 * (1 - driftFromOrigin), rounded. */
  retentionPct?: number;
  /** Cosine distance from the previous step (per-hop drift, for connector colouring). */
  driftFromPrev?: number;
  /** Whether this step is currently resolving. */
  isResolving?: boolean;
  /** If the step failed, the error message. */
  error?: string;
}

export type Tour = Step[];

export type RunState =
  | { kind: "idle" }
  | { kind: "running"; currentStepId: string | null }
  | { kind: "complete" }
  | { kind: "error"; message: string };

export interface PhrasePreset {
  id: string;
  text: string;
  category: "Literary" | "Poetic" | "Idiomatic" | "Philosophical" | "Playful";
  /** Optional: why this one drifts well, shown as a subtitle. */
  note?: string;
}

export type AnimationSpeed = "slow" | "medium" | "instant";

export interface AppSettings {
  mode: TranslatorMode;
  animationSpeed: AnimationSpeed;
  showPerStepScore: boolean;
}
