import React, { useMemo, useState } from "react";
import BoardHeader from "../components/Board/BoardHeader";
import KanbanBoard from "../components/Board/KanbanBoard";
import { useTasks } from "../hooks/useTasks";
import { useAppContext } from "../context/AppContext";

/**
 The BoardPage integrates header (progress/filters/search) and the Kanban board.
 It passes search/filter state down indirectly via context/hooks selection.
*/
export default function BoardPage() {
  const { currentBoardId } = useAppContext();
  const { grouped } = useTasks(currentBoardId); // read-only here for progress
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});

  const header = useMemo(
    () => (
      <BoardHeader
        title="Team Board"
        grouped={grouped}
        onSearch={setQuery}
        onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
      />
    ),
    [grouped]
  );

  return (
    <div className="main">
      {header}
      <KanbanBoard searchQuery={query} filters={filters} />
    </div>
  );
}
