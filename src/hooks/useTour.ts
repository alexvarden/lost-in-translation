"use client";

import { useCallback, useReducer } from "react";
import type { Step, Tour } from "@/types";
import { MAX_STEPS, MIN_STEPS, makeStep } from "@/lib/tour";

type Action =
  | { type: "set"; tour: Tour }
  | { type: "add"; afterId?: string; languageCode?: string }
  | { type: "remove"; id: string }
  | { type: "duplicate"; id: string }
  | { type: "setLanguage"; id: string; languageCode: string }
  | { type: "move"; activeId: string; overId: string }
  | { type: "clearTranslations" }
  | { type: "updateStep"; id: string; patch: Partial<Step> };

function reducer(state: Tour, action: Action): Tour {
  switch (action.type) {
    case "set":
      return action.tour;

    case "add": {
      if (state.length >= MAX_STEPS) return state;
      const code = action.languageCode ?? state[state.length - 1]?.languageCode ?? "en";
      const newStep = makeStep(code);
      if (!action.afterId) return [...state, newStep];
      const idx = state.findIndex((s) => s.id === action.afterId);
      if (idx === -1) return [...state, newStep];
      const next = [...state];
      next.splice(idx + 1, 0, newStep);
      return next;
    }

    case "remove": {
      if (state.length <= MIN_STEPS) return state;
      return state.filter((s) => s.id !== action.id);
    }

    case "duplicate": {
      if (state.length >= MAX_STEPS) return state;
      const idx = state.findIndex((s) => s.id === action.id);
      if (idx === -1) return state;
      const copy = makeStep(state[idx].languageCode);
      const next = [...state];
      next.splice(idx + 1, 0, copy);
      return next;
    }

    case "setLanguage": {
      const changedIdx = state.findIndex((s) => s.id === action.id);
      if (changedIdx === -1) return state;
      // Update language + clear translations for the changed step and everything downstream.
      return state.map((s, i) => {
        if (i < changedIdx) return s;
        if (s.id === action.id) return { id: s.id, languageCode: action.languageCode };
        return { id: s.id, languageCode: s.languageCode };
      });
    }

    case "move": {
      const fromIdx = state.findIndex((s) => s.id === action.activeId);
      const toIdx = state.findIndex((s) => s.id === action.overId);
      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return state;
      const next = [...state];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      // Reordering invalidates all translations
      return next.map((s) => ({ id: s.id, languageCode: s.languageCode }));
    }

    case "clearTranslations":
      return state.map((s) => ({ id: s.id, languageCode: s.languageCode }));

    case "updateStep":
      return state.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s));

    default:
      return state;
  }
}

export function useTour(initial: Tour) {
  const [tour, dispatch] = useReducer(reducer, initial);

  const set = useCallback((t: Tour) => dispatch({ type: "set", tour: t }), []);
  const add = useCallback(
    (afterId?: string, languageCode?: string) => dispatch({ type: "add", afterId, languageCode }),
    []
  );
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const duplicate = useCallback((id: string) => dispatch({ type: "duplicate", id }), []);
  const setLanguage = useCallback(
    (id: string, languageCode: string) => dispatch({ type: "setLanguage", id, languageCode }),
    []
  );
  const move = useCallback(
    (activeId: string, overId: string) => dispatch({ type: "move", activeId, overId }),
    []
  );
  const clearTranslations = useCallback(() => dispatch({ type: "clearTranslations" }), []);
  const updateStep = useCallback(
    (id: string, patch: Partial<Step>) => dispatch({ type: "updateStep", id, patch }),
    []
  );

  return {
    tour,
    set,
    add,
    remove,
    duplicate,
    setLanguage,
    move,
    clearTranslations,
    updateStep,
  };
}
