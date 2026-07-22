"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  devisUpdateSchema,
  type DevisUpdateInput,
} from "@/lib/validations/devis.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateDeviSchema = z.object({
  id: z.string().uuid("ID devis invalide"),
  data: devisUpdateSchema,
});

export async function updateDevi(id: string, data: DevisUpdateInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateDeviSchema.safeParse({ id, data });

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
      .select("id, statut")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Devis non trouvé"] },
      };
    }

    // Vérifier que le devis n'est pas déjà accepté
    if (
      existing.statut === "Accepté" &&
      validated.data.statut !== existing.statut
    ) {
      return {
        success: false,
        error: { statut: ["Un devis accepté ne peut pas être modifié"] },
      };
    }

    // Vérifier que le client existe si fourni
    if (validated.data.client_id) {
      const { data: client, error: clientError } = await adminClient
        .from("clients")
        .select("id")
        .eq("id", validated.data.client_id)
        .single();

      if (clientError || !client) {
        return {
          success: false,
          error: { client_id: ["Client non trouvé"] },
        };
      }
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

    // Recalculer le montant total si les lignes ont changé
    let montantTotal = validated.data.montant_total;
    if (!montantTotal && validated.data.contenu) {
      montantTotal = validated.data.contenu.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
        0,
      );
    }

    // Mettre à jour le devis
    const { data: devis, error } = await adminClient
      .from("devis")
      .update({
        ...validated.data,
        montant_total: montantTotal || null,
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

    revalidatePath("/dashboard/devis");
    revalidatePath(`/dashboard/devis/${id}`);

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
