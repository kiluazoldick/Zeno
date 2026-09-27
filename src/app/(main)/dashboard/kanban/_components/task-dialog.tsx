// src/app/(main)/dashboard/kanban/_components/task-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useProjects } from "@/hooks/queries/use-projects";
import { useMembers } from "@/hooks/queries/use-members";

const taskSchema = z.object({
  titre: z.string().min(2, "Le titre est requis"),
  description: z.string().nullable().optional(),
  projet_id: z.string().uuid("ID projet invalide").nullable().optional(),
  assigne_a: z.string().uuid("ID membre invalide").nullable().optional(),
  statut: z
    .enum(["À faire", "En cours", "Annulé", "Terminé"])
    .default("À faire"),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
  date_execution: z.string().nullable().optional(),
  lieu: z.string().nullable().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: any;
  defaultColumn?: "todo" | "in-progress" | "cancelled" | "done";
  onSuccess?: (data: any) => void;
}

const columnToStatus: Record<
  string,
  "À faire" | "En cours" | "Annulé" | "Terminé"
> = {
  todo: "À faire",
  "in-progress": "En cours",
  cancelled: "Annulé",
  done: "Terminé",
};

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
  onSuccess,
}: TaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: members, isLoading: membersLoading } = useMembers();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof taskSchema>, unknown, TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      titre: "",
      description: "",
      projet_id: null,
      assigne_a: null,
      statut: columnToStatus[defaultColumn] || "À faire",
      priorite: "Moyenne",
      date_execution: "",
      lieu: "",
    },
  });

  // Remplir le formulaire quand on modifie une tâche
  useEffect(() => {
    if (task) {
      console.log("📋 TaskDialog - useEffect - Task reçue:", task);
      reset({
        titre: task.titre || "",
        description: task.description || "",
        projet_id: task.projet_id || null,
        assigne_a: task.assigne_a || null,
        statut: task.statut || "À faire",
        priorite: task.priorite || "Moyenne",
        date_execution: task.date_execution || "",
        lieu: task.lieu || "",
      });
    } else {
      reset({
        titre: "",
        description: "",
        projet_id: null,
        assigne_a: null,
        statut: columnToStatus[defaultColumn] || "À faire",
        priorite: "Moyenne",
        date_execution: "",
        lieu: "",
      });
    }
  }, [task, open, defaultColumn, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);
    try {
      console.log("📤 TaskDialog - onSubmit - Data:", data);

      // Vérifier si c'est une modification ou une création
      const isEditing = !!task;
      console.log(`📤 TaskDialog - ${isEditing ? "Modification" : "Création"}`);

      await onSuccess?.(data);

      console.log("✅ TaskDialog - onSuccess exécuté");
      // Le dialogue sera fermé par le parent après le succès
    } catch (error: any) {
      console.error("❌ TaskDialog - Erreur:", error);
      toast.error("Erreur: " + (error.message || "Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {task ? "Modifier la tâche" : "Ajouter une tâche"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Titre */}
          <Field>
            <FieldLabel>
              Titre <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="titre"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ex: Développer la landing page"
                />
              )}
            />
            {errors.titre && (
              <p className="text-sm text-destructive">{errors.titre.message}</p>
            )}
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Description de la tâche..."
                  className="min-h-20 resize-none"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          {/* Projet et Assigné */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Projet</FieldLabel>
              <Controller
                name="projet_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) => field.onChange(val || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {projectsLoading ? (
                          <SelectItem value="loading" disabled>
                            Chargement...
                          </SelectItem>
                        ) : (
                          projects?.map((project: any) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.nom}
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Assigné à</FieldLabel>
              <Controller
                name="assigne_a"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) => field.onChange(val || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un membre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {membersLoading ? (
                          <SelectItem value="loading" disabled>
                            Chargement...
                          </SelectItem>
                        ) : (
                          members?.map((member: any) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.nom}
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          {/* Statut et Priorité */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Statut</FieldLabel>
              <Controller
                name="statut"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Priorité</FieldLabel>
              <Controller
                name="priorite"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
            </Field>
          </div>

          {/* Date d'exécution et Lieu */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Date d'exécution</FieldLabel>
              <Controller
                name="date_execution"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="date" value={field.value || ""} />
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Lieu</FieldLabel>
              <Controller
                name="lieu"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ex: Douala, Yaoundé..."
                    value={field.value || ""}
                  />
                )}
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
              {loading ? "Enregistrement..." : task ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
