import React, { useState } from "react";
import { useAuth } from "./useAuth";

/**
 * Simple sign-in screen supporting magic-link email.
 */
export default function SignIn() {
  const { sendMagicLink, loading, error, success } = useAuth();
  const [email, setEmail] = useState("");

  return (
    <div className="empty-state" style={{ height: "100%" }}>
      <div
        style={{
          background: "white",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "16px",
          padding: 24,
          minWidth: 360,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ margin: 0, marginBottom: 8, color: "var(--color-primary)" }}>
          Welcome to Task Board
        </h2>
        <p style={{ marginTop: 0, color: "#6b7280" }}>
          Sign in via magic link to continue
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMagicLink(email);
          }}
        >
          <input
            className="input"
            placeholder="you@example.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            style={{ width: "100%", marginBottom: 12 }}
          />
          <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Sending..." : "Send magic link"}
          </button>
        </form>
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        {success && (
          <p style={{ color: "var(--color-secondary)" }}>
            Check your inbox for a sign-in link.
          </p>
        )}
      </div>
    </div>
  );
}
