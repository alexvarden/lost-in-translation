"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { PhraseInput } from "@/components/phrase/PhraseInput";
import { PhraseLibrary } from "@/components/phrase/PhraseLibrary";
import { TourFlow } from "@/components/flow/TourFlow";
import { ModeSelector } from "@/components/controls/ModeSelector";
import { RunButton } from "@/components/controls/RunButton";
import { SettingsMenu } from "@/components/controls/SettingsMenu";
import { ResultsBar } from "@/components/results/ResultsBar";
import { useTour } from "@/hooks/useTour";
import { useRun } from "@/hooks/useRun";
import { defaultTour, makeStep } from "@/lib/tour";
import { getDefaultPhrase } from "@/lib/phrases";
import { encodeShareUrl, decodeShareUrl } from "@/lib/share";
import type { AnimationSpeed, PhrasePreset, Step, TranslatorMode } from "@/types";

const SPEED_TO_MS: Record<AnimationSpeed, number> = {
  slow: 600,
  medium: 250,
  instant: 0,
};

export interface TranslationPlaygroundProps {
  /** Optional preset phrase — wins over the default. */
  initialPhrase?: string;
  /** Optional preset tour (by language codes) — wins over the default. */
  initialTourCodes?: string[];
  /** Optional preset translator mode. Defaults to "natural". */
  initialMode?: TranslatorMode;
  /** Read share params from window.location on mount. Enable on the standalone route, disable inside articles. */
  hydrateFromUrl?: boolean;
  /** Show the top control bar (mode selector + settings). Defaults to true. */
  showControls?: boolean;
  /** Show the results bar below the flow. Defaults to true. */
  showResults?: boolean;
  /** Show the prose explainer below the results. Defaults to true on standalone, false when embedded. */
  showExplainer?: boolean;
  /** Optional heading rendered above the playground (used when embedded in an article). */
  embedTitle?: string;
  /** Optional compact mode for embedding — subtler padding, no outer max-width. */
  variant?: "standalone" | "embedded";
}

