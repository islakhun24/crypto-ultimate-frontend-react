/**
 * ═══════════════════════════════════════════════════════════
 * API MODE CONTEXT - Global toggle for Dummy / Real API
 * ═══════════════════════════════════════════════════════════
 *
 * Usage:
 *   <ApiModeProvider> ... </ApiModeProvider>
 *   const { useDummy, toggle, apiBase } = useApiMode();
 *
 * The toggle state is persisted to localStorage.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'crypto_use_dummy_data';

interface ApiModeContextValue {
  /** Current mode: true = dummy, false = real API */
  useDummy: boolean;
  /** Toggle between dummy and real API */
  toggle: () => void;
  /** Set mode explicitly */
  setMode: (dummy: boolean) => void;
  /** API base URL */
  apiBase: string;
  /** Full base path including /api/v1/exchange */
  basePath: string;
}

const ApiModeContext = createContext<ApiModeContextValue>({
  useDummy: true,
  toggle: () => {},
  setMode: () => {},
  apiBase: 'http://localhost:8080',
  basePath: '/api/v1/exchange',
});

export const ApiModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [useDummy, setUseDummy] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const basePath = '/api/v1/exchange';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(useDummy));
  }, [useDummy]);

  const toggle = useCallback(() => {
    setUseDummy(prev => !prev);
    window.location.reload();
  }, []);

  const setMode = useCallback((dummy: boolean) => {
    setUseDummy(dummy);
  }, []);

  return (
    <ApiModeContext.Provider value={{ useDummy, toggle, setMode, apiBase, basePath }}>
      {children}
    </ApiModeContext.Provider>
  );
};

export const useApiMode = () => useContext(ApiModeContext);

/** Convenience: read current mode without hook (for non-React code) */
export function isDummyMode(): boolean {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved !== null ? saved === 'true' : true;
}
