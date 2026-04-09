"use client";

import { createContext, useContext, useState, useCallback } from "react";

type ViewMode = "recruiter" | "engineer";

type ViewModeContextType = {
  mode: ViewMode;
  toggleMode: () => void;
  isEngineer: boolean;
  isRecruiter: boolean;
};

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("engineer");

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "recruiter" ? "engineer" : "recruiter"));
  }, []);

  return (
    <ViewModeContext.Provider
      value={{
        mode,
        toggleMode,
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
