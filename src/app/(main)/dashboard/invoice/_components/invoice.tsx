"use client";

import {
  FormProvider,
  useForm,
  useWatch,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { defaultInvoiceValues } from "./data";
import { InvoiceForm } from "./invoice-form";
import { InvoicePreview } from "./invoice-preview";

import {
  invoiceSchema,
  type InvoiceFormValues,
} from "@/lib/validations/invoice.schema";

interface InvoiceProps {
  facture?: InvoiceFormValues;
  onSave: (data: InvoiceFormValues) => void;
  isEditing?: boolean;
  isPreview?: boolean;
}

export function Invoice({
  facture,
  onSave,
  isEditing = false,
  isPreview = false,
}: InvoiceProps) {
  const form = useForm<z.input<typeof invoiceSchema>, unknown, InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: facture ?? defaultInvoiceValues,
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  const safeValues = invoiceSchema.safeParse({
    ...defaultInvoiceValues,
    ...Object.fromEntries(
      Object.entries(watchedValues).filter(
        ([_, value]) => value !== undefined,
      ),
    ),
  });

  const previewValues = safeValues.success
    ? safeValues.data
    : {
        ...defaultInvoiceValues,
        ...watchedValues,
      };

  const handleSubmit = (data: InvoiceFormValues) => {
    console.log("📤 DONNÉES À ENVOYER AU PARENT :", data);

    // 🔥 Le composant Invoice transmet simplement les données
    onSave(data);
  };

  const handleInvalid = (errors: unknown) => {
    console.error(
      "❌ Erreurs de validation du formulaire :",
      errors,
    );
  };

  return (
    <FormProvider {...form}>
      <form
        id="invoice-form"
        className="grid gap-5 xl:grid-cols-2"
        noValidate
        onSubmit={form.handleSubmit(
          handleSubmit,
          handleInvalid,
        )}
      >
        <InvoiceForm 
          isEditing={isEditing}
          isPreview={isPreview} 
        />

        <InvoicePreview
          invoice={previewValues as InvoiceFormValues}
        />
      </form>
    </FormProvider>
  );
}