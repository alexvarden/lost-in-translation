/**
 * Hand-crafted 2D pseudo-embeddings for the explainer article.
 *
 * Real OpenAI embeddings live in 1536-dimensional space; the closest points
 * to any given word tend to be its semantic relatives. These coordinates are
 * crafted to illustrate that geometry without shipping a 500MB model client-side.
 *
 * Coordinates roughly represent a 2D PCA/t-SNE projection of a real embedding
 * space — tuned for clarity over faithfulness.
 */

export type Cluster = "animal" | "color" | "emotion" | "motion" | "royalty" | "nature";

export interface VizWord {
  /** Word as displayed. */
  text: string;
  /** Language code for styling (direction, optional grouping). */
  lang: string;
  /** 2D coordinates: x ∈ [-10, 10], y ∈ [-10, 10]. */
  x: number;
  y: number;
  cluster: Cluster;
  /** For cross-lingual pairings: English concept key this word maps to. */
  concept?: string;
}

export const CLUSTER_PALETTE: Record<Cluster, string> = {
  animal: "#fbbf24", // amber
  color: "#60a5fa", // sky
  emotion: "#f472b6", // pink
  motion: "#34d399", // emerald
  royalty: "#a78bfa", // violet
  nature: "#4ade80", // green
};

export const CLUSTER_LABEL: Record<Cluster, string> = {
  animal: "Animals",
  color: "Colors",
  emotion: "Emotions",
  motion: "Motion verbs",
  royalty: "Royalty",
  nature: "Nature",
};

/** Primary English-only word set for the first embedding-space visualisation. */
export const ENGLISH_WORDS: VizWord[] = [
  // Animals (top-left)
  { text: "dog", lang: "en", x: -6.2, y: 4.3, cluster: "animal", concept: "dog" },
  { text: "cat", lang: "en", x: -5.5, y: 4.8, cluster: "animal", concept: "cat" },
  { text: "horse", lang: "en", x: -6.8, y: 3.6, cluster: "animal", concept: "horse" },
  { text: "bird", lang: "en", x: -5.0, y: 5.4, cluster: "animal", concept: "bird" },
  { text: "wolf", lang: "en", x: -7.2, y: 4.5, cluster: "animal", concept: "wolf" },
  { text: "fish", lang: "en", x: -4.8, y: 3.8, cluster: "animal", concept: "fish" },

  // Colors (top-right)
  { text: "red", lang: "en", x: 6.2, y: 4.8, cluster: "color", concept: "red" },
  { text: "blue", lang: "en", x: 6.9, y: 4.2, cluster: "color", concept: "blue" },
  { text: "green", lang: "en", x: 6.5, y: 3.5, cluster: "color", concept: "green" },
  { text: "yellow", lang: "en", x: 5.6, y: 5.1, cluster: "color", concept: "yellow" },
  { text: "black", lang: "en", x: 7.2, y: 5.0, cluster: "color", concept: "black" },

  // Emotions (bottom-left)
  { text: "happy", lang: "en", x: -5.1, y: -4.1, cluster: "emotion", concept: "happy" },
  { text: "sad", lang: "en", x: -6.3, y: -4.6, cluster: "emotion", concept: "sad" },
  { text: "angry", lang: "en", x: -7.0, y: -5.2, cluster: "emotion", concept: "angry" },
  { text: "calm", lang: "en", x: -4.2, y: -3.6, cluster: "emotion", concept: "calm" },
  { text: "love", lang: "en", x: -5.6, y: -5.5, cluster: "emotion", concept: "love" },

  // Motion verbs (bottom-right)
  { text: "run", lang: "en", x: 5.2, y: -4.1, cluster: "motion", concept: "run" },
  { text: "walk", lang: "en", x: 6.0, y: -4.6, cluster: "motion", concept: "walk" },
  { text: "jump", lang: "en", x: 5.6, y: -5.1, cluster: "motion", concept: "jump" },
  { text: "sit", lang: "en", x: 6.8, y: -3.6, cluster: "motion", concept: "sit" },
  { text: "swim", lang: "en", x: 5.9, y: -5.6, cluster: "motion", concept: "swim" },

  // Royalty (middle-left, bridges)
  { text: "king", lang: "en", x: -1.4, y: 2.1, cluster: "royalty", concept: "king" },
  { text: "queen", lang: "en", x: -2.0, y: 1.8, cluster: "royalty", concept: "queen" },
  { text: "prince", lang: "en", x: -1.0, y: 2.6, cluster: "royalty", concept: "prince" },

  // Nature (top-center)
  { text: "tree", lang: "en", x: 0.8, y: 6.0, cluster: "nature", concept: "tree" },
  { text: "river", lang: "en", x: 1.4, y: 5.4, cluster: "nature", concept: "river" },
  { text: "mountain", lang: "en", x: 0.2, y: 6.5, cluster: "nature", concept: "mountain" },
];

/**
 * Cross-lingual word set. Translations of the same concept cluster near
 * each other — which is the central insight of multilingual embeddings.
 * Small jitter added so they render as distinct points.
 */
