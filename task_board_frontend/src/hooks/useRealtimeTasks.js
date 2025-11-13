import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { logger } from "../utils/logger";
import { handleError } from "../utils/error";

// PUBLIC_INTERFACE
export function useRealtimeTasks(boardId, setTasks) {
  useEffect(() => {
    if (!supabase || !boardId) return;

    const channel = supabase
      .channel(`tasks_board_${boardId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `board_id=eq.${boardId}` },
        (payload) => {
          try {
            if (payload.eventType === "INSERT") {
              setTasks((prev) => {
                if (prev.some((t) => t.id === payload.new.id)) return prev;
                return [...prev, payload.new];
              });
            } else if (payload.eventType === "UPDATE") {
              setTasks((prev) => prev.map((t) => (t.id === payload.new.id ? payload.new : t)));
            } else if (payload.eventType === "DELETE") {
              setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
            }
          } catch (e) {
            handleError(e, { scope: "useRealtimeTasks.handler" });
          }
        }
      )
      .subscribe((status) => {
        logger.info("Realtime status", { status });
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {
        // ignore
      }
    };
  }, [boardId, setTasks]);
}
