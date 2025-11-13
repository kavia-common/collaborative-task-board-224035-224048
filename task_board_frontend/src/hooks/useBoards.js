import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { handleError } from "../utils/error";
import { useAppContext } from "../context/AppContext";
import { logger } from "../utils/logger";

// PUBLIC_INTERFACE
export function useBoards(teamId) {
  const { session } = useAppContext();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase || !session || !teamId) {
      setBoards([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("boards")
      .select("*")
      .eq("team_id", teamId)
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error;
        setBoards(data || []);
      })
      .catch((e) => {
        const err = handleError(e, { scope: "useBoards.fetch" });
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [session, teamId]);

  const addBoard = async (name) => {
    if (!supabase) return;
    const optimistic = { id: `tmp_${Date.now()}`, name, team_id: teamId };
    setBoards((b) => [optimistic, ...b]);
    try {
      const { data, error } = await supabase
        .from("boards")
        .insert({ name, team_id: teamId })
        .select("*")
        .single();
      if (error) throw error;
      setBoards((b) => [data, ...b.filter((x) => x.id !== optimistic.id)]);
    } catch (e) {
      setBoards((b) => b.filter((x) => x.id !== optimistic.id));
      handleError(e, { scope: "useBoards.addBoard" });
    }
  };

  return { boards, loading, error, addBoard };
}