export const CROSS_LINGUAL_WORDS: VizWord[] = [
  // dog — concept centre ~ (-7.0, 5.5)
  { text: "dog", lang: "en", x: -7.3, y: 6.2, cluster: "animal", concept: "dog" },
  { text: "perro", lang: "es", x: -6.0, y: 6.3, cluster: "animal", concept: "dog" },
  { text: "chien", lang: "fr", x: -7.9, y: 5.2, cluster: "animal", concept: "dog" },
  { text: "Hund", lang: "de", x: -6.4, y: 5.1, cluster: "animal", concept: "dog" },
  { text: "犬", lang: "ja", x: -7.1, y: 4.4, cluster: "animal", concept: "dog" },

  // cat — concept centre ~ (-4.5, 6.8)
  { text: "cat", lang: "en", x: -4.2, y: 7.2, cluster: "animal", concept: "cat" },
  { text: "gato", lang: "es", x: -3.2, y: 6.8, cluster: "animal", concept: "cat" },
  { text: "chat", lang: "fr", x: -5.2, y: 6.4, cluster: "animal", concept: "cat" },

  // red — concept centre ~ (7.0, 6.5)
  { text: "red", lang: "en", x: 7.4, y: 7.4, cluster: "color", concept: "red" },
  { text: "rojo", lang: "es", x: 8.1, y: 6.2, cluster: "color", concept: "red" },
  { text: "rouge", lang: "fr", x: 6.4, y: 6.0, cluster: "color", concept: "red" },
  { text: "rot", lang: "de", x: 6.8, y: 7.6, cluster: "color", concept: "red" },
  { text: "赤", lang: "ja", x: 7.9, y: 7.0, cluster: "color", concept: "red" },

  // blue — concept centre ~ (5.5, 4.2)
  { text: "blue", lang: "en", x: 5.9, y: 4.8, cluster: "color", concept: "blue" },
  { text: "azul", lang: "es", x: 6.6, y: 3.8, cluster: "color", concept: "blue" },
  { text: "bleu", lang: "fr", x: 4.9, y: 3.7, cluster: "color", concept: "blue" },

  // happy — concept centre ~ (-5.5, -4.5)
  { text: "happy", lang: "en", x: -5.1, y: -3.8, cluster: "emotion", concept: "happy" },
  { text: "feliz", lang: "es", x: -4.0, y: -4.4, cluster: "emotion", concept: "happy" },
  { text: "heureux", lang: "fr", x: -6.5, y: -4.2, cluster: "emotion", concept: "happy" },
  { text: "幸せ", lang: "ja", x: -5.6, y: -5.3, cluster: "emotion", concept: "happy" },

  // run — concept centre ~ (5.8, -4.2)
  { text: "run", lang: "en", x: 5.4, y: -3.5, cluster: "motion", concept: "run" },
  { text: "correr", lang: "es", x: 6.7, y: -4.1, cluster: "motion", concept: "run" },
  { text: "courir", lang: "fr", x: 4.7, y: -4.2, cluster: "motion", concept: "run" },
  { text: "走る", lang: "ja", x: 5.9, y: -5.0, cluster: "motion", concept: "run" },
];

/**
 * The pairs connected with lines in the cross-lingual visualisation.
 * Each pair is (english_word_index, translation_word_index) into CROSS_LINGUAL_WORDS.
 */
export const CROSS_LINGUAL_CONCEPTS = [
  "dog",
  "cat",
  "red",
  "blue",
  "happy",
  "run",
] as const;

/**
 * A synthetic drift walk through the embedding space — used by DriftWalkViz.
 * Each step is the position after a translation hop, starting at the origin phrase.
 * Hand-tuned to show mild drift early, bigger drift later, with an outlier
 * idiom-collapse at step 4.
 */
export interface DriftWalkStep {
  langCode: string;
  langName: string;
  flag: string;
  /** Position at this step. */
  x: number;
  y: number;
  /** What the back-translated meaning reads like at this step. */
  label: string;
}

export const DRIFT_WALK: DriftWalkStep[] = [
  {
    langCode: "en",
    langName: "English",
    flag: "🇬🇧",
    x: 0,
    y: 0,
    label: "It's raining cats and dogs.",
  },
  {
    langCode: "ja",
    langName: "Japanese",
    flag: "🇯🇵",
    x: 0.6,
    y: -0.3,
    label: "Cats and dogs are falling from the sky.",
  },
  {
    langCode: "ar",
    langName: "Arabic",
    flag: "🇸🇦",
    x: 1.2,
    y: -0.9,
    label: "Cats and dogs are descending from the heavens.",
  },
  {
    langCode: "el",
    langName: "Greek",
    flag: "🇬🇷",
    x: 2.1,
    y: -1.5,
    label: "Animals are descending from the heavens.",
  },
  {
    langCode: "sw",
    langName: "Swahili",
    flag: "🇰🇪",
    x: 3.8,
    y: -2.4,
    label: "A storm of animals falls from above.",
  },
  {
    langCode: "en",
    langName: "English",
    flag: "🇬🇧",
    x: 4.9,
    y: -3.1,
    label: "Creatures pour from the sky in a tempest.",
  },
];
