"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  titre: string;
  description?: string;
  statut: "À faire" | "En cours" | "Fait";
  priorite: "Basse" | "Moyenne" | "Haute";
  date_execution?: string;
}

interface KanbanProps {
  initialTasks: Task[];
}

const STATUSES = ["À faire", "En cours", "Fait"];
const PRIORITIES = ["Basse", "Moyenne", "Haute"];

export function Kanban({ initialTasks }: KanbanProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    statut: "À faire" as const,
    priorite: "Moyenne" as const,
    date_execution: "",
  });
  const { toast } = useToast();

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        titre: task.titre,
        description: task.description || "",
        statut: task.statut,
        priorite: task.priorite,
        date_execution: task.date_execution || "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        titre: "",
        description: "",
        statut: "À faire",
        priorite: "Moyenne",
        date_execution: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSaveTask = async () => {
    if (!formData.titre.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingTask) {
        // Update existing task
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const updatedTask = await response.json();
          setTasks(tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)));
          toast({ title: "Succès", description: "Tâche mise à jour" });
        }
      } else {
        // Create new task
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const newTask = await response.json();
          setTasks([...tasks, newTask]);
          toast({ title: "Succès", description: "Tâche créée" });
        }
      }
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== id));
        toast({ title: "Succès", description: "Tâche supprimée" });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleMoveTask = (taskId: string, newStatus: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      handleOpenDialog({ ...task, statut: newStatus as any });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tableau Kanban</h3>
        <Button
          onClick={() => handleOpenDialog()}
          className="gap-2 bg-zeno-primary"
        >
          <Plus className="h-4 w-4" />
          Nouvelle tâche
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STATUSES.map((status) => (
          <div key={status} className="space-y-3 rounded-lg border bg-muted/30 p-4">
            <h4 className="font-medium">{status}</h4>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.statut === status)
                .map((task) => (
                  <Card
                    key={task.id}
                    className="space-y-2 border p-3 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h5 className="font-medium">{task.titre}</h5>
                        {task.description && (
                          <p className="text-xs text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          task.priorite === "Haute"
                            ? "bg-red-100 text-red-800"
                            : task.priorite === "Moyenne"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priorite}
                      </div>
                    </div>

                    {task.date_execution && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(task.date_execution).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(task)}
                        className="h-7"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTask(task.id)}
                        className="h-7 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Mettez à jour les détails de la tâche"
                : "Créez une nouvelle tâche"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Titre</label>
              <Input
                value={formData.titre}
                onChange={(e) =>
                  setFormData({ ...formData, titre: e.target.value })
                }
                placeholder="Titre de la tâche"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description optionnelle"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Statut</label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) =>
                    setFormData({ ...formData, statut: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Priorité</label>
                <Select
                  value={formData.priorite}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priorite: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Date d'exécution</label>
              <Input
                type="date"
                value={formData.date_execution}
                onChange={(e) =>
                  setFormData({ ...formData, date_execution: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveTask} className="bg-zeno-primary">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
