// src/app/(main)/dashboard/users/_components/member-dialog.tsx
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

// Schéma de validation
const memberSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  role: z.string().min(1, "Le rôle est requis"),
  equipe: z.string().min(1, "L'équipe est requise"),
  status: z.string().min(1, "Le statut est requis"),
  joined_date: z.string().nullable().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: any;
  onSave: (data: any) => void;
  isEditing?: boolean;
}

const roles = [
  { label: "Direction", value: "direction" },
  { label: "Finance", value: "finance" },
  { label: "Commercial", value: "commercial" },
  { label: "Terrain", value: "terrain" },
  { label: "Bureau", value: "bureau" },
  { label: "Admin", value: "admin" },
  { label: "Membre", value: "membre" },
];

const equipes = [
  { label: "Direction", value: "Direction" },
  { label: "Terrain", value: "Terrain" },
  { label: "Bureau", value: "Bureau" },
  { label: "Finance", value: "Finance" },
  { label: "Commercial", value: "Commercial" },
  { label: "Admin", value: "Admin" },
];

const statuses = [
  { label: "Actif", value: "Actif" },
  { label: "Invitation en attente", value: "Invitation en attente" },
  { label: "Désactivé", value: "Désactivé" },
  { label: "Verrouillé", value: "Verrouillé" },
  { label: "Suspendu", value: "Suspendu" },
];

export function MemberDialog({
  open,
  onOpenChange,
  member,
  onSave,
  isEditing,
}: MemberDialogProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      nom: "",
      email: "",
      role: "",
      equipe: "",
      status: "Actif",
      joined_date: "",
    },
  });

  useEffect(() => {
    if (member) {
      console.log("📋 MemberDialog - Membre reçu:", member);
      reset({
        nom: member.nom || "",
        email: member.email || "",
        role: member.role || "",
        equipe: member.equipe || "",
        status: member.status || "Actif",
        joined_date: member.joined_date
          ? new Date(member.joined_date).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({
        nom: "",
        email: "",
        role: "",
        equipe: "",
        status: "Actif",
        joined_date: "",
      });
    }
  }, [member, open, reset]);

  const onSubmit = async (data: MemberFormData) => {
    setLoading(true);
    try {
      console.log("📤 MemberDialog - onSubmit - Data:", data);
      await onSave(data);
      onOpenChange(false);
    } catch (error: any) {
      console.error("❌ MemberDialog - Erreur:", error);
      toast.error("Erreur: " + (error.message || "Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le membre" : "Ajouter un membre"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom */}
          <Field>
            <FieldLabel>
              Nom <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="nom"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Nom du membre" />
              )}
            />
            {errors.nom && (
              <p className="text-sm text-destructive">{errors.nom.message}</p>
            )}
          </Field>

          {/* Email - MODIFIABLE */}
          <Field>
            <FieldLabel>
              Email <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="email@exemple.com"
                />
              )}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </Field>

          {/* Rôle */}
          <Field>
            <FieldLabel>
              Rôle <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </Field>

          {/* Équipe */}
          <Field>
            <FieldLabel>
              Équipe <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="equipe"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {equipes.map((equipe) => (
                        <SelectItem key={equipe.value} value={equipe.value}>
                          {equipe.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.equipe && (
              <p className="text-sm text-destructive">
                {errors.equipe.message}
              </p>
            )}
          </Field>

          {/* Statut */}
          <Field>
            <FieldLabel>
              Statut <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="status"
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
            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </Field>

          {/* Date d'intégration */}
          <Field>
            <FieldLabel>Date d'intégration</FieldLabel>
            <Controller
              name="joined_date"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" value={field.value || ""} />
              )}
            />
            {errors.joined_date && (
              <p className="text-sm text-destructive">
                {errors.joined_date.message}
              </p>
            )}
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
