import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { handleError } from "../../utils/error";
import { logger } from "../../utils/logger";

// PUBLIC_INTERFACE
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const sendMagicLink = async (email) => {
    if (!supabase) {
      setErr("Supabase not configured.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const redirectTo =
        process.env.REACT_APP_FRONTEND_URL ||
        (typeof window !== "undefined" ? window.location.origin : undefined);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      if (error) throw error;
      setSuccess(true);
      logger.info("Magic link sent");
    } catch (e) {
      const appErr = handleError(e, { scope: "useAuth.sendMagicLink" });
      setErr(appErr.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMagicLink, loading, error, success };
}
