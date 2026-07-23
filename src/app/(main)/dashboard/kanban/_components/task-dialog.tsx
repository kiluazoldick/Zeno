"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Importer les hooks avec le bon nom
import { useCreateTask, useUpdateTask } from "@/hooks/queries/use-tasks";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: any;
  defaultColumn?: string;
  members?: any[];
  projects?: any[];
  onSuccess?: () => void;
}

const statuts = [
  { label: "À faire", value: "À faire" },
  { label: "En cours", value: "En cours" },
  { label: "Annulé", value: "Annulé" },
  { label: "Terminé", value: "Terminé" },
];

const priorites = [
  { label: "Haute", value: "Haute" },
  { label: "Moyenne", value: "Moyenne" },
  { label: "Basse", value: "Basse" },
];

export function TaskDialog({
  open,
  onOpenChange,
  task,
  defaultColumn = "todo",
  members = [],
  projects = [],
  onSuccess,
}: TaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  // État du formulaire
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    statut: "À faire",
    priorite: "Moyenne",
    assigne_id: null as string | null,
    projet_id: null as string | null,
    date_execution: "",
    lieu: "",
  });

  // Mapping colonne -> statut
  const columnToStatus: Record<string, string> = {
    todo: "À faire",
    "in-progress": "En cours",
    cancelled: "Annulé",
    done: "Terminé",
  };

  // Remplir le formulaire quand on modifie
  useEffect(() => {
    if (task) {
      setFormData({
        titre: task.title || "",
        description: task.description || "",
        statut: task.raw?.statut || columnToStatus[defaultColumn] || "À faire",
        priorite: task.priority || "Moyenne",
        assigne_id: task.raw?.assignee_id || null,
        projet_id: task.raw?.project_id || null,
        date_execution: task.raw?.date_execution || "",
        lieu: task.location || "",
      });
    } else {
      setFormData({
        titre: "",
        description: "",
        statut: columnToStatus[defaultColumn] || "À faire",
        priorite: "Moyenne",
        assigne_id: null,
        projet_id: null,
        date_execution: "",
        lieu: "",
      });
    }
  }, [task, open, defaultColumn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Préparer les données
      const data = {
        titre: formData.titre,
        description: formData.description || null,
        statut: formData.statut,
        priorite: formData.priorite,
        assigne_id: formData.assigne_id,
        projet_id: formData.projet_id,
        date_execution: formData.date_execution || null,
        lieu: formData.lieu || null,
      };

      if (task) {
        // Modifier - utiliser updateTask avec { id, data }
        await updateTask.mutateAsync({
          id: task.id,
          data: data,
        });
        toast.success("Tâche modifiée avec succès");
      } else {
        // Créer
        await createTask.mutateAsync(data);
        toast.success("Tâche créée avec succès");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error("Erreur: " + (error.message || "Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!task;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la tâche" : "Nouvelle tâche"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <Field>
            <FieldLabel>
              Titre <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              value={formData.titre}
              onChange={(e) =>
                setFormData({ ...formData, titre: e.target.value })
              }
              placeholder="Titre de la tâche"
              required
            />
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description de la tâche..."
              className="min-h-20 resize-none"
            />
          </Field>

          {/* Statut et Priorité */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Statut</FieldLabel>
              <Select
                value={formData.statut}
                onValueChange={(val) =>
                  setFormData({ ...formData, statut: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {statuts.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Priorité</FieldLabel>
              <Select
                value={formData.priorite}
                onValueChange={(val) =>
                  setFormData({ ...formData, priorite: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {priorites.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Assigné à et Projet */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Assigné à</FieldLabel>
              <Select
                value={formData.assigne_id || "null"}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    assigne_id: val === "null" ? null : val,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un membre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="null">Non assigné</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.nom}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Projet</FieldLabel>
              <Select
                value={formData.projet_id || "null"}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    projet_id: val === "null" ? null : val,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="null">Sans projet</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.nom}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Date et Lieu */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Date d'exécution</FieldLabel>
              <Input
                type="date"
                value={formData.date_execution}
                onChange={(e) =>
                  setFormData({ ...formData, date_execution: e.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Lieu</FieldLabel>
              <Input
                value={formData.lieu}
                onChange={(e) =>
                  setFormData({ ...formData, lieu: e.target.value })
                }
                placeholder="Ex: Douala"
              />
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-zeno-primary hover:bg-zeno-primary/90"
            >
              {loading
                ? "Enregistrement..."
                : isEditing
                  ? "Modifier"
                  : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
