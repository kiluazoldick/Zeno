"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  contratUpdateSchema,
  type ContratUpdateInput,
} from "@/lib/validations/contrat.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateContratSchema = z.object({
  id: z.string().uuid("ID contrat invalide"),
  data: contratUpdateSchema,
});

export async function updateContrat(id: string, data: ContratUpdateInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateContratSchema.safeParse({ id, data });

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
      .select("id, statut")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Contrat non trouvé"] },
      };
    }

    // Vérifier que le contrat n'est pas déjà signé
    if (
      existing.statut === "Signé" &&
      validated.data.statut !== existing.statut
    ) {
      return {
        success: false,
        error: { statut: ["Un contrat signé ne peut pas être modifié"] },
      };
    }

    // Vérifier que le projet existe si fourni
    if (validated.data.projet_id) {
      const { data: project, error: projectError } = await adminClient
        .from("projects")
        .select("id")
        .eq("id", validated.data.projet_id)
        .single();

      if (projectError || !project) {
        return {
          success: false,
          error: { projet_id: ["Projet non trouvé"] },
        };
      }
    }

    // Mettre à jour le contrat
    const { data: contrat, error } = await adminClient
      .from("contrats")
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

    revalidatePath("/dashboard/contrats");
    revalidatePath(`/dashboard/contrats/${id}`);

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