export function TranslationPlayground({
  initialPhrase,
  initialTourCodes,
  initialMode = "natural",
  hydrateFromUrl = false,
  showControls = true,
  showResults = true,
  showExplainer = false,
  embedTitle,
  variant = "standalone",
}: TranslationPlaygroundProps) {
  // --- State ---
  const [phrase, setPhrase] = useState<string>(
    () => initialPhrase ?? getDefaultPhrase().text
  );
  const [mode, setMode] = useState<TranslatorMode>(initialMode);
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>("medium");
  const [showPerStep, setShowPerStep] = useState<boolean>(true);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const initialTour: Step[] = useMemo(() => {
    if (initialTourCodes && initialTourCodes.length >= 2) {
      return initialTourCodes.map((code) => makeStep(code));
    }
    return defaultTour();
  }, [initialTourCodes]);

  const tourHook = useTour(initialTour);

  const runHook = useRun({
    onStepUpdate: tourHook.updateStep,
    onClearTranslations: tourHook.clearTranslations,
  });

  const isRunning = runHook.state.kind === "running";
  const isComplete = runHook.state.kind === "complete";
  const activeStepId =
    runHook.state.kind === "running" ? runHook.state.currentStepId : null;

  // --- Hydrate from URL on mount (standalone route only) ---
  useEffect(() => {
    if (!hydrateFromUrl) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const shared = decodeShareUrl(params);
    if (shared.phrase) setPhrase(shared.phrase);
    if (shared.mode) setMode(shared.mode);
    if (shared.tourCodes && shared.tourCodes.length >= 2) {
      tourHook.set(shared.tourCodes.map((code) => makeStep(code)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrateFromUrl]);

  // --- Actions ---
  const handleRun = useCallback(() => {
    if (!phrase.trim() || tourHook.tour.length < 2) return;
    runHook.run({
      phrase: phrase.trim(),
      tour: tourHook.tour,
      mode,
      pauseBetweenHopsMs: SPEED_TO_MS[animationSpeed],
    });
  }, [phrase, tourHook.tour, mode, animationSpeed, runHook]);

  const handlePickPhrase = useCallback(
    (picked: PhrasePreset) => {
      setPhrase(picked.text);
      tourHook.clearTranslations();
      runHook.reset();
    },
    [tourHook, runHook]
  );

  const handlePhraseChange = useCallback(
    (v: string) => {
      setPhrase(v);
      if (isComplete) {
        tourHook.clearTranslations();
        runHook.reset();
      }
    },
    [isComplete, tourHook, runHook]
  );

  const handleModeChange = useCallback(
    (m: TranslatorMode) => {
      setMode(m);
      if (isComplete) {
        tourHook.clearTranslations();
        runHook.reset();
      }
    },
    [isComplete, tourHook, runHook]
  );

  // --- Keyboard shortcut: Cmd/Ctrl + Enter to run ---
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isRunning) handleRun();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleRun, isRunning]);

  // --- Share URL (only meaningful on standalone, but safe to compute always) ---
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return null;
    // Always share-link to the standalone demo page, not the article.
    return encodeShareUrl(
      {
        phrase,
        tourCodes: tourHook.tour.map((s) => s.languageCode),
        mode,
      },
      `${window.location.origin}/`
    );
  }, [phrase, tourHook.tour, mode]);

  const runDisabled = !phrase.trim() || tourHook.tour.length < 2;

  return (
    <div
      className={clsx(
        "relative",
        variant === "embedded" && "glass rounded-2xl p-5 not-prose"
      )}
    >
      {embedTitle && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-crimson-400 mb-1">
              Interactive
            </div>
            <h3 className="text-dark-100 text-lg font-semibold">{embedTitle}</h3>
          </div>
          {showControls && (
            <div className="flex items-center gap-2 shrink-0">
              <ModeSelector value={mode} onChange={handleModeChange} disabled={isRunning} />
              <SettingsMenu
                speed={animationSpeed}
                onSpeedChange={setAnimationSpeed}
                showPerStep={showPerStep}
                onShowPerStepChange={setShowPerStep}
              />
            </div>
          )}
        </div>
      )}

      {!embedTitle && showControls && (
        <div className="flex items-center justify-end gap-2 mb-4">
          <ModeSelector value={mode} onChange={handleModeChange} disabled={isRunning} />
          <SettingsMenu
            speed={animationSpeed}
            onSpeedChange={setAnimationSpeed}
            showPerStep={showPerStep}
            onShowPerStepChange={setShowPerStep}
          />
        </div>
      )}

      {/* Phrase input */}
      <section>
        <PhraseInput
          value={phrase}
          onChange={handlePhraseChange}
          onOpenLibrary={() => setLibraryOpen(true)}
          disabled={isRunning}
        />
      </section>

      {/* Tour flow */}
      <section className="mt-6">
        <TourFlow
          tour={tourHook.tour}
          activeStepId={activeStepId}
          isRunning={isRunning}
          onReorder={tourHook.move}
          onAddAfter={(id) => tourHook.add(id)}
          onAddAtEnd={() => tourHook.add()}
          onRemove={tourHook.remove}
          onDuplicate={tourHook.duplicate}
          onSetLanguage={tourHook.setLanguage}
        />
      </section>

      {/* Run button */}
      <section className="mt-2 flex items-center justify-center gap-4">
        <RunButton
          onClick={handleRun}
          isRunning={isRunning}
          onCancel={runHook.cancel}
          disabled={runDisabled}
        />
        {runHook.state.kind === "error" && (
          <div className="text-sm text-crimson-300">{runHook.state.message}</div>
        )}
      </section>

      {/* Results */}
      {showResults && (
        <ResultsBar
          phrase={phrase}
          tour={tourHook.tour}
          isComplete={isComplete}
          shareUrl={shareUrl}
        />
      )}

      {/* Optional prose explainer — only on standalone */}
      {showExplainer && (
        <section className="mt-16 max-w-2xl text-sm text-dark-400 leading-relaxed">
          <h2 className="text-dark-200 text-base font-medium mb-2">How this works</h2>
          <p className="mb-3">
            Every step translates the previous step&apos;s output using{" "}
            <code className="text-crimson-300">gpt-4o-mini</code>. After each hop, the
            translation is embedded with{" "}
            <code className="text-crimson-300">text-embedding-3-small</code> and
            compared against the original phrase via cosine similarity — giving you a
            per-step &ldquo;retention&rdquo; score that tracks semantic drift from the
            source.
          </p>
          <p className="mb-3">
            Each non-origin step also renders a back-translation into the origin
            language so you can read the drift in your own language as the chain
            progresses.
          </p>
          <p>
            Want to understand <em>why</em> this works at all? Read the{" "}
            <a
              href="/explainer"
              className="text-crimson-300 underline decoration-crimson-500/40 hover:decoration-crimson-500"
            >
              companion article on embedding spaces
            </a>{" "}
            — it explains how LLMs turn language into geometry.
          </p>
        </section>
      )}

      <PhraseLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onPick={handlePickPhrase}
      />
    </div>
  );
}
