// src/app/(main)/dashboard/devis/_components/devis.tsx
"use client";

import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { DevisForm } from "./devis-form";
import { DevisPreview } from "./devis-preview";

// Schéma de validation
const devisSchema = z.object({
  numero: z.string().optional(),
  titre: z.string().min(2, "Le titre est requis"),
  client_id: z.string().uuid("ID client invalide").nullable().optional(),
  projet_id: z.string().uuid("ID projet invalide").nullable().optional(),
  statut: z
    .enum(["Brouillon", "Envoyé", "Accepté", "Refusé"])
    .default("Brouillon"),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
  montant_total: z.number().nullable().optional(),
  date_emission: z.string().nullable().optional(),
  date_validite: z.string().nullable().optional(),
  conditions: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  contexte: z.string().nullable().optional(),
  objectifs: z.string().nullable().optional(),
  architecture: z.string().nullable().optional(),
  modalites_paiement: z.string().nullable().optional(),
  contenu: z
    .array(
      z.object({
        description: z.string().min(1, "La description est requise"),
        quantite: z.number().min(0, "La quantité doit être positive"),
        prix_unitaire: z.number().min(0, "Le prix unitaire doit être positif"),
      }),
    )
    .default([]),
  prestations: z
    .array(
      z.object({
        titre: z.string().min(1, "Le titre est requis"),
        description: z.string().min(1, "La description est requise"),
      }),
    )
    .default([]),
  planning: z
    .array(
      z.object({
        semaine: z.string().min(1, "La semaine est requise"),
        taches: z.string().min(1, "Les tâches sont requises"),
      }),
    )
    .default([]),
});

type DevisFormData = z.infer<typeof devisSchema>;

interface DevisProps {
  devis?: any;
  onSave: (data: any) => void;
  isEditing?: boolean;
}

// Valeurs par défaut
const defaultDevisValues: DevisFormData = {
  numero: "",
  titre: "",
  client_id: null,
  projet_id: null,
  statut: "Brouillon",
  priorite: "Moyenne",
  montant_total: null,
  date_emission: new Date().toISOString().split("T")[0],
  date_validite: "",
  conditions: "",
  notes: "",
  contexte: "",
  objectifs: "",
  architecture: "",
  modalites_paiement: "",
  contenu: [],
  prestations: [],
  planning: [],
};

export function Devis({ devis, onSave, isEditing }: DevisProps) {
  const form = useForm<DevisFormData>({
    resolver: zodResolver(devisSchema),
    defaultValues: devis || defaultDevisValues,
  });

  const watchedValues = useWatch({ control: form.control }) as DevisFormData;

  return (
    <FormProvider {...form}>
      <form
        className="grid gap-5 xl:grid-cols-2"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit(onSave)();
        }}
      >
        <DevisForm />
        <DevisPreview devis={watchedValues} />
      </form>
    </FormProvider>
  );
}
