"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteContratSchema = z.object({
  id: z.string().uuid("ID contrat invalide"),
});

export async function deleteContrat(id: string) {
  const adminClient = await createAdminClient();

  const validated = deleteContratSchema.safeParse({ id });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le contrat existe
    const { data: contrat, error: checkError } = await adminClient
      .from("contrats")
      .select("id, statut, projet_id")
      .eq("id", id)
      .single();

    if (checkError || !contrat) {
      return {
        success: false,
        error: { notFound: ["Contrat non trouvé"] },
      };
    }

    // Vérifier qu'on ne peut pas supprimer un contrat signé
    if (contrat.statut === "Signé") {
      return {
        success: false,
        error: { statut: ["Un contrat signé ne peut pas être supprimé"] },
      };
    }

    // Vérifier si le contrat a des factures
    const { count: invoicesCount, error: invoicesError } = await adminClient
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("contrat_id", id);

    if (invoicesError) {
      return {
        success: false,
        error: { db: [invoicesError.message] },
      };
    }

    if (invoicesCount && invoicesCount > 0) {
      return {
        success: false,
        error: {
          relations: [
            "Ce contrat a des factures associées, veuillez les supprimer d'abord",
          ],
        },
      };
    }

    // Supprimer le contrat
    const { error } = await adminClient.from("contrats").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    // Mettre à jour le statut du projet si nécessaire
    if (contrat.projet_id) {
      const { data: otherContracts } = await adminClient
        .from("contrats")
        .select("id")
        .eq("projet_id", contrat.projet_id)
        .eq("statut", "Signé");

      if (!otherContracts || otherContracts.length === 0) {
        await adminClient
          .from("projects")
          .update({ statut: "En attente" })
          .eq("id", contrat.projet_id);
      }
    }

    revalidatePath("/dashboard/contrats");
    if (contrat.projet_id) {
      revalidatePath(`/dashboard/projects/${contrat.projet_id}`);
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
