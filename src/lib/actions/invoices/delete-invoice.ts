"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteInvoiceSchema = z.object({
  id: z.string().uuid("ID facture invalide"),
});

export async function deleteInvoice(id: string) {
  const adminClient = await createAdminClient();

  const validated = deleteInvoiceSchema.safeParse({ id });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que la facture existe
    const { data: invoice, error: checkError } = await adminClient
      .from("invoices")
      .select("id, statut, projet_id, contrat_id")
      .eq("id", id)
      .single();

    if (checkError || !invoice) {
      return {
        success: false,
        error: { notFound: ["Facture non trouvée"] },
      };
    }

    // Vérifier qu'on ne peut pas supprimer une facture payée
    if (invoice.statut === "Payée") {
      return {
        success: false,
        error: { statut: ["Une facture payée ne peut pas être supprimée"] },
      };
    }

    // Vérifier si la facture a des transactions
    const { count: transactionsCount, error: transactionsError } =
      await adminClient
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("invoice_id", id);

    if (transactionsError) {
      return {
        success: false,
        error: { db: [transactionsError.message] },
      };
    }

    if (transactionsCount && transactionsCount > 0) {
      return {
        success: false,
        error: {
          relations: [
            "Cette facture a des transactions associées, veuillez les supprimer d'abord",
          ],
        },
      };
    }

    // Supprimer la facture
    const { error } = await adminClient.from("invoices").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/invoice");
    if (invoice.projet_id) {
      revalidatePath(`/dashboard/projects/${invoice.projet_id}`);
    }
    if (invoice.contrat_id) {
      revalidatePath(`/dashboard/contrats/${invoice.contrat_id}`);
    }
    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/transactions");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
