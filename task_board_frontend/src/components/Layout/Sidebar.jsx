import React, { useState } from "react";
import { useTeams } from "../../hooks/useTeams";
import { useBoards } from "../../hooks/useBoards";
import { useAppContext } from "../../context/AppContext";

export default function Sidebar() {
  const { currentTeamId, setCurrentTeamId, currentBoardId, setCurrentBoardId } = useAppContext();
  const { teams, addTeam } = useTeams();
  const { boards, addBoard } = useBoards(currentTeamId);
  const [teamName, setTeamName] = useState("");
  const [boardName, setBoardName] = useState("");

  return (
    <aside className="sidebar">
      <div className="section-title">Teams</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          className="input"
          placeholder="New team"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <button
          className="btn"
          onClick={() => {
            if (teamName.trim()) {
              addTeam(teamName.trim());
              setTeamName("");
            }
          }}
        >
          Add
        </button>
      </div>

      {teams.map((t) => (
        <div
          key={t.id}
          className="team"
          onClick={() => {
            setCurrentTeamId(t.id);
            setCurrentBoardId(null);
          }}
          style={{
            border:
              t.id === currentTeamId ? "1px solid var(--color-primary)" : "1px solid transparent",
            cursor: "pointer",
          }}
          role="button"
          tabIndex={0}
        >
          <span>{t.name}</span>
        </div>
      ))}

      <div className="section-title" style={{ marginTop: 12 }}>
        Boards
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          className="input"
          placeholder="New board"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <button
          className="btn-secondary btn"
          onClick={() => {
            if (boardName.trim() && currentTeamId) {
              addBoard(boardName.trim());
              setBoardName("");
            }
          }}
          disabled={!currentTeamId}
          title={!currentTeamId ? "Select a team first" : "Add board"}
        >
          Add
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {boards.map((b) => (
          <button
            key={b.id}
            className="btn-ghost"
            style={{
              textAlign: "left",
              borderColor: b.id === currentBoardId ? "var(--color-primary)" : "rgba(0,0,0,0.08)",
            }}
            onClick={() => setCurrentBoardId(b.id)}
          >
            {b.name}
          </button>
        ))}
      </div>

      <div className="section-title" style={{ marginTop: 16 }}>
        Quick stats
      </div>
      <div
        style={{
          background: "#f3f4f6",
          borderRadius: 12,
          padding: 12,
          fontSize: 14,
          color: "#374151",
        }}
      >
        <div>Boards: {boards.length}</div>
        <div>Teams: {teams.length}</div>
      </div>
    </aside>
  );
}
