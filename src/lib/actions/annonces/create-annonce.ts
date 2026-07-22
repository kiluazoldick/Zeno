"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  annonceSchema,
  type AnnonceInput,
} from "@/lib/validations/annonce.schema";
import { revalidatePath } from "next/cache";

export async function createAnnonce(data: AnnonceInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = annonceSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
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

    // Créer l'annonce
    const { data: annonce, error } = await adminClient
      .from("annonces")
      .insert({
        titre: validated.data.titre,
        contenu: validated.data.contenu,
        auteur: validated.data.auteur || null,
        importance: validated.data.importance || "Normale",
        statut: validated.data.statut || "Brouillon",
        date_annonce: new Date().toISOString(),
        date_reunion: validated.data.date_reunion || null,
        tags: validated.data.tags || null,
        commentaires_count: 0,
      })
      .select()
      .single();

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
      data: annonce,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
