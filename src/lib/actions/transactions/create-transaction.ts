"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  transactionSchema,
  type TransactionInput,
} from "@/lib/validations/transaction.schema";
import { revalidatePath } from "next/cache";

export async function createTransaction(data: TransactionInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = transactionSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
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

    // Créer la transaction
    const { data: transaction, error } = await adminClient
      .from("transactions")
      .insert({
        description: validated.data.description,
        type: validated.data.type,
        montant: validated.data.montant,
        date_transaction: validated.data.date_transaction,
        responsable: validated.data.responsable || null,
        projet_id: validated.data.projet_id || null,
        invoice_id: validated.data.invoice_id || null,
        categorie: validated.data.categorie || null,
        statut: validated.data.statut || "Prévue",
        reference: validated.data.reference || null,
        notes: validated.data.notes || null,
      })
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
    if (validated.data.projet_id) {
      revalidatePath(`/dashboard/projects/${validated.data.projet_id}`);
    }

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
