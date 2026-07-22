"use client";

import { useTasks } from "@/hooks/queries/use-tasks";
import { Loader2, AlertCircle } from "lucide-react";
import { Kanban } from "./_components/kanban";

export default function Page() {
  const {
    data: tasks,
    isLoading,
    error,
  } = useTasks({
    includeProject: true,
    includeAssignee: true,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span>Erreur lors du chargement des tâches: {error.message}</span>
        </div>
      </div>
    );
  }

  // Format tasks for Kanban
  const formattedTasks = tasks?.map((task: any) => ({
    id: task.id,
    titre: task.titre || "Tâche sans titre",
    description: task.description,
    statut: task.statut || "À faire",
    priorite: task.priorite || "Moyenne",
    date_execution: task.date_execution,
  })) || [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl tracking-tight">Gestion des tâches</h2>
        <p className="text-muted-foreground">
          Organisez vos tâches en colonne par statut
        </p>
      </div>
      <Kanban initialTasks={formattedTasks} />
    </div>
  );
}
