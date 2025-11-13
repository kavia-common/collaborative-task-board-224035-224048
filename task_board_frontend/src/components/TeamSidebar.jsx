import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { handleError } from "../utils/error";

/**
 * TeamSidebar lists team members. Presence indicator uses TODO placeholder if Realtime Presence not configured.
 */
export default function TeamSidebar({ teamId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!teamId) {
      setUsers([]);
      return;
    }
    if (!supabase) {
      // Demo data
      setUsers([
        { id: "u1", email: "alex@example.com" },
        { id: "u2", email: "sam@example.com" },
        { id: "u3", email: "jordan@example.com" },
      ]);
      return;
    }
    // Fetch via Supabase if there's a "team_members" or "profiles" table; fallback: auth users not accessible via anon by default.
    supabase
      .from("team_members")
      .select("user_id, profiles(email)")
      .eq("team_id", teamId)
      .then(({ data, error }) => {
        if (error) throw error;
        const mapped =
          data?.map((r) => ({
            id: r.user_id,
            email: r.profiles?.email || "member",
          })) || [];
        setUsers(mapped);
      })
      .catch((e) => {
        handleError(e, { scope: "TeamSidebar.fetch" });
        setUsers([]);
      });
  }, [teamId]);

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 16,
        padding: 12,
        display: "grid",
        gap: 8,
      }}
    >
      <div className="section-title">Team</div>
      {users.length === 0 && <div style={{ color: "#6b7280" }}>No members found</div>}
      {users.map((u) => (
        <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="avatar">{u.email?.[0]?.toUpperCase() || "U"}</div>
          <div style={{ display: "grid" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{u.email}</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              {/* TODO: Presence - integrate Realtime Presence channels */}
              <span style={{ color: "#f59e0b" }}>•</span> status: unknown
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
