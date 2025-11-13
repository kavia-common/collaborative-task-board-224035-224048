import React from "react";
import { useAppContext } from "../../context/AppContext";

export default function TopNav({ onSearch }) {
  const { session } = useAppContext();
  const initials = session?.user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="topnav">
      <div className="brand">
        <span className="dot" aria-hidden />
        <span>Ocean Task Board</span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          className="input"
          placeholder="Search tasks..."
          onChange={(e) => onSearch?.(e.target.value)}
          aria-label="Search tasks"
        />
        <button className="btn-ghost" aria-label="Filters">Filters</button>
        <div className="avatar" title={session?.user?.email || "Guest"}>
          {initials}
        </div>
      </div>
    </div>
  );
}
