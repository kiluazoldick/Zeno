import { columnIds } from "./data";
import type { BoardState, ColumnId } from "./types";

function isColumnId(id: string): id is ColumnId {
  return columnIds.includes(id as ColumnId);
}

export function findColumnId(
  board: BoardState,
  id: string,
): ColumnId | undefined {
  if (isColumnId(id)) return id;
  return columnIds.find((columnId) =>
    board[columnId].some((task) => task.id === id),
  );
}

export function findTask(board: BoardState, id: string) {
  for (const columnId of columnIds) {
    const task = board[columnId].find((item) => item.id === id);
    if (task) return task;
  }
  return undefined;
}

// Helper pour obtenir le statut à partir d'un ColumnId
export function getStatusFromColumn(columnId: ColumnId): string {
  const map: Record<ColumnId, string> = {
    todo: "À faire",
    "in-progress": "En cours",
    cancelled: "Annulé",
    done: "Terminé",
  };
  return map[columnId];
}

// Helper pour obtenir le ColumnId à partir d'un statut
export function getColumnFromStatus(status: string): ColumnId {
  const map: Record<string, ColumnId> = {
    "À faire": "todo",
    "En cours": "in-progress",
    Annulé: "cancelled",
    Terminé: "done",
  };
  return map[status] || "todo";
}
