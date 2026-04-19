# Lost in Translation

> *Watch meaning melt as a phrase travels through language.*

A standalone Next.js showcase app for Crane. Type (or pick) a phrase, build a custom tour through up to 12 languages (from a library of 40), and watch the semantic drift accrue at every hop — measured via embedding cosine similarity against the original.

Part of Crane's `showcase-projects.md` series — not for sale, built to demonstrate production-quality capability.

## Two routes

| Route | What it is |
|---|---|
| `/` | **The demo** — the interactive translation-chain tool. Share links encode phrase + tour + mode. |
| `/explainer` | **The article** — a visual explanation of embedding spaces, cosine similarity, and why meaning drifts. Five interactive figures + the demo embedded at the climax. |

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Add your OpenAI key
cp .env.local.example .env.local
# Edit .env.local and paste your key

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or whatever port Next reports).

---

## Environment

| Var | Required | Notes |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Used by both `/api/translate` (`gpt-4o-mini`) and `/api/drift` (`text-embedding-3-small`). |

The key is only read on the server inside API routes — it never reaches the browser.

---

## What it does

1. **Translator** — `gpt-4o-mini` translates the previous step's output into the next language, with a system prompt that changes per mode:
   - `literal` — word-for-word, idioms preserved as-is
   - `natural` — idiomatic, native phrasing (default)
   - `poetic` — literary, re-imagined with rhythm and imagery
2. **Drift scoring** — after each hop, the translation is embedded with `text-embedding-3-small` and compared to the *original phrase* via cosine similarity. OpenAI embeddings are cross-lingual, so this measurement is valid across scripts and families.
3. **Retention %** — the headline score, mapping cosine `0.30..1.00` → `0..100%`. Tuned so a perfect translation lands around 100 and totally unrelated text lands around 0.

---

## Using it

- **Add step** — click the `+` at the end of the tour, or hover between any two cards to reveal the insert-between button.
- **Remove step** — click the `×` on any card. Minimum 2 steps.
- **Reorder** — drag any card by its handle. Reordering clears existing translations.
- **Change language** — click the language on any card; searchable dropdown with 40 languages grouped by script.
- **Duplicate** — click the duplicate icon on any card.
- **Mode** — top-right selector.
- **Settings** — animation speed + toggles.
- **Run** — big crimson button, or press `⌘↵` / `Ctrl+Enter`.
- **Share** — after a run, the Share button copies a URL encoding phrase + tour + mode.

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx           # Root shell, Inter font, brand shell
│   ├── page.tsx             # Main canvas — composes everything
│   ├── globals.css          # Crane tokens + glass utilities
│   └── api/
│       ├── translate/route.ts   # POST: { text, from, to, mode } -> { translated }
│       └── drift/route.ts       # POST: { a, b } -> { cosine, retention }
├── components/
│   ├── flow/                # TourFlow, StepCard, LanguagePicker, Connector, InsertButton
│   ├── phrase/              # PhraseInput, PhraseLibrary
│   ├── results/             # ResultsBar, DriftChart
│   ├── controls/            # ModeSelector, SettingsMenu, RunButton
│   └── layout/              # Header
├── hooks/
│   ├── useTour.ts           # Reducer: add, remove, move, duplicate, setLanguage
│   └── useRun.ts            # Orchestrates sequential translate + drift calls
├── lib/
│   ├── languages.ts         # 40 languages, script groups, flags, direction
│   ├── phrases.ts           # ~25 preset phrases across 5 categories
│   ├── openai.ts            # Server-side client + prompts + cosine
│   ├── translate.ts         # Client fetch wrapper
│   ├── drift.ts             # Client fetch wrapper + colour helpers
│   ├── tour.ts              # MIN/MAX + step factory
│   └── share.ts             # URL state encode/decode
└── types/
    └── index.ts             # Shared types
```

### Why this shape
- **The flow diagram IS the editor.** No separate "setup form" and "results view". Every change to the tour lives in the same cards that will show the translations.
- **All OpenAI calls are server-side.** The browser hits only `/api/*` routes, so the key stays out of the bundle.
- **State invalidation is explicit.** Any edit that changes the semantics of the tour (add/remove/reorder/setLanguage) clears the run data so the visible state never lies.
- **No database, no auth.** Share links encode phrase + tour + mode in the URL — simple, durable, works offline once loaded.

---

## Tech

- Next.js 16 · React 19 · TypeScript · Tailwind 4
- `openai` SDK (server only)
- `@dnd-kit` for drag-reorder
- `framer-motion` for sequential reveals
- `clsx` for conditional classes

---

## Known limits

- `gpt-4o-mini` is cheap and fast but isn't the strongest translator for low-resource languages (Māori, Xhosa). Expect more noise there — which is often the most interesting part of a run.
- No persistent caching. Identical runs hit the API each time. Consider adding an LRU or KV in front for production.
- No rate limiting in the API routes yet. Add one before deploying publicly.
- Mobile layout: tour scrolls horizontally. Usable but not optimised for thumbs.

---

## Ideas for future passes

- Multi-provider toggle (OpenAI vs Claude vs Gemini) to show personality differences
- LLM-as-judge score as a second drift metric (complementing the embedding score)
- Export-as-image for social sharing
- "Greatest hits" hall of fame with the most-drifted public runs
- Explain the diference between this embedding symatic drift and that of actual translation.
- Look into funny ones that we can share : https://www.reddit.com/r/FalseFriends/comments/1bajku9/fastidious_en_vs_fastidioso_it/

---

## Related

- `../showcase-projects.md` — the ten-project showcase list this belongs to
- `../capabilities.md` — Crane's production capabilities
- `../brand-samples/node-flow-final-v2.html` — source of the visual language
