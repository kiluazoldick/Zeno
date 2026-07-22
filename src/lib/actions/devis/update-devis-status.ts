"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { devisStatusUpdateSchema } from "@/lib/validations/devis.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateDevisStatusSchema = z.object({
  id: z.string().uuid("ID devis invalide"),
  statut: z.enum(["Brouillon", "Envoyé", "Accepté", "Refusé"]),
  notes: z.string().optional(),
});

export async function updateDevisStatus(
  id: string,
  statut: "Brouillon" | "Envoyé" | "Accepté" | "Refusé",
  notes?: string,
) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateDevisStatusSchema.safeParse({ id, statut, notes });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le devis existe
    const { data: existing, error: checkError } = await adminClient
      .from("devis")
      .select("id, client_id, projet_id, statut")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Devis non trouvé"] },
      };
    }

    // Vérifier la transition de statut
    const validTransitions: Record<string, string[]> = {
      Brouillon: ["Envoyé", "Refusé"],
      Envoyé: ["Accepté", "Refusé"],
      Accepté: [],
      Refusé: [],
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
    const { data: devis, error } = await adminClient
      .from("devis")
      .update({
        statut,
        notes: validated.data.notes || existing.notes,
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

    // Si le devis est accepté, créer automatiquement un contrat ?
    // (Optionnel : à activer si besoin)
    if (statut === "Accepté") {
      // Ici, on pourrait créer un contrat automatiquement
      // Mais on laisse l'utilisateur le faire manuellement
    }

    revalidatePath("/dashboard/devis");
    revalidatePath(`/dashboard/devis/${id}`);
    if (existing.projet_id) {
      revalidatePath(`/dashboard/projects/${existing.projet_id}`);
    }

    return {
      success: true,
      data: devis,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
