"use client";

import { useCallback, useRef, useState } from "react";
import type { RunState, Step, TranslatorMode } from "@/types";
import { translate } from "@/lib/translate";
import { drift } from "@/lib/drift";

interface UseRunArgs {
  onStepUpdate: (id: string, patch: Partial<Step>) => void;
  onClearTranslations: () => void;
}

interface RunOptions {
  phrase: string;
  tour: Step[];
  mode: TranslatorMode;
  /** Animation speed: ms pause between hops. */
  pauseBetweenHopsMs: number;
}

export function useRun({ onStepUpdate, onClearTranslations }: UseRunArgs) {
  const [state, setState] = useState<RunState>({ kind: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState({ kind: "idle" });
  }, []);

  const run = useCallback(
    async (opts: RunOptions) => {
      // Abort any previous run first.
      abortRef.current?.abort();
      const abort = new AbortController();
      abortRef.current = abort;
      const signal = abort.signal;

      if (!opts.phrase.trim()) {
        setState({ kind: "error", message: "Enter a phrase first" });
        return;
      }
      if (opts.tour.length < 2) {
        setState({ kind: "error", message: "A tour needs at least 2 steps" });
        return;
      }

      onClearTranslations();

      // The "origin" is the phrase itself, sitting at step 0 implicitly.
      // The tour is: step 0 = from origin language (tour[0]) -> step 1 language.
      // We'll treat tour[0] as the origin language and set its translation to the input phrase.

      setState({ kind: "running", currentStepId: opts.tour[0].id });

      // Seed first step with the original phrase.
      onStepUpdate(opts.tour[0].id, {
        translation: opts.phrase,
        driftFromOrigin: 0,
        retentionPct: 100,
        isResolving: false,
      });

      let prevTranslation = opts.phrase;
      let prevLangCode = opts.tour[0].languageCode;

      const originLangCode = opts.tour[0].languageCode;

      try {
        for (let i = 1; i < opts.tour.length; i++) {
          if (signal.aborted) return;
          const step = opts.tour[i];
          setState({ kind: "running", currentStepId: step.id });
          onStepUpdate(step.id, { isResolving: true, error: undefined });

          // 1. Forward: translate prev language -> this step's language.
          const { translated } = await translate(
            {
              text: prevTranslation,
              from: prevLangCode,
              to: step.languageCode,
              mode: opts.mode,
            },
            signal
          );

          // Reveal the native translation immediately so the user sees progress
          // while the back-translation + drift calls resolve in parallel.
          // Clearing `isResolving` here switches the card from spinner to text.
          onStepUpdate(step.id, { translation: translated, isResolving: false });

          // 2. In parallel: drift-from-origin + back-translation into origin language.
          //    - drift is cross-lingual (OpenAI embeddings are multilingual).
          //    - back-translation is always in `natural` mode for a faithful readback,
          //      regardless of the forward mode. This is what renders the drift
          //      legible in the user's own language.
          const needsBackTranslation = step.languageCode !== originLangCode;
          const [driftResult, backResult] = await Promise.all([
            drift({ a: opts.phrase, b: translated }, signal),
            needsBackTranslation
              ? translate(
                  {
                    text: translated,
                    from: step.languageCode,
                    to: originLangCode,
                    mode: "natural",
                  },
                  signal
                ).catch(() => null)
              : Promise.resolve(null),
          ]);

          const driftFromOrigin = Math.max(0, Math.min(1, 1 - driftResult.cosine));
          onStepUpdate(step.id, {
            driftFromOrigin,
            retentionPct: driftResult.retention,
            backTranslation: backResult?.translated,
            isResolving: false,
          });

          // Optional per-hop score for the connector — drift from prev step
          if (i > 1) {
            try {
              const hop = await drift({ a: prevTranslation, b: translated }, signal);
              onStepUpdate(step.id, {
                driftFromPrev: Math.max(0, Math.min(1, 1 - hop.cosine)),
              });
            } catch {
              // hop drift is non-critical; don't fail the run
            }
          }

          // Brief pause for animation pacing between hops.
          if (opts.pauseBetweenHopsMs > 0 && i < opts.tour.length - 1) {
            await sleep(opts.pauseBetweenHopsMs, signal);
          }

          prevTranslation = translated;
          prevLangCode = step.languageCode;
        }

        if (!signal.aborted) {
          setState({ kind: "complete" });
        }
      } catch (err) {
        if (signal.aborted) return;
        const message = err instanceof Error ? err.message : "Run failed";
        setState({ kind: "error", message });
      } finally {
        if (abortRef.current === abort) abortRef.current = null;
      }
    },
    [onClearTranslations, onStepUpdate]
  );

  const reset = useCallback(() => setState({ kind: "idle" }), []);

  return { state, run, cancel, reset };
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("aborted", "AbortError"));
      return;
    }
    const t = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(new DOMException("aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
