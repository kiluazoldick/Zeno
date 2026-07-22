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
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { UserRow } from "./data";

// Schéma de validation
const memberSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  role: z.string().min(1, "Le rôle est requis"),
  team: z.string().min(1, "L'équipe est requise"),
  status: z.string().min(1, "Le statut est requis"),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: UserRow | null;
  onSave: (data: any) => void;
}

// Valeurs autorisées par Supabase (check constraint)
const roles = [
  { label: "Direction", value: "direction" },
  { label: "Finance", value: "finance" },
  { label: "Commercial", value: "commercial" },
  { label: "Terrain", value: "terrain" },
  { label: "Bureau", value: "bureau" },
  { label: "Admin", value: "admin" },
];

// Équipes (pour l'affichage)
const teams = [
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
      name: "",
      email: "",
      role: "",
      team: "",
      status: "Actif",
    },
  });

  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        email: member.email,
        role: member.role.toLowerCase(),
        team: member.team,
        status: member.status,
      });
    } else {
      reset({
        name: "",
        email: "",
        role: "",
        team: "",
        status: "Actif",
      });
    }
  }, [member, open, reset]);

  const onSubmit = async (data: MemberFormData) => {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {member ? "Modifier le membre" : "Ajouter un membre"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Nom</FieldLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Nom du membre" />
              )}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
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

          <Field>
            <FieldLabel>Rôle</FieldLabel>
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

          <Field>
            <FieldLabel>Équipe</FieldLabel>
            <Controller
              name="team"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {teams.map((team) => (
                        <SelectItem key={team.value} value={team.value}>
                          {team.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.team && (
              <p className="text-sm text-destructive">{errors.team.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel>Statut</FieldLabel>
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
              {loading ? "Enregistrement..." : member ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
