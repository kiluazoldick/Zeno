"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { invoiceStatusUpdateSchema } from "@/lib/validations/invoice.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateInvoiceStatusSchema = z.object({
  id: z.string().uuid("ID facture invalide"),
  statut: z.enum(["Brouillon", "Envoyée", "Payée", "Impayée", "Annulée"]),
  notes: z.string().optional(),
});

export async function updateInvoiceStatus(
  id: string,
  statut: "Brouillon" | "Envoyée" | "Payée" | "Impayée" | "Annulée",
  notes?: string,
) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateInvoiceStatusSchema.safeParse({ id, statut, notes });

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
      .select("id, client_id, projet_id, contrat_id, statut, montant_total")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Facture non trouvée"] },
      };
    }

    // Vérifier la transition de statut
    const validTransitions: Record<string, string[]> = {
      Brouillon: ["Envoyée", "Annulée"],
      Envoyée: ["Payée", "Impayée", "Annulée"],
      Payée: [],
      Impayée: ["Payée", "Annulée"],
      Annulée: [],
    };

    if (!validTransitions[existing.statut]?.includes(statut)) {
      return {
        success: false,
        error: {
          statut: [
            `Transition de "${existing.statut}" vers "${statut}" non autorisée`,
          ],
        },
      };
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      statut,
      updated_at: new Date().toISOString(),
    };

    if (statut === "Payée") {
      updateData.date_paiement = new Date().toISOString().split("T")[0];
    }

    if (validated.data.notes) {
      updateData.notes = validated.data.notes;
    }

    // Mettre à jour le statut
    const { data: invoice, error } = await adminClient
      .from("invoices")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    // Si la facture est payée, créer automatiquement une transaction
    if (statut === "Payée" && existing.statut !== "Payée") {
      const transactionData = {
        description: `Paiement facture ${existing.numero}`,
        type: "Entrée Réalisée",
        montant: existing.montant_total || 0,
        date_transaction: new Date().toISOString().split("T")[0],
        projet_id: existing.projet_id,
        invoice_id: id,
        categorie: "Facture client",
        statut: "Réalisée",
      };

      await adminClient.from("transactions").insert(transactionData);
    }

    revalidatePath("/dashboard/invoice");
    revalidatePath(`/dashboard/invoice/${id}`);
    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/transactions");
    if (existing.projet_id) {
      revalidatePath(`/dashboard/projects/${existing.projet_id}`);
    }

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
