"use client";

import { useTasks } from "@/hooks/queries/use-tasks";
import { Loader2, AlertCircle } from "lucide-react";
import { Tasks } from "./_components/tasks";
import { fallbackTasks } from "./_components/data";

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

  // Transformer les données pour le format attendu par le composant Tasks
  const formattedTasks =
    tasks && tasks.length > 0
      ? tasks.map((task: any) => ({
          id: task.id.substring(0, 7).toUpperCase(),
          title: task.titre || "Tâche sans titre",
          status: task.statut || "À faire",
          label: task.projet?.nom || "Sans projet",
          priority: task.priorite?.toLowerCase() || "moyenne",
          assignee: task.assigne?.nom || "Non assigné",
          date: task.date_execution
            ? new Date(task.date_execution).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
          location: task.lieu || "-",
          reportDone: task.rapport_effectue || false,
        }))
      : fallbackTasks;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl tracking-tight">Gestion des tâches</h2>
        <p className="text-muted-foreground">
          Liste complète des tâches de l'équipe Zoldick
        </p>
      </div>
      <Tasks data={formattedTasks} />
    </div>
  );
}
