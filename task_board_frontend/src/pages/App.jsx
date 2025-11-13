import React, { useMemo, useState } from "react";
import "../styles/theme.css";
import TopNav from "../components/Layout/TopNav";
import Sidebar from "../components/Layout/Sidebar";
import KanbanBoard from "../components/Board/KanbanBoard";
import SignIn from "../components/Auth/SignIn";
import { useAppContext, AppProvider } from "../context/AppContext";
import { supabase } from "../lib/supabaseClient";

function SetupScreen() {
  const items = [
    { key: "REACT_APP_SUPABASE_URL", ok: Boolean(process.env.REACT_APP_SUPABASE_URL) },
    { key: "REACT_APP_SUPABASE_KEY", ok: Boolean(process.env.REACT_APP_SUPABASE_KEY) },
  ];
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
        <h2 style={{ marginTop: 0 }}>Setup required</h2>
        <p>Add the following environment variables to enable Supabase:</p>
        <ul>
          {items.map((i) => (
            <li key={i.key} style={{ color: i.ok ? "green" : "red" }}>
              {i.key}: {i.ok ? "present" : "missing"}
            </li>
          ))}
        </ul>
        <p>
          See .env.example for details. The app runs in limited mode without Supabase (no
          persistence or realtime).
        </p>
      </div>
    </div>
  );
}

function AppInner() {
  const { session } = useAppContext();
  const [query, setQuery] = useState("");

  const content = useMemo(() => {
    if (!supabase) return <SetupScreen />;
    if (!session) return <SignIn />;
    return (
      <div className="layout">
        <Sidebar />
        <main className="main">
          <KanbanBoard />
        </main>
      </div>
    );
  }, [session]);

  return (
    <div className="app-shell">
      <TopNav onSearch={setQuery} />
      {content}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </AppProvider>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, err: error };
  }
  componentDidCatch(error, info) {
    console.error("UI error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-state">
          <div>
            <h3>Something went wrong</h3>
            <p>Please refresh the page.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
