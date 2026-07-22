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

  // Valider les données
  const validated = updateInvoiceSchema.safeParse({ id, data });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que la facture existe
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

    // Vérifier que la facture n'est pas déjà payée
    if (
      existing.statut === "Payée" &&
      validated.data.statut !== existing.statut
    ) {
      return {
        success: false,
        error: { statut: ["Une facture payée ne peut pas être modifiée"] },
      };
    }

    // Recalculer le montant total si les lignes ont changé
    let montantTotal = validated.data.montant_total;
    if (!montantTotal && validated.data.contenu) {
      montantTotal = validated.data.contenu.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
        0,
      );
    }

    // Mettre à jour la facture
    const { data: invoice, error } = await adminClient
      .from("invoices")
      .update({
        ...validated.data,
        montant_total: montantTotal || null,
        updated_at: new Date().toISOString(),
      })
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
