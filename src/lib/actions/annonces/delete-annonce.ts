"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteAnnonceSchema = z.object({
  id: z.string().uuid("ID annonce invalide"),
});

export async function deleteAnnonce(id: string) {
  const adminClient = await createAdminClient();

  const validated = deleteAnnonceSchema.safeParse({ id });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que l'annonce existe
    const { data: annonce, error: checkError } = await adminClient
      .from("annonces")
      .select("id, statut")
      .eq("id", id)
      .single();

    if (checkError || !annonce) {
      return {
        success: false,
        error: { notFound: ["Annonce non trouvée"] },
      };
    }

    // Vérifier qu'on ne peut pas supprimer une annonce publiée
    if (annonce.statut === "Publiée") {
      return {
        success: false,
        error: {
          statut: [
            "Une annonce publiée ne peut pas être supprimée, archivez-la d'abord",
          ],
        },
      };
    }

    // Supprimer les commentaires associés
    const { error: commentsError } = await adminClient
      .from("comments")
      .delete()
      .eq("entity_type", "annonce")
      .eq("entity_id", id);

    if (commentsError) {
      // On continue même si les commentaires ne sont pas supprimés
      console.warn(
        "Erreur lors de la suppression des commentaires:",
        commentsError,
      );
    }

    // Supprimer l'annonce
    const { error } = await adminClient.from("annonces").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/annonces");
    revalidatePath("/dashboard/annonces?feed=true");

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
