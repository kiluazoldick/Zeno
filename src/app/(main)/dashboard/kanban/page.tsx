"use client";

import { useTasks } from "@/hooks/queries/use-tasks";
import { useMembers } from "@/hooks/queries/use-members";
import { useProjects } from "@/hooks/queries/use-projects";
import { Loader2, AlertCircle } from "lucide-react";
import { Kanban } from "./_components/kanban";
import { type BoardState, type Task } from "./_components/types";

export default function Page() {
  const {
    data: tasks,
    isLoading,
    error,
  } = useTasks({
    includeAssignee: true,
    includeProject: true,
  });
  const { data: members } = useMembers();
  const { data: projects } = useProjects();

  // Transformer les données pour le Kanban
  const board = tasks ? convertToBoard(tasks) : getEmptyBoard();

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
      {!isLoading && !error && (
        <Kanban
          initialBoard={board}
          members={members || []}
          projects={projects || []}
        />
      )}
    </div>
  );
}

function getEmptyBoard(): BoardState {
  return {
    todo: [],
    "in-progress": [],
    cancelled: [],
    done: [],
  };
}

// Fonction de conversion pour le Kanban
function convertToBoard(tasks: any[]): BoardState {
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

  tasks.forEach((task) => {
    const columnId = statusMap[task.statut];
    if (columnId) {
      const assigneeName = task.assigne?.nom || "Non assigné";

      board[columnId].push({
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
        location: task.lieu || "",
        reportDone: task.rapport_effectue || false,
        progress: task.progression || 0,
        owner: {
          name: assigneeName,
          tone: getToneForMember(assigneeName),
        },
        team: task.projet?.nom || "Sans projet",
        insights: [],
        // Données brutes pour les mutations
        raw: {
          assignee_id: task.assigne?.id || null,
          project_id: task.projet?.id || null,
          statut: task.statut,
          date_execution: task.date_execution,
        },
      });
    }
  });

  return board;
}

// Couleurs pour les membres
function getToneForMember(name: string): string {
  // Si le nom est undefined ou vide, utiliser une couleur par défaut
  if (!name || name === "Non assigné") {
    return "[&_[data-slot=avatar-fallback]]:bg-gray-100 [&_[data-slot=avatar-fallback]]:text-gray-700";
  }

  const tones = [
    "[&_[data-slot=avatar-fallback]]:bg-cyan-100 [&_[data-slot=avatar-fallback]]:text-cyan-700",
    "[&_[data-slot=avatar-fallback]]:bg-emerald-100 [&_[data-slot=avatar-fallback]]:text-emerald-700",
    "[&_[data-slot=avatar-fallback]]:bg-amber-100 [&_[data-slot=avatar-fallback]]:text-amber-700",
    "[&_[data-slot=avatar-fallback]]:bg-purple-100 [&_[data-slot=avatar-fallback]]:text-purple-700",
    "[&_[data-slot=avatar-fallback]]:bg-red-100 [&_[data-slot=avatar-fallback]]:text-red-700",
    "[&_[data-slot=avatar-fallback]]:bg-blue-100 [&_[data-slot=avatar-fallback]]:text-blue-700",
  ];
  const index = name.length % tones.length;
  return tones[index];
}
