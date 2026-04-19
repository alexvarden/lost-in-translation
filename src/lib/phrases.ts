import type { PhrasePreset } from "@/types";

export const PHRASES: PhrasePreset[] = [
  // --- Literary ---
  { id: "dickens-1", category: "Literary", text: "It was the best of times, it was the worst of times.", note: "Dickens — famously paradoxical" },
  { id: "tolstoy-1", category: "Literary", text: "All happy families are alike; each unhappy family is unhappy in its own way.", note: "Tolstoy — aphoristic" },
  { id: "austen-1", category: "Literary", text: "It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife.", note: "Austen — ironic register" },
  { id: "melville-1", category: "Literary", text: "Call me Ishmael.", note: "Melville — deceptively simple" },
  { id: "kafka-1", category: "Literary", text: "As Gregor Samsa awoke one morning from uneasy dreams he found himself transformed in his bed into a gigantic insect.", note: "Kafka — syntactic texture" },

  // --- Poetic ---
  { id: "wordsworth-1", category: "Poetic", text: "I wandered lonely as a cloud that floats on high o'er vales and hills.", note: "Wordsworth — visual simile" },
  { id: "thomas-1", category: "Poetic", text: "Do not go gentle into that good night.", note: "Dylan Thomas — compressed imperative" },
  { id: "frost-1", category: "Poetic", text: "Two roads diverged in a wood, and I took the one less travelled by.", note: "Frost — decision as metaphor" },
  { id: "eliot-1", category: "Poetic", text: "This is the way the world ends, not with a bang but a whimper.", note: "Eliot — onomatopoeic contrast" },
  { id: "rumi-1", category: "Poetic", text: "The wound is the place where the Light enters you.", note: "Rumi — paradoxical consolation" },

  // --- Idiomatic ---
  { id: "idiom-1", category: "Idiomatic", text: "A penny for your thoughts.", note: "English idiom — drifts beautifully" },
  { id: "idiom-2", category: "Idiomatic", text: "The early bird catches the worm.", note: "Proverb with concrete imagery" },
  { id: "idiom-3", category: "Idiomatic", text: "Don't bite off more than you can chew.", note: "Metaphor of capacity" },
  { id: "idiom-4", category: "Idiomatic", text: "It's raining cats and dogs.", note: "Classic untranslatable idiom" },
  { id: "idiom-5", category: "Idiomatic", text: "Break a leg.", note: "Theatre good-luck phrase" },
  { id: "idiom-6", category: "Idiomatic", text: "The ball is in your court.", note: "Metaphor of responsibility" },

  // --- Philosophical ---
  { id: "descartes-1", category: "Philosophical", text: "I think, therefore I am.", note: "Descartes — foundational claim" },
  { id: "socrates-1", category: "Philosophical", text: "The unexamined life is not worth living.", note: "Socrates — via Plato" },
  { id: "nietzsche-1", category: "Philosophical", text: "He who fights with monsters should look to it that he himself does not become a monster.", note: "Nietzsche — recursive warning" },
  { id: "sartre-1", category: "Philosophical", text: "Hell is other people.", note: "Sartre — compressed despair" },
  { id: "laotzu-1", category: "Philosophical", text: "A journey of a thousand miles begins with a single step.", note: "Lao Tzu — measured imperative" },

  // --- Playful ---
  { id: "play-1", category: "Playful", text: "The quick brown fox jumps over the lazy dog.", note: "Every-letter pangram" },
  { id: "play-2", category: "Playful", text: "Hello darkness, my old friend.", note: "Familiar address" },
  { id: "play-3", category: "Playful", text: "May the Force be with you.", note: "Pop-culture benediction" },
  { id: "play-4", category: "Playful", text: "I'll be back.", note: "Compressed future tense" },
  { id: "play-5", category: "Playful", text: "Keep calm and carry on.", note: "Wartime imperative pair" },
];

export const DEFAULT_PHRASE_ID = "wordsworth-1";

export function getDefaultPhrase(): PhrasePreset {
  return PHRASES.find((p) => p.id === DEFAULT_PHRASE_ID) ?? PHRASES[0];
}

export const PHRASE_CATEGORIES: Array<PhrasePreset["category"]> = [
  "Literary",
  "Poetic",
  "Idiomatic",
  "Philosophical",
  "Playful",
];
