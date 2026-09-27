"use client";

import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type ContratInput } from "@/lib/validations";
import { contratSchema } from "@/lib/validations";
import { ContratPreview } from "./contrat-preview";
import { ContratForm } from "./contrat-form";
import {
  defaultContratValues,
} from "./contrat-data";
import { format } from "date-fns";

interface ContratProps {
  contrat?: ContratInput;
  onSave: (data: ContratInput) => void;
  isEditing?: boolean;
}

export function Contrat({
  contrat,
  onSave,
  isEditing,
}: ContratProps) {
  const form = useForm<z.input<typeof contratSchema>, unknown, ContratInput>({
    resolver: zodResolver(contratSchema),
    mode: "onBlur",

    defaultValues: contrat || {
      ...defaultContratValues,
      date_emission: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  const safeValues: ContratInput = {
    ...defaultContratValues,
    ...Object.fromEntries(
      Object.entries(watchedValues).filter(
        ([, value]) => value !== undefined
      )
    ),
  } as ContratInput;

  return (
    <FormProvider {...form}>
      <form
        id="contrat-form"
        className="grid gap-5 xl:grid-cols-2"
        noValidate
        onSubmit={form.handleSubmit((data) => {
          onSave(data);
        })}
      >
        <ContratForm />

        <ContratPreview contrat={safeValues} />
      </form>
    </FormProvider>
  );
}
