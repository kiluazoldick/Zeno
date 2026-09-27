"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  invoiceUpdateSchema,
  type InvoiceUpdateInput,
} from "@/lib/validations/invoice.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateInvoiceSchema = z.object({
  id: z.string().uuid("ID facture invalide"),
  data: invoiceUpdateSchema,
});

export async function updateInvoice(id: string, data: InvoiceUpdateInput) {
  const adminClient = await createAdminClient();

  const validated = updateInvoiceSchema.safeParse({ id, data });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const { data: existing, error: checkError } = await adminClient
      .from("invoices")
      .select("id, statut")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Facture non trouvée"] },
      };
    }

    if (
      existing.statut === "Payée" &&
      validated.data.data.statut !== existing.statut
    ) {
      return {
        success: false,
        error: { statut: ["Une facture payée ne peut pas être modifiée"] },
      };
    }

    const formData = validated.data.data;

    // ============================================
    // EXTRACTION DU client_id depuis "to"
    // ============================================
    const clientId =
      (formData as any).to?.id ??
      formData.client_id ??
      null;

    // Calcul du montant total
    let montantTotal = formData.montant_total;

    if (!montantTotal && formData.contenu) {
      const items = Array.isArray(formData.contenu)
        ? formData.contenu
        : (formData.contenu as any)?.items ?? [];

      montantTotal = items.reduce(
        (sum: number, item: any) =>
          sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
        0,
      );
    }

    const updatePayload = {
      client_id: clientId,                       // ← correctement extrait
      projet_id: formData.projet_id ?? null,
      contrat_id: formData.contrat_id ?? null,
      titre: formData.titre ?? null,
      statut: formData.statut,
      priorite: formData.priorite,
      date_emission: formData.date_emission ?? null,
      date_echeance: formData.date_echeance ?? null,
      date_paiement: formData.date_paiement ?? null,
      conditions: formData.conditions ?? null,
      notes: formData.notes ?? null,
      contenu: formData.contenu ?? null,
      montant_total: montantTotal ?? null,
      updated_at: new Date().toISOString(),
    };

    const { data: invoice, error } = await adminClient
      .from("invoices")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/invoice");
    revalidatePath(`/dashboard/invoice/${id}`);

    return {
      success: true,
      data: invoice,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}