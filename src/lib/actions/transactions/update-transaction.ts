"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  transactionUpdateSchema,
  type TransactionUpdateInput,
} from "@/lib/validations/transaction.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateTransactionSchema = z.object({
  id: z.string().uuid("ID transaction invalide"),
  data: transactionUpdateSchema,
});

export async function updateTransaction(
  id: string,
  data: TransactionUpdateInput,
) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateTransactionSchema.safeParse({ id, data });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que la transaction existe
    const { data: existing, error: checkError } = await adminClient
      .from("transactions")
      .select("id, statut")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Transaction non trouvée"] },
      };
    }

    // Vérifier qu'on ne peut pas modifier une transaction réalisée ou annulée
    if (existing.statut === "Réalisée" || existing.statut === "Annulée") {
      return {
        success: false,
        error: {
          statut: [
            "Une transaction réalisée ou annulée ne peut pas être modifiée",
          ],
        },
      };
    }

    // Vérifier que le projet existe si fourni
    if (validated.data.projet_id) {
      const { data: project, error: projectError } = await adminClient
        .from("projects")
        .select("id")
        .eq("id", validated.data.projet_id)
        .single();

      if (projectError || !project) {
        return {
          success: false,
          error: { projet_id: ["Projet non trouvé"] },
        };
      }
    }

    // Vérifier que le membre existe si fourni
    if (validated.data.responsable) {
      const { data: member, error: memberError } = await adminClient
        .from("members")
        .select("id")
        .eq("id", validated.data.responsable)
        .single();

      if (memberError || !member) {
        return {
          success: false,
          error: { responsable: ["Membre non trouvé"] },
        };
      }
    }

    // Vérifier que la facture existe si fournie
    if (validated.data.invoice_id) {
      const { data: invoice, error: invoiceError } = await adminClient
        .from("invoices")
        .select("id")
        .eq("id", validated.data.invoice_id)
        .single();

      if (invoiceError || !invoice) {
        return {
          success: false,
          error: { invoice_id: ["Facture non trouvée"] },
        };
      }
    }

    // Mettre à jour la transaction
    const { data: transaction, error } = await adminClient
      .from("transactions")
      .update({
        ...validated.data,
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

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/transactions");
    revalidatePath(`/dashboard/transactions/${id}`);

    return {
      success: true,
      data: transaction,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
