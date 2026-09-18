"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

type ViewMode = "recruiter" | "engineer";

type ViewModeContextType = {
  mode: ViewMode;
  toggleMode: () => void;
  setMode: (mode: ViewMode) => void;
  isEngineer: boolean;
  isRecruiter: boolean;
};

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio_view_mode";

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>("engineer");

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
      if (saved === "recruiter" || saved === "engineer") {
        setModeState(saved);
      }
    } catch {
      // Ignore localStorage read errors (private mode / SSR)
    }
  }, []);

  const setMode = useCallback((newMode: ViewMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // Ignore write errors
    }
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "recruiter" ? "engineer" : "recruiter";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  return (
    <ViewModeContext.Provider
      value={{
        mode,
        toggleMode,
        setMode,
        isEngineer: mode === "engineer",
        isRecruiter: mode === "recruiter",
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error("useViewMode must be used within ViewModeProvider");
  return ctx;
}
