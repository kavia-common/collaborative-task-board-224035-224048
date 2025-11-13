import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { handleError } from "../utils/error";
import { logger } from "../utils/logger";
import { useAppContext } from "../context/AppContext";

// PUBLIC_INTERFACE
export function useTeams() {
  const { session } = useAppContext();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase || !session) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("teams")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error;
        setTeams(data || []);
      })
      .catch((e) => {
        const err = handleError(e, { scope: "useTeams.fetch" });
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [session]);

  const addTeam = async (name) => {
    if (!supabase) return;
    const optimistic = { id: `tmp_${Date.now()}`, name };
    setTeams((t) => [optimistic, ...t]);
    try {
      const { data, error } = await supabase.from("teams").insert({ name }).select("*").single();
      if (error) throw error;
      setTeams((t) => [data, ...t.filter((x) => x.id !== optimistic.id)]);
    } catch (e) {
      setTeams((t) => t.filter((x) => x.id !== optimistic.id));
      handleError(e, { scope: "useTeams.addTeam" });
    }
  };

  return { teams, loading, error, addTeam };
}
