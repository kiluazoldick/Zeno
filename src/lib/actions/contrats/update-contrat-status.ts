"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { contratStatusUpdateSchema } from "@/lib/validations/contrat.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateContratStatusSchema = z.object({
  id: z.string().uuid("ID contrat invalide"),
  statut: z.enum(["Brouillon", "En cours", "Signé", "Annulé"]),
  notes: z.string().optional(),
});

export async function updateContratStatus(
  id: string,
  statut: "Brouillon" | "En cours" | "Signé" | "Annulé",
  notes?: string,
) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateContratStatusSchema.safeParse({ id, statut, notes });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le contrat existe
    const { data: existing, error: checkError } = await adminClient
      .from("contrats")
      .select("id, projet_id, statut, client_id")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Contrat non trouvé"] },
      };
    }

    // Vérifier la transition de statut
    const validTransitions: Record<string, string[]> = {
      Brouillon: ["En cours", "Signé", "Annulé"],
      "En cours": ["Signé", "Annulé"],
      Signé: [],
      Annulé: [],
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

    // Si le contrat devient signé, mettre à jour la date de signature
    const updateData: any = {
      statut,
      updated_at: new Date().toISOString(),
    };

    if (statut === "Signé" && !existing.date_signature) {
      updateData.date_signature = new Date().toISOString().split("T")[0];
    }

    if (validated.data.notes) {
      updateData.notes = validated.data.notes;
    }

    // Mettre à jour le statut
    const { data: contrat, error } = await adminClient
      .from("contrats")
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

    // Mettre à jour le statut du projet si le contrat est signé
    if (statut === "Signé" && existing.projet_id) {
      await adminClient
        .from("projects")
        .update({
          statut: "En cours",
          date_debut:
            existing.date_debut || new Date().toISOString().split("T")[0],
        })
        .eq("id", existing.projet_id);
    }

    // Si le contrat est annulé, mettre à jour le statut du projet
    if (statut === "Annulé" && existing.projet_id) {
      const { data: otherContracts } = await adminClient
        .from("contrats")
        .select("id")
        .eq("projet_id", existing.projet_id)
        .eq("statut", "Signé")
        .neq("id", id);

      if (!otherContracts || otherContracts.length === 0) {
        await adminClient
          .from("projects")
          .update({ statut: "En attente" })
          .eq("id", existing.projet_id);
      }
    }

    revalidatePath("/dashboard/contrats");
    revalidatePath(`/dashboard/contrats/${id}`);
    if (existing.projet_id) {
      revalidatePath(`/dashboard/projects/${existing.projet_id}`);
    }

    return {
      success: true,
      data: contrat,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
