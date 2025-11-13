import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

export default function Column({ columnKey, title, tasks, onAdd, onUpdate, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${columnKey}` });
  const [newTitle, setNewTitle] = useState("");

  const completed = columnKey === "done" ? tasks.length : 0;
  const all = tasks.length || 1;
  const pct = Math.min(100, Math.round((completed / all) * 100));

  return (
    <div
      className="column"
      ref={setNodeRef}
      style={{ outline: isOver ? "2px dashed var(--color-primary)" : "none" }}
    >
      <div className="column-header">
        <div>
          <div style={{ fontWeight: 700 }}>{title}</div>
          <div className="progress">
            <div className="bar" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span style={{ color: "#6b7280" }}>{tasks.length}</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          className="input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add task"
          aria-label={`Add task to ${title}`}
        />
        <button
          className="btn"
          onClick={() => {
            if (newTitle.trim()) {
              onAdd({ title: newTitle.trim(), status: columnKey });
              setNewTitle("");
            }
          }}
        >
          +
        </button>
      </div>

      <div className="tasks">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
