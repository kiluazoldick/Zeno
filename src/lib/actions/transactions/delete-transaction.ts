"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteTransactionSchema = z.object({
  id: z.string().uuid("ID transaction invalide"),
});

export async function deleteTransaction(id: string) {
  const adminClient = await createAdminClient();

  const validated = deleteTransactionSchema.safeParse({ id });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que la transaction existe
    const { data: transaction, error: checkError } = await adminClient
      .from("transactions")
      .select("id, statut, projet_id")
      .eq("id", id)
      .single();

    if (checkError || !transaction) {
      return {
        success: false,
        error: { notFound: ["Transaction non trouvée"] },
      };
    }

    // Vérifier qu'on ne peut pas supprimer une transaction réalisée
    if (transaction.statut === "Réalisée") {
      return {
        success: false,
        error: {
          statut: ["Une transaction réalisée ne peut pas être supprimée"],
        },
      };
    }

    // Supprimer la transaction
    const { error } = await adminClient
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/transactions");
    if (transaction.projet_id) {
      revalidatePath(`/dashboard/projects/${transaction.projet_id}`);
    }

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
