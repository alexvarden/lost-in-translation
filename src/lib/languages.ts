import type { Language, ScriptGroup } from "@/types";

export const SCRIPT_LABELS: Record<ScriptGroup, string> = {
  "latin-western": "Latin · Western European",
  "latin-eastern": "Latin · Eastern European & Turkic",
  cyrillic: "Cyrillic",
  cjk: "CJK · East Asian",
  arabic: "Arabic script (RTL)",
  brahmic: "Brahmic · South & Southeast Asian",
  other: "Other scripts & languages",
};

export const LANGUAGES: Language[] = [
  // --- Latin · Western European ---
  { code: "en", name: "English", endonym: "English", flag: "🇬🇧", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "Analytic, Germanic" },
  { code: "es", name: "Spanish", endonym: "Español", flag: "🇪🇸", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "Romance" },
  { code: "fr", name: "French", endonym: "Français", flag: "🇫🇷", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "Romance" },
  { code: "de", name: "German", endonym: "Deutsch", flag: "🇩🇪", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "Germanic, compound-rich" },
  { code: "it", name: "Italian", endonym: "Italiano", flag: "🇮🇹", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "Romance" },
  { code: "pt", name: "Portuguese", endonym: "Português", flag: "🇵🇹", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "Romance" },
  { code: "nl", name: "Dutch", endonym: "Nederlands", flag: "🇳🇱", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "West Germanic" },
  { code: "sv", name: "Swedish", endonym: "Svenska", flag: "🇸🇪", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "North Germanic" },
  { code: "no", name: "Norwegian", endonym: "Norsk", flag: "🇳🇴", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "North Germanic" },
  { code: "da", name: "Danish", endonym: "Dansk", flag: "🇩🇰", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "North Germanic" },
  { code: "cy", name: "Welsh", endonym: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "Celtic, VSO" },
  { code: "ga", name: "Irish", endonym: "Gaeilge", flag: "🇮🇪", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "Celtic, VSO" },
  { code: "is", name: "Icelandic", endonym: "Íslenska", flag: "🇮🇸", script: "latin-western", scriptLabel: SCRIPT_LABELS["latin-western"], dir: "ltr", note: "Archaic Germanic" },

  // --- Latin · Eastern European & Turkic ---
  { code: "pl", name: "Polish", endonym: "Polski", flag: "🇵🇱", script: "latin-eastern", scriptLabel: SCRIPT_LABELS["latin-eastern"], dir: "ltr", note: "West Slavic" },
  { code: "cs", name: "Czech", endonym: "Čeština", flag: "🇨🇿", script: "latin-eastern", scriptLabel: SCRIPT_LABELS["latin-eastern"], dir: "ltr", note: "West Slavic" },
  { code: "hu", name: "Hungarian", endonym: "Magyar", flag: "🇭🇺", script: "latin-eastern", scriptLabel: SCRIPT_LABELS["latin-eastern"], dir: "ltr", note: "Uralic, agglutinative" },
  { code: "ro", name: "Romanian", endonym: "Română", flag: "🇷🇴", script: "latin-eastern", scriptLabel: SCRIPT_LABELS["latin-eastern"], dir: "ltr", note: "Eastern Romance" },
  { code: "fi", name: "Finnish", endonym: "Suomi", flag: "🇫🇮", script: "latin-eastern", scriptLabel: SCRIPT_LABELS["latin-eastern"], dir: "ltr", note: "Uralic, 15 cases" },
  { code: "tr", name: "Turkish", endonym: "Türkçe", flag: "🇹🇷", script: "latin-eastern", scriptLabel: SCRIPT_LABELS["latin-eastern"], dir: "ltr", note: "Turkic, agglutinative" },

  // --- Cyrillic ---
  { code: "ru", name: "Russian", endonym: "Русский", flag: "🇷🇺", script: "cyrillic", scriptLabel: SCRIPT_LABELS.cyrillic, dir: "ltr", note: "East Slavic" },
  { code: "uk", name: "Ukrainian", endonym: "Українська", flag: "🇺🇦", script: "cyrillic", scriptLabel: SCRIPT_LABELS.cyrillic, dir: "ltr", note: "East Slavic" },
  { code: "bg", name: "Bulgarian", endonym: "Български", flag: "🇧🇬", script: "cyrillic", scriptLabel: SCRIPT_LABELS.cyrillic, dir: "ltr", note: "South Slavic" },
  { code: "sr", name: "Serbian", endonym: "Српски", flag: "🇷🇸", script: "cyrillic", scriptLabel: SCRIPT_LABELS.cyrillic, dir: "ltr", note: "South Slavic" },

  // --- CJK ---
  { code: "zh", name: "Mandarin (Simplified)", endonym: "简体中文", flag: "🇨🇳", script: "cjk", scriptLabel: SCRIPT_LABELS.cjk, dir: "ltr", note: "Tonal, analytic" },
  { code: "zh-hant", name: "Traditional Chinese", endonym: "繁體中文", flag: "🇹🇼", script: "cjk", scriptLabel: SCRIPT_LABELS.cjk, dir: "ltr", note: "Tonal, analytic" },
  { code: "ja", name: "Japanese", endonym: "日本語", flag: "🇯🇵", script: "cjk", scriptLabel: SCRIPT_LABELS.cjk, dir: "ltr", note: "Agglutinative, SOV" },
  { code: "ko", name: "Korean", endonym: "한국어", flag: "🇰🇷", script: "cjk", scriptLabel: SCRIPT_LABELS.cjk, dir: "ltr", note: "Agglutinative, SOV" },

  // --- Arabic script ---
  { code: "ar", name: "Arabic", endonym: "العربية", flag: "🇸🇦", script: "arabic", scriptLabel: SCRIPT_LABELS.arabic, dir: "rtl", note: "Semitic, root-pattern" },
  { code: "fa", name: "Persian (Farsi)", endonym: "فارسی", flag: "🇮🇷", script: "arabic", scriptLabel: SCRIPT_LABELS.arabic, dir: "rtl", note: "Indo-European, RTL" },
  { code: "ur", name: "Urdu", endonym: "اردو", flag: "🇵🇰", script: "arabic", scriptLabel: SCRIPT_LABELS.arabic, dir: "rtl", note: "Indo-Aryan, RTL" },

  // --- Brahmic ---
  { code: "hi", name: "Hindi", endonym: "हिन्दी", flag: "🇮🇳", script: "brahmic", scriptLabel: SCRIPT_LABELS.brahmic, dir: "ltr", note: "Indo-Aryan, Devanagari" },
  { code: "bn", name: "Bengali", endonym: "বাংলা", flag: "🇧🇩", script: "brahmic", scriptLabel: SCRIPT_LABELS.brahmic, dir: "ltr", note: "Indo-Aryan" },
  { code: "ta", name: "Tamil", endonym: "தமிழ்", flag: "🇮🇳", script: "brahmic", scriptLabel: SCRIPT_LABELS.brahmic, dir: "ltr", note: "Dravidian, agglutinative" },
  { code: "th", name: "Thai", endonym: "ไทย", flag: "🇹🇭", script: "brahmic", scriptLabel: SCRIPT_LABELS.brahmic, dir: "ltr", note: "Tai-Kadai, tonal" },

  // --- Other scripts & languages ---
  { code: "el", name: "Greek", endonym: "Ελληνικά", flag: "🇬🇷", script: "other", scriptLabel: SCRIPT_LABELS.other, dir: "ltr", note: "Hellenic" },
  { code: "he", name: "Hebrew", endonym: "עברית", flag: "🇮🇱", script: "other", scriptLabel: SCRIPT_LABELS.other, dir: "rtl", note: "Semitic, RTL" },
  { code: "hy", name: "Armenian", endonym: "Հայերեն", flag: "🇦🇲", script: "other", scriptLabel: SCRIPT_LABELS.other, dir: "ltr", note: "Indo-European, own script" },
  { code: "ka", name: "Georgian", endonym: "ქართული", flag: "🇬🇪", script: "other", scriptLabel: SCRIPT_LABELS.other, dir: "ltr", note: "Kartvelian, Mkhedruli script" },
  { code: "sw", name: "Swahili", endonym: "Kiswahili", flag: "🇰🇪", script: "other", scriptLabel: SCRIPT_LABELS.other, dir: "ltr", note: "Bantu" },
  { code: "vi", name: "Vietnamese", endonym: "Tiếng Việt", flag: "🇻🇳", script: "other", scriptLabel: SCRIPT_LABELS.other, dir: "ltr", note: "Austroasiatic, tonal" },
  { code: "id", name: "Indonesian", endonym: "Bahasa Indonesia", flag: "🇮🇩", script: "other", scriptLabel: SCRIPT_LABELS.other, dir: "ltr", note: "Austronesian" },
  { code: "tl", name: "Tagalog", endonym: "Tagalog", flag: "🇵🇭", script: "other", scriptLabel: SCRIPT_LABELS.other, dir: "ltr", note: "Austronesian" },
  { code: "mi", name: "Māori", endonym: "Te Reo Māori", flag: "🇳🇿", script: "other", scriptLabel: SCRIPT_LABELS.other, dir: "ltr", note: "Austronesian" },
  { code: "xh", name: "Xhosa", endonym: "isiXhosa", flag: "🇿🇦", script: "other", scriptLabel: SCRIPT_LABELS.other, dir: "ltr", note: "Bantu, click consonants" },
];

