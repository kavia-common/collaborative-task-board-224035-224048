import React, { useCallback, useMemo } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import Column from "./Column";
import { useTasks } from "../../hooks/useTasks";
import { useRealtimeTasks } from "../../hooks/useRealtimeTasks";
import { useAppContext } from "../../context/AppContext";

const COLUMNS = [
  { key: "backlog", title: "Backlog" },
  { key: "in_progress", title: "In Progress" },
  { key: "review", title: "Review" },
  { key: "done", title: "Done" },
];

export default function KanbanBoard({ searchQuery = "", filters = {} }) {
  const { currentBoardId } = useAppContext();
  const { tasks, grouped, addTask, updateTask, deleteTask, reorder, setTasks } =
    useTasks(currentBoardId);

  useRealtimeTasks(currentBoardId, setTasks);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || !active) return;
      const taskId = String(active.id);
      const overId = String(over.id);

      const overCol = overId.startsWith("col-") ? overId.replace("col-", "") : null;

      if (overCol) {
        const toStatus = overCol;
        const newIndex = (grouped[toStatus]?.length || 0);
        reorder({ taskId, toStatus, newIndex });
      }
    },
    [grouped, reorder]
  );

  const filteredGrouped = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const statusFilter = filters.status;
    const assigneeFilter = filters.assignee;

    const out = { backlog: [], in_progress: [], review: [], done: [] };
    for (const col of Object.keys(grouped)) {
      out[col] = (grouped[col] || []).filter((t) => {
        if (statusFilter && t.status !== statusFilter) return false;
        if (assigneeFilter && t.assignee_id !== assigneeFilter) return false;
        if (q && !String(t.title || "").toLowerCase().includes(q)) return false;
        return true;
      });
    }
    return out;
  }, [grouped, searchQuery, filters]);

  if (!currentBoardId) {
    return (
      <div className="empty-state">
        <div>
          <h3>Select a board</h3>
          <p>Please choose a team and a board from the sidebar.</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="board">
        <SortableContext items={COLUMNS.map((c) => c.key)} strategy={rectSortingStrategy}>
          {COLUMNS.map((col) => (
            <Column
              key={col.key}
              columnKey={col.key}
              title={col.title}
              tasks={filteredGrouped[col.key] || []}
              onAdd={(p) => addTask({ ...p, board_id: currentBoardId })}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))}
        </SortableContext>
      </div>
      <DragOverlay />
    </DndContext>
  );
}
