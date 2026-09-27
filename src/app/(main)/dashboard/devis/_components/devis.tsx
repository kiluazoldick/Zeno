// src/app/(main)/dashboard/devis/_components/devis.tsx
"use client";

import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DevisInput } from "@/lib/validations";
import { DevisForm } from "./devis-form";
import { DevisPreview } from "./devis-preview";
import { devisSchema } from "@/lib/validations";

interface DevisProps {
  devis?: DevisInput;
  onSave: (data: DevisInput) => void;
  isEditing?: boolean;
}

// Valeurs par défaut
const defaultDevisValues: DevisInput = {
  numero: "",
  titre: "",
  client_id: undefined,
  projet_id: undefined,
  taxe_id: "tva",
  client_nom: "",
  projet_nom: "",
  statut: "Brouillon",
  priorite: "Moyenne",
  montant_total: undefined,
  date_emission: new Date().toISOString().split("T")[0],
  date_validite: undefined,
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
  const form = useForm<DevisInput>({
    resolver: zodResolver(devisSchema),
    defaultValues: devis || defaultDevisValues,
  });

const watchedValues = useWatch({
  control: form.control,
});

const safeValues = devisSchema.parse({
  ...defaultDevisValues,
  ...Object.fromEntries(
    Object.entries(watchedValues).filter(
      ([_, value]) => value !== undefined
    )
  ),
});

  return (
    <FormProvider {...form}>
      <form
        id="devis-form"
        className="grid gap-5 xl:grid-cols-2"
        noValidate
        onSubmit={form.handleSubmit((data) => {
          const safeData = devisSchema.parse(data);
          onSave(safeData);
        })}
      >
        <DevisForm />
        <DevisPreview devis={safeValues} />
      </form>
    </FormProvider>
  );
}
