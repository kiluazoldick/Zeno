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
import { useClients } from "@/hooks/queries/use-clients";

// Schéma de validation
const projectSchema = z.object({
  nom: z.string().min(2, "Le nom du projet est requis"),
  client_id: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  statut: z
    .enum(["En cours", "En attente", "Terminé", "Annulé"])
    .default("En cours"),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
  budget_total: z.number().nullable().optional(),
  location: z.string().nullable().optional(),
  date_debut: z.string().nullable().optional(),
  date_fin: z.string().nullable().optional(),
  progression: z.number().min(0).max(100).default(0).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: any;
  onSave: (data: any) => void;
  isEditing?: boolean;
}

const statuts = [
  { label: "En cours", value: "En cours" },
  { label: "En attente", value: "En attente" },
  { label: "Terminé", value: "Terminé" },
  { label: "Annulé", value: "Annulé" },
];

const priorites = [
  { label: "Haute", value: "Haute" },
  { label: "Moyenne", value: "Moyenne" },
  { label: "Basse", value: "Basse" },
];

export function ProjectDialog({
  open,
  onOpenChange,
  project,
  onSave,
  isEditing,
}: ProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const { data: clients, isLoading: clientsLoading } = useClients();

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
      budget_total: null,
      location: "",
      date_debut: "",
      date_fin: "",
      progression: 0,
    },
  });

  // Remplir le formulaire quand on modifie un projet
  useEffect(() => {
    if (project) {
      reset({
        nom: project.nom || "",
        client_id: project.client_id || null,
        description: project.description || "",
        statut: project.statut || "En cours",
        priorite: project.priorite || "Moyenne",
        budget_total: project.budget_total || null,
        location: project.location || "",
        date_debut: project.date_debut || "",
        date_fin: project.date_fin || "",
        progression: project.progression || 0,
      });
    } else {
      reset({
        nom: "",
        client_id: null,
        description: "",
        statut: "En cours",
        priorite: "Moyenne",
        budget_total: null,
        location: "",
        date_debut: "",
        date_fin: "",
        progression: 0,
      });
    }
  }, [project, open, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      // Si le statut est "Terminé", forcer progression à 100
      if (data.statut === "Terminé") {
        data.progression = 100;
      } else if (data.statut === "Annulé") {
        data.progression = 0;
      }
      await onSave(data);
      toast.success(
        isEditing ? "Projet modifié avec succès" : "Projet créé avec succès",
      );
      onOpenChange(false);
    } catch (error: any) {
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
            {isEditing ? "Modifier le projet" : "Ajouter un projet"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom du projet */}
          <Field>
            <FieldLabel>
              Nom du projet <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="nom"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ex: Application Mobile Orange Money"
                />
              )}
            />
            {errors.nom && (
              <p className="text-sm text-destructive">{errors.nom.message}</p>
            )}
          </Field>

          {/* Client */}
          <Field>
            <FieldLabel>Client</FieldLabel>
            <Controller
              name="client_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(val) => field.onChange(val || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {clientsLoading ? (
                        <SelectItem value="loading" disabled>
                          Chargement...
                        </SelectItem>
                      ) : (
                        clients?.map((client: any) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.nom}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
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
                  placeholder="Description du projet..."
                  className="min-h-20 resize-none"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

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

          {/* Progression */}
          <Field>
            <FieldLabel>Avancement (%)</FieldLabel>
            <Controller
              name="progression"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  value={field.value || 0}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : 0;
                    field.onChange(Math.min(100, Math.max(0, val)));
                  }}
                  min="0"
                  max="100"
                  placeholder="0"
                />
              )}
            />
            <p className="text-xs text-muted-foreground">
              Valeur entre 0 et 100%
            </p>
          </Field>

          {/* Budget et Lieu */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Budget (FCFA)</FieldLabel>
              <Controller
                name="budget_total"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    placeholder="0"
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
                  <Input
                    {...field}
                    placeholder="Ex: Douala"
                    value={field.value || ""}
                  />
                )}
              />
            </Field>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Date de début</FieldLabel>
              <Controller
                name="date_debut"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="date" value={field.value || ""} />
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Date de fin</FieldLabel>
              <Controller
                name="date_fin"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="date" value={field.value || ""} />
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
