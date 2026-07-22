"use client";

import { useTasksByStatus } from "@/hooks/queries/use-tasks";
import { Loader2, AlertCircle } from "lucide-react";
import { Kanban } from "./_components/kanban";
import { type BoardState } from "./_components/types";

// Données mockées de fallback
import { initialBoard as fallbackBoard } from "./_components/data";

export default function Page() {
  const { data: tasksByStatus, isLoading, error } = useTasksByStatus();

  // Transformer les données pour le Kanban
  const board = tasksByStatus ? convertToBoard(tasksByStatus) : fallbackBoard;

  return (
    <div data-content-padding="false">
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}
      {error && (
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="size-5" />
            <span>Erreur lors du chargement: {error.message}</span>
          </div>
        </div>
      )}
      {!isLoading && !error && <Kanban initialBoard={board} />}
    </div>
  );
}

// Fonction de conversion pour le Kanban
function convertToBoard(tasksByStatus: Record<string, any[]>): BoardState {
  const board: BoardState = {
    todo: [],
    "in-progress": [],
    cancelled: [],
    done: [],
  };

  // Mapping des statuts vers les colonnes
  const statusMap: Record<string, keyof BoardState> = {
    "À faire": "todo",
    "En cours": "in-progress",
    Annulé: "cancelled",
    Terminé: "done",
  };

  Object.entries(tasksByStatus).forEach(([status, tasks]) => {
    const columnId = statusMap[status];
    if (columnId) {
      board[columnId] = tasks.map((task) => ({
        id: task.id,
        title: task.titre,
        description: task.description || "",
        priority: task.priorite || "Moyenne",
        dueDate: task.date_execution
          ? new Date(task.date_execution).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })
          : "Non défini",
        progress: task.taux || 0,
        owner: {
          name: task.assigne?.nom || "Non assigné",
          tone: "bg-muted",
        },
        team: task.projet?.nom || "Sans projet",
        insights: [{ label: "Comments", count: 0 }],
        location: task.lieu || "",
        reportDone: task.rapport_effectue || false,
        // Ajouter d'autres champs si nécessaire
      }));
    }
  });

  return board;
}
