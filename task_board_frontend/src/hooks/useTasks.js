import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { handleError } from "../utils/error";
import { logger } from "../utils/logger";
import { uid } from "../utils/helpers";

// PUBLIC_INTERFACE
export function useTasks(boardId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState("");

  // Load tasks: Supabase or demo data
  useEffect(() => {
    if (!boardId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    if (!supabase) {
      // Demo data (read-only)
      setTasks([
        {
          id: uid("t"),
          title: "Design board layout",
          description: "",
          status: "backlog",
          order_index: 1000,
          assignee_id: null,
          labels: ["design"],
          due_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          board_id: boardId,
        },
        {
          id: uid("t"),
          title: "Implement Kanban columns",
          description: "",
          status: "in_progress",
          order_index: 1000,
          assignee_id: null,
          labels: ["frontend"],
          due_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          board_id: boardId,
        },
        {
          id: uid("t"),
          title: "Wire Supabase Realtime",
          description: "",
          status: "review",
          order_index: 1000,
          assignee_id: null,
          labels: ["backend"],
          due_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          board_id: boardId,
        },
        {
          id: uid("t"),
          title: "Polish theme and styles",
          description: "",
          status: "done",
          order_index: 1000,
          assignee_id: null,
          labels: ["ui"],
          due_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          board_id: boardId,
        },
      ]);
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
    if (!supabase) return; // demo mode is read-only
    const order_index = (grouped[partial.status]?.length || 0) * 1000 + 1000;
    const optimistic = {
      id: uid("tmp"),
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
    if (!supabase) return; // read-only demo
    const prev = tasks.find((t) => t.id === id);
    if (!prev) return;
    const optimistic = { ...prev, ...patch, updated_at: new Date().toISOString() };
    setTasks((list) => list.map((t) => (t.id === id ? optimistic : t)));
    try {
      const { error } = await supabase.from("tasks").update(patch).eq("id", id);
      if (error) throw error;
    } catch (e) {
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

    if (!supabase) {
      // demo local reorder
      setTasks((list) => list.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));
      return;
    }

    await updateTask(taskId, patch);
  };

  return { tasks, grouped, loading, error, addTask, updateTask, deleteTask, reorder, setTasks };
}