export const LANGUAGE_MAP: Record<string, Language> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l])
);

export function getLanguage(code: string): Language {
  const lang = LANGUAGE_MAP[code];
  if (!lang) {
    // Fall back to English so the app never crashes on a bad share link.
    return LANGUAGE_MAP.en;
  }
  return lang;
}

export const SCRIPT_ORDER: ScriptGroup[] = [
  "latin-western",
  "latin-eastern",
  "cyrillic",
  "cjk",
  "arabic",
  "brahmic",
  "other",
];

export interface LanguageGroup {
  script: ScriptGroup;
  label: string;
  items: Language[];
}

/** Group languages by script, in canonical order, with items sorted by name. */
export function groupLanguages(filter?: string): LanguageGroup[] {
  const q = (filter ?? "").trim().toLowerCase();
  const groups: LanguageGroup[] = SCRIPT_ORDER.map((script) => ({
    script,
    label: SCRIPT_LABELS[script],
    items: LANGUAGES.filter((l) => l.script === script)
      .filter((l) => {
        if (!q) return true;
        return (
          l.name.toLowerCase().includes(q) ||
          l.endonym.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q) ||
          l.scriptLabel.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));
  return groups.filter((g) => g.items.length > 0);
}

export const DEFAULT_TOUR_CODES: string[] = ["en", "ja", "ar", "el", "sw", "en"];
