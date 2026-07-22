"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  annonceUpdateSchema,
  type AnnonceUpdateInput,
} from "@/lib/validations/annonce.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateAnnonceSchema = z.object({
  id: z.string().uuid("ID annonce invalide"),
  data: annonceUpdateSchema,
});

export async function updateAnnonce(id: string, data: AnnonceUpdateInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateAnnonceSchema.safeParse({ id, data });

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

    // Vérifier qu'on ne peut pas modifier une annonce archivée
    if (existing.statut === "Archivée") {
      return {
        success: false,
        error: { statut: ["Une annonce archivée ne peut pas être modifiée"] },
      };
    }

    // Vérifier que le membre existe si fourni
    if (validated.data.auteur) {
      const { data: member, error: memberError } = await adminClient
        .from("members")
        .select("id")
        .eq("id", validated.data.auteur)
        .single();

      if (memberError || !member) {
        return {
          success: false,
          error: { auteur: ["Membre non trouvé"] },
        };
      }
    }

    // Mettre à jour l'annonce
    const { data: annonce, error } = await adminClient
      .from("annonces")
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
