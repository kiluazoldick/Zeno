"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { annonceStatusUpdateSchema } from "@/lib/validations/annonce.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateAnnonceStatusSchema = z.object({
  id: z.string().uuid("ID annonce invalide"),
  statut: z.enum(["Brouillon", "Publiée", "Archivée"]),
});

export async function updateAnnonceStatus(
  id: string,
  statut: "Brouillon" | "Publiée" | "Archivée",
) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateAnnonceStatusSchema.safeParse({ id, statut });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que l'annonce existe
    const { data: existing, error: checkError } = await adminClient
      .from("annonces")
      .select("id, statut")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Annonce non trouvée"] },
      };
    }

    // Vérifier la transition de statut
    const validTransitions: Record<string, string[]> = {
      Brouillon: ["Publiée", "Archivée"],
      Publiée: ["Archivée"],
      Archivée: [],
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

    // Mettre à jour le statut
    const updateData: any = {
      statut,
      updated_at: new Date().toISOString(),
    };

    // Si l'annonce est publiée, mettre à jour la date
    if (statut === "Publiée" && existing.statut !== "Publiée") {
      updateData.date_annonce = new Date().toISOString();
    }

    const { data: annonce, error } = await adminClient
      .from("annonces")
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

    revalidatePath("/dashboard/annonces");
    revalidatePath(`/dashboard/annonces/${id}`);
    revalidatePath("/dashboard/annonces?feed=true");

    return {
      success: true,
      data: annonce,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
