"use client";

import * as React from "react";
import { useState } from "react";
import {
  MoreHorizontal,
  Plus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/types/database";
import { TaskDialog } from "./task-dialog";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/queries/use-tasks";

const FALLBACK_TASKS: Task[] = [
  {
    id: "tsk-001",
    titre: "Développer API REST",
    description: "Créer les endpoints API",
    statut: "En cours",
    priorite: "Haute",
    date_limite: "2026-08-15",
    assignee: "Jean Dupont",
    created_at: "",
    updated_at: "",
  },
];

interface TasksListProps {
  tasks?: Task[];
  isLoading?: boolean;
}

export function TasksList({ tasks, isLoading }: TasksListProps) {
  const { data: queriedTasks, isLoading: queryLoading } = useTasks();
  const data = tasks || queriedTasks || FALLBACK_TASKS;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${task.titre}" ?`)) {
      deleteTask.mutate({ id: task.id });
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleDialogSave = (formData: any) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, data: formData });
    } else {
      createTask.mutate(formData);
    }
    setDialogOpen(false);
  };

  // Group tasks by status
  const tasksByStatus = {
    "À faire": data.filter((t) => t.statut === "À faire"),
    "En cours": data.filter((t) => t.statut === "En cours"),
    "Fait": data.filter((t) => t.statut === "Fait"),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Haute":
        return "destructive";
      case "Moyenne":
        return "secondary";
      case "Basse":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tâches</h1>
          <p className="text-muted-foreground">
            Gérez les tâches et activités de l'équipe
          </p>
        </div>
        <Button
          size="sm"
          className="bg-zeno-primary hover:bg-zeno-primary/90"
          onClick={handleCreateTask}
        >
          <Plus className="size-4" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <Card key={status}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{status}</CardTitle>
              <CardDescription>{tasks.length} tâches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-muted p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.titre}</p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-6 w-6"
                          >
                            <MoreHorizontal className="size-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditTask(task)}
                          >
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTask(task)}
                            className="text-destructive"
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={getPriorityColor(task.priorite)}
                        className="text-xs"
                      >
                        {task.priorite}
                      </Badge>
                      {task.date_limite && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(task.date_limite).toLocaleDateString(
                            "fr-FR",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      )}
                    </div>

                    {task.assignee && (
                      <div className="text-xs text-muted-foreground">
                        {task.assignee}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSave={handleDialogSave}
      />
    </div>
  );
}
