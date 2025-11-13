import React from "react";
import { calcProgress } from "../../utils/helpers";

/**
 * BoardHeader
 * Displays board title, filter controls, and overall progress.
 *
 * Props:
 * - title: string
 * - grouped: record of status -> Task[]
 * - onSearch: (q: string) => void
 * - onFilterChange: (filter: {assignee?: string, status?: string}) => void
 */
export default function BoardHeader({ title = "Board", grouped, onSearch, onFilterChange }) {
  const { total, completed, pct } = calcProgress(grouped);

  return (
    <div
      style={{
        background: "linear-gradient(90deg, rgba(59,130,246,0.08), rgba(249,250,251,1))",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 16,
        padding: 12,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <span style={{ fontSize: 14, color: "#6b7280" }}>
            {completed}/{total} done · {pct}%
          </span>
        </div>
        <div className="progress" style={{ marginTop: 8 }}>
          <div className="bar" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          className="input"
          placeholder="Search tasks..."
          onChange={(e) => onSearch?.(e.target.value)}
          aria-label="Search tasks in board"
        />
        <select
          className="input"
          onChange={(e) => onFilterChange?.({ status: e.target.value || undefined })}
          aria-label="Filter by status"
          defaultValue=""
          style={{ minWidth: 160 }}
        >
          <option value="">All statuses</option>
          <option value="backlog">Backlog</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}
