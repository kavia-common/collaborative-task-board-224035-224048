import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { logger } from "../utils/logger";

const defaultFlags = (() => {
  try {
    return JSON.parse(process.env.REACT_APP_FEATURE_FLAGS || "{}");
  } catch {
    return {};
  }
})();

const AppContext = createContext(null);

// PUBLIC_INTERFACE
export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [flags] = useState(defaultFlags);
  const [isConfigured, setIsConfigured] = useState(Boolean(supabase));

  // Supabase auth session handling
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      isConfigured,
      currentTeamId,
      setCurrentTeamId,
      currentBoardId,
      setCurrentBoardId,
      flags,
    }),
    [session, isConfigured, currentTeamId, currentBoardId, flags]
  );

  useEffect(() => {
    logger.info("AppContext initialized", {
      isConfigured,
      hasSession: Boolean(session),
    });
  }, [isConfigured, session]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
