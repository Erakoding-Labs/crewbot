"use client";

import * as React from "react";

/**
 * Lightweight client-side state shared across the app shell:
 * saved investors and completed learning resources. Backs the
 * dashboard stats so toggles in one page reflect everywhere.
 */
interface AppState {
  savedInvestors: Set<string>;
  toggleSavedInvestor: (id: string) => void;
  completedResources: Set<string>;
  toggleCompletedResource: (id: string) => void;
}

const AppStateContext = React.createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [savedInvestors, setSavedInvestors] = React.useState<Set<string>>(
    new Set()
  );
  const [completedResources, setCompletedResources] = React.useState<
    Set<string>
  >(new Set());

  const toggleSavedInvestor = React.useCallback((id: string) => {
    setSavedInvestors((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleCompletedResource = React.useCallback((id: string) => {
    setCompletedResources((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      savedInvestors,
      toggleSavedInvestor,
      completedResources,
      toggleCompletedResource,
    }),
    [savedInvestors, completedResources, toggleSavedInvestor, toggleCompletedResource]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = React.useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return ctx;
}
