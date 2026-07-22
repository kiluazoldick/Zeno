"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Project } from "@/types/database";
import { useClients } from "@/hooks/queries/use-clients";

// Schéma de validation
const projectSchema = z.object({
  nom: z.string().min(2, "Le nom du projet est requis"),
  client_id: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  statut: z.string().min(1, "Le statut est requis"),
  priorite: z.string().min(1, "La priorité est requise"),
  budget_total: z.coerce.number().optional().nullable(),
  location: z.string().optional().nullable(),
  date_debut: z.string().optional().nullable(),
  date_fin: z.string().optional().nullable(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSave: (data: any) => void;
}

const statuses = [
  { label: "En cours", value: "En cours" },
  { label: "En attente", value: "En attente" },
  { label: "Terminé", value: "Terminé" },
  { label: "Annulé", value: "Annulé" },
];

const priorities = [
  { label: "Haute", value: "Haute" },
  { label: "Moyenne", value: "Moyenne" },
  { label: "Basse", value: "Basse" },
];

export function ProjectDialog({
  open,
  onOpenChange,
  project,
  onSave,
}: ProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const { data: clients } = useClients();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      nom: "",
      client_id: null,
      description: "",
      statut: "En cours",
      priorite: "Moyenne",
      budget_total: undefined,
      location: "",
      date_debut: "",
      date_fin: "",
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        nom: project.nom,
        client_id: project.client_id || null,
        description: project.description || "",
        statut: project.statut,
        priorite: project.priorite,
        budget_total: project.budget_total || undefined,
        location: project.location || "",
        date_debut: project.date_debut || "",
        date_fin: project.date_fin || "",
      });
    } else {
      reset({
        nom: "",
        client_id: null,
        description: "",
        statut: "En cours",
        priorite: "Moyenne",
        budget_total: undefined,
        location: "",
        date_debut: "",
        date_fin: "",
      });
    }
  }, [project, open, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      await onSave(data);
      setLoading(false);
      onOpenChange(false);
    } catch (error) {
      setLoading(false);
      console.error("Erreur:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Modifier le projet" : "Ajouter un projet"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Nom du projet</FieldLabel>
            <Controller
              name="nom"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Nom du projet" />
              )}
            />
            {errors.nom && (
              <p className="text-sm text-destructive">{errors.nom.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel>Client</FieldLabel>
            <Controller
              name="client_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) =>
                    field.onChange(value === "" ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nom}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Description du projet"
                  className="resize-none"
                  rows={3}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Statut</FieldLabel>
            <Controller
              name="statut"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.statut && (
              <p className="text-sm text-destructive">{errors.statut.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel>Priorité</FieldLabel>
            <Controller
              name="priorite"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priorite && (
              <p className="text-sm text-destructive">
                {errors.priorite.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel>Budget total (FCFA)</FieldLabel>
            <Controller
              name="budget_total"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Budget en FCFA"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Lieu</FieldLabel>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Lieu du projet" />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Date de début</FieldLabel>
            <Controller
              name="date_debut"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Date de fin</FieldLabel>
            <Controller
              name="date_fin"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" />
              )}
            />
          </Field>

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
              {loading ? "Enregistrement..." : project ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
