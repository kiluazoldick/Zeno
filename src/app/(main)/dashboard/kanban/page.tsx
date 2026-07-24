// src/app/(main)/dashboard/kanban/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  useTasksByStatus,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/queries/use-tasks";
import { useMembers } from "@/hooks/queries/use-members";
import { useProjects } from "@/hooks/queries/use-projects";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Kanban } from "./_components/kanban";
import { type BoardState, type Task } from "./_components/types";

export default function Page() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [defaultColumn, setDefaultColumn] = useState<
    "todo" | "in-progress" | "cancelled" | "done"
  >("todo");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Récupérer les données
  const {
    data: tasksByStatus,
    isLoading: tasksLoading,
    error: tasksError,
    refetch,
  } = useTasksByStatus();

  const {
    data: members,
    isLoading: membersLoading,
    refetch: refetchMembers,
  } = useMembers();
  const {
    data: projects,
    isLoading: projectsLoading,
    refetch: refetchProjects,
  } = useProjects();

  // Mutations
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const isLoading =
    tasksLoading || membersLoading || projectsLoading || isRefreshing;

  // Convertir les données pour le Kanban
  const board = tasksByStatus ? convertToBoard(tasksByStatus) : getEmptyBoard();

  // Rafraîchir toutes les données
  const refreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetch(), refetchMembers(), refetchProjects()]);
      console.log("✅ Toutes les données ont été rafraîchies");
    } catch (error) {
      console.error("❌ Erreur lors du rafraîchissement:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Gérer l'ajout
  const handleAddTask = (
    columnId?: "todo" | "in-progress" | "cancelled" | "done",
  ) => {
    setEditingTask(null);
    setDefaultColumn(columnId || "todo");
    setDialogOpen(true);
  };

  // Gérer la modification
  const handleEditTask = (task: Task) => {
    console.log("✏️ handleEditTask - Task reçue:", task);

    // Transformer la tâche du Kanban vers le format attendu par le formulaire
    const taskData = {
      id: task.id,
      titre: task.title || "",
      description: task.description || "",
      projet_id: task.raw?.project_id || null,
      assigne_a: task.raw?.assignee_id || null,
      statut: task.raw?.statut || "À faire",
      priorite: task.priority || "Moyenne",
      date_execution: task.raw?.date_execution || null,
      lieu: task.location || null,
    };

    console.log("✏️ handleEditTask - TaskData préparé:", taskData);
    setEditingTask(taskData);
    setDialogOpen(true);
  };

  // Gérer la suppression
  const handleDeleteTask = (id: string) => {
    console.log("🗑️ handleDeleteTask appelé avec ID:", id);

    deleteTask.mutate(
      { id },
      {
        onSuccess: () => {
          console.log("✅ Tâche supprimée avec succès");
          toast.success("Tâche supprimée avec succès");
          refreshAll();
        },
        onError: (error: any) => {
          console.error("❌ Erreur suppression:", error);
          toast.error(
            "Erreur: " + (error.message || "Une erreur est survenue"),
          );
        },
      },
    );
  };

  // Gérer la sauvegarde (création ou modification)
  const handleSaveTask = (data: any) => {
    console.log("💾 handleSaveTask - Data reçue:", data);
    console.log("💾 handleSaveTask - editingTask:", editingTask);

    if (editingTask) {
      // MODIFICATION
      console.log("📝 MODIFICATION - ID:", editingTask.id);

      // Préparer les données pour l'update
      const updateData: any = {};

      // Ne garder que les champs qui ont changé
      if (data.titre !== undefined) updateData.titre = data.titre;
      if (data.description !== undefined)
        updateData.description = data.description || null;
      if (data.projet_id !== undefined)
        updateData.projet_id = data.projet_id || null;
      if (data.assigne_a !== undefined)
        updateData.assigne_a = data.assigne_a || null;
      if (data.statut !== undefined) updateData.statut = data.statut;
      if (data.priorite !== undefined) updateData.priorite = data.priorite;
      if (data.date_execution !== undefined)
        updateData.date_execution = data.date_execution || null;
      if (data.lieu !== undefined) updateData.lieu = data.lieu || null;

      console.log("📝 updateData envoyé:", updateData);

      // Vérifier qu'il y a des données à modifier
      if (Object.keys(updateData).length === 0) {
        toast.warning("Aucune modification détectée");
        setDialogOpen(false);
        return;
      }

      updateTask.mutate(
        { id: editingTask.id, data: updateData },
        {
          onSuccess: () => {
            console.log("✅ Tâche modifiée avec succès");
            toast.success("Tâche modifiée avec succès");
            setDialogOpen(false);
            refreshAll();
          },
          onError: (error: any) => {
            console.error("❌ Erreur modification:", error);
            toast.error(
              "Erreur: " + (error.message || "Une erreur est survenue"),
            );
          },
        },
      );
    } else {
      // CRÉATION
      console.log("🆕 CRÉATION - Nouvelle tâche");

      createTask.mutate(data, {
        onSuccess: () => {
          console.log("✅ Tâche créée avec succès");
          toast.success("Tâche créée avec succès");
          setDialogOpen(false);
          refreshAll();
        },
        onError: (error: any) => {
          console.error("❌ Erreur création:", error);
          toast.error(
            "Erreur: " + (error.message || "Une erreur est survenue"),
          );
        },
      });
    }
  };

  // Logs pour debug
  useEffect(() => {
    console.log(
      "📊 Board actuel - Nombre de tâches:",
      Object.values(board).reduce((acc, tasks) => acc + tasks.length, 0),
    );
  }, [board]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span>Erreur lors du chargement: {tasksError.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div data-content-padding="false">
      <Kanban
        initialBoard={board}
        members={members || []}
        projects={projects || []}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        editingTask={editingTask}
        defaultColumn={defaultColumn}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onSaveTask={handleSaveTask}
        refetch={refreshAll}
      />
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

function convertToBoard(tasksByStatus: any): BoardState {
  const board: BoardState = {
    todo: [],
    "in-progress": [],
    cancelled: [],
    done: [],
  };

  const statusMap: Record<string, keyof BoardState> = {
    "À faire": "todo",
    "En cours": "in-progress",
    Annulé: "cancelled",
    Terminé: "done",
  };

  Object.entries(tasksByStatus || {}).forEach(
    ([status, tasks]: [string, any[]]) => {
      const columnId = statusMap[status];
      if (columnId && Array.isArray(tasks)) {
        tasks.forEach((task) => {
          const assigneeName = task.assigne?.nom || "Non assigné";

          board[columnId].push({
            id: task.id,
            title: task.titre || "",
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
            raw: {
              assignee_id: task.assigne?.id || null,
              project_id: task.projet?.id || null,
              statut: task.statut,
              date_execution: task.date_execution,
            },
          });
        });
      }
    },
  );

  return board;
}

function getToneForMember(name: string): string {
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
