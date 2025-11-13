import React, { useCallback } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
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

export default function KanbanBoard() {
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

      // overId is formatted as "col-<status>" or task id if using sortable lists.
      const overCol = overId.startsWith("col-") ? overId.replace("col-", "") : null;

      if (overCol) {
        const toStatus = overCol;
        const newIndex = (grouped[toStatus]?.length || 0); // place at end for simplicity
        reorder({ taskId, toStatus, newIndex });
      }
    },
    [grouped, reorder]
  );

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
              tasks={grouped[col.key] || []}
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
