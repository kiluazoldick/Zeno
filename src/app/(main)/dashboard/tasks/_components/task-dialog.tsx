"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/types/database";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (data: any) => void;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  onSave,
}: TaskDialogProps) {
  const isEditing = !!task;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titre: task?.titre || "",
    description: task?.description || "",
    statut: (task?.statut as any) || "À faire",
    priorite: (task?.priorite as any) || "Moyenne",
    date_limite: task?.date_limite || "",
    assignee: task?.assignee || "",
  });

  React.useEffect(() => {
    if (open && task) {
      setFormData({
        titre: task.titre,
        description: task.description,
        statut: task.statut as any,
        priorite: task.priorite as any,
        date_limite: task.date_limite || "",
        assignee: task.assignee || "",
      });
    } else if (open && !task) {
      setFormData({
        titre: "",
        description: "",
        statut: "À faire",
        priorite: "Moyenne",
        date_limite: "",
        assignee: "",
      });
    }
  }, [open, task]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la tâche" : "Ajouter une tâche"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mettez à jour les détails de la tâche"
              : "Créez une nouvelle tâche"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Titre</label>
            <Input
              placeholder="Titre de la tâche"
              value={formData.titre}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, titre: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Description détaillée"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Statut</label>
            <Select value={formData.statut} onValueChange={(value) => 
              setFormData((prev) => ({ ...prev, statut: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="À faire">À faire</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Fait">Fait</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Priorité</label>
            <Select value={formData.priorite} onValueChange={(value) => 
              setFormData((prev) => ({ ...prev, priorite: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basse">Basse</SelectItem>
                <SelectItem value="Moyenne">Moyenne</SelectItem>
                <SelectItem value="Haute">Haute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Date limite</label>
            <Input
              type="date"
              value={formData.date_limite}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date_limite: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Assignée à</label>
            <Input
              placeholder="Nom de la personne"
              value={formData.assignee}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, assignee: e.target.value }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-zeno-primary hover:bg-zeno-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Enregistrement..."
                : isEditing
                  ? "Mettre à jour"
                  : "Créer la tâche"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
