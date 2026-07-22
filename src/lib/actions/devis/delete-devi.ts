"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteDeviSchema = z.object({
  id: z.string().uuid("ID devis invalide"),
});

export async function deleteDevi(id: string) {
  const adminClient = await createAdminClient();

  const validated = deleteDeviSchema.safeParse({ id });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le devis existe
    const { data: devis, error: checkError } = await adminClient
      .from("devis")
      .select("id, statut, projet_id")
      .eq("id", id)
      .single();

    if (checkError || !devis) {
      return {
        success: false,
        error: { notFound: ["Devis non trouvé"] },
      };
    }

    // Vérifier qu'on ne peut pas supprimer un devis accepté
    if (devis.statut === "Accepté") {
      return {
        success: false,
        error: { statut: ["Un devis accepté ne peut pas être supprimé"] },
      };
    }

    // Vérifier si le devis est lié à un contrat
    const { data: contrat, error: contratError } = await adminClient
      .from("contrats")
      .select("id")
      .eq("devis_id", id)
      .maybeSingle();

    if (contratError) {
      return {
        success: false,
        error: { db: [contratError.message] },
      };
    }

    if (contrat) {
      return {
        success: false,
        error: {
          relations: [
            "Ce devis est lié à un contrat et ne peut pas être supprimé",
          ],
        },
      };
    }

    // Supprimer le devis
    const { error } = await adminClient.from("devis").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/devis");
    if (devis.projet_id) {
      revalidatePath(`/dashboard/projects/${devis.projet_id}`);
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
