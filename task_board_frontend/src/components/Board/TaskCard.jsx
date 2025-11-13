import React, { useState } from "react";
import DOMPurify from "dompurify";

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const save = () => {
    setEditing(false);
    const clean = DOMPurify.sanitize(title);
    if (clean !== task.title) onUpdate(task.id, { title: clean });
  };

  const dueLabel = task.due_date ? new Date(task.due_date).toLocaleDateString() : null;

  return (
    <div className="task-card">
      {!editing ? (
        <div
          className="task-title"
          onDoubleClick={() => setEditing(true)}
          title="Double-click to edit title"
        >
          {task.title}
        </div>
      ) : (
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
          autoFocus
        />
      )}
      <div className="task-meta">
        {task.labels?.slice(0, 3).map((l) => (
          <span key={l} className="chip">
            {l}
          </span>
        ))}
        {dueLabel && <span className="chip" title="Due date">{dueLabel}</span>}
        <button
          className="btn-ghost"
          style={{ marginLeft: "auto" }}
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          title="Delete task"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
