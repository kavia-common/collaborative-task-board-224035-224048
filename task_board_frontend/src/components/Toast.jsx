import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

const ToastCtx = createContext(null);

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((type, message) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setItems((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const api = useMemo(
    () => ({
      info: (m) => push("info", m),
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      warn: (m) => push("warn", m),
    }),
    [push]
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div style={{ position: "fixed", right: 16, bottom: 16, display: "grid", gap: 8, zIndex: 50 }}>
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.08)",
              borderLeft: `4px solid ${mapType(t.type)}`,
              borderRadius: 10,
              padding: "10px 12px",
              minWidth: 240,
              boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            }}
          >
            <strong style={{ textTransform: "capitalize" }}>{t.type}</strong>
            <div style={{ fontSize: 14, color: "#374151" }}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function mapType(t) {
  switch (t) {
    case "success":
      return "#22c55e";
    case "error":
      return "#ef4444";
    case "warn":
      return "#f59e0b";
    default:
      return "#2563eb";
  }
}

// PUBLIC_INTERFACE
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
