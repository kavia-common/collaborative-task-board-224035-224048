import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { handleError } from "../utils/error";
import { logger } from "../utils/logger";

// PUBLIC_INTERFACE
export function useTasks(boardId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase || !boardId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("tasks")
      .select("*")
      .eq("board_id", boardId)
      .order("order_index", { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error;
        setTasks(data || []);
      })
      .catch((e) => {
        const err = handleError(e, { scope: "useTasks.fetch" });
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [boardId]);

  const grouped = useMemo(() => {
    const by = { backlog: [], in_progress: [], review: [], done: [] };
    for (const t of tasks) {
      by[t.status]?.push(t);
    }
    return by;
  }, [tasks]);

  const addTask = async (partial) => {
    if (!supabase) return;
    const order_index = (grouped[partial.status]?.length || 0) * 1000 + 1000;
    const optimistic = {
      id: `tmp_${Date.now()}`,
      title: partial.title || "New Task",
      description: partial.description || "",
      status: partial.status || "backlog",
      order_index,
      assignee_id: partial.assignee_id || null,
      labels: partial.labels || [],
      due_date: partial.due_date || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      board_id: partial.board_id || "",
    };
    setTasks((prev) => [...prev, optimistic]);
    try {
      const { data, error } = await supabase.from("tasks").insert(optimistic).select("*").single();
      if (error) throw error;
      setTasks((prev) => [data, ...prev.filter((x) => x.id !== optimistic.id)]);
    } catch (e) {
      setTasks((prev) => prev.filter((x) => x.id !== optimistic.id));
      handleError(e, { scope: "useTasks.addTask" });
    }
  };

  const updateTask = async (id, patch) => {
    if (!supabase) return;
    const prev = tasks.find((t) => t.id === id);
    if (!prev) return;
    const optimistic = { ...prev, ...patch, updated_at: new Date().toISOString() };
    setTasks((list) => list.map((t) => (t.id === id ? optimistic : t)));
    try {
      const { error } = await supabase.from("tasks").update(patch).eq("id", id);
      if (error) throw error;
    } catch (e) {
      // rollback
      setTasks((list) => list.map((t) => (t.id === id ? prev : t)));
      handleError(e, { scope: "useTasks.updateTask" });
    }
  };

  const deleteTask = async (id) => {
    if (!supabase) return;
    const prev = tasks;
    setTasks((list) => list.filter((t) => t.id !== id));
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    } catch (e) {
      setTasks(prev);
      handleError(e, { scope: "useTasks.deleteTask" });
    }
  };

  const reorder = async ({ taskId, toStatus, newIndex }) => {
    if (!supabase) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Compute new order_index space: use 1000 gaps
    const col = tasks
      .filter((t) => (toStatus ? t.status === toStatus : t.status === task.status))
      .filter((t) => t.id !== taskId)
      .sort((a, b) => a.order_index - b.order_index);

    const before = col[newIndex - 1];
    const after = col[newIndex];

    let newOrderIdx = 1000;
    if (before && after) newOrderIdx = Math.floor((before.order_index + after.order_index) / 2);
    else if (!before && after) newOrderIdx = after.order_index - 100;
    else if (before && !after) newOrderIdx = before.order_index + 100;

    const patch = {
      status: toStatus || task.status,
      order_index: newOrderIdx,
    };

    await updateTask(taskId, patch);
  };

  return { tasks, grouped, loading, error, addTask, updateTask, deleteTask, reorder, setTasks };
}
