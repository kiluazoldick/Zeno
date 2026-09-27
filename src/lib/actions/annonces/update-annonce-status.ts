"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateAnnonceStatusSchema = z.object({
  id: z.string().uuid("ID annonce invalide"),
  statut: z.enum(["Brouillon", "Publiée", "Archivée"]),
});

type AnnonceStatut = "Brouillon" | "Publiée" | "Archivée";

export async function updateAnnonceStatus(
  id: string,
  statut: AnnonceStatut,
) {
  const adminClient = await createAdminClient();

  // Validation
  const validated = updateAnnonceStatusSchema.safeParse({
    id,
    statut,
  });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Récupérer l'annonce
    const { data: existing, error: checkError } = await adminClient
      .from("annonces")
      .select("id, statut")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: {
          notFound: ["Annonce non trouvée"],
        },
      };
    }

    // Vérifier que le statut actuel n'est pas null
    if (!existing.statut) {
      return {
        success: false,
        error: {
          statut: ["Le statut actuel de l'annonce est invalide."],
        },
      };
    }

    // Vérifier que le statut actuel est valide
    const currentStatut = existing.statut as AnnonceStatut;

    const validTransitions: Record<AnnonceStatut, AnnonceStatut[]> = {
      Brouillon: ["Publiée", "Archivée"],
      Publiée: ["Archivée"],
      Archivée: [],
    };

    // Vérifier la transition
    if (!validTransitions[currentStatut]?.includes(statut)) {
      return {
        success: false,
        error: {
          statut: [
            `Transition de "${currentStatut}" vers "${statut}" non autorisée`,
          ],
        },
      };
    }

    // Données à mettre à jour
    const updateData: {
      statut: AnnonceStatut;
      updated_at: string;
      date_annonce?: string;
    } = {
      statut,
      updated_at: new Date().toISOString(),
    };

    // Si on publie l'annonce, mettre à jour sa date
    if (statut === "Publiée" && currentStatut !== "Publiée") {
      updateData.date_annonce = new Date().toISOString();
    }

    // Mise à jour
    const { data: annonce, error } = await adminClient
      .from("annonces")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: {
          db: [error.message],
        },
      };
    }

    // Rafraîchir les pages concernées
    revalidatePath("/dashboard/annonces");
    revalidatePath(`/dashboard/annonces/${id}`);
    revalidatePath("/dashboard/annonces?feed=true");

    return {
      success: true,
      data: annonce,
    };
  } catch (error) {
    console.error("Erreur updateAnnonceStatus:", error);

    return {
      success: false,
      error: {
        unexpected: ["Une erreur inattendue s'est produite"],
      },
    };
  }
}