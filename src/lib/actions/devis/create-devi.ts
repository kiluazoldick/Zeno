"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { devisSchema, type DevisInput } from "@/lib/validations/devis.schema";
import { revalidatePath } from "next/cache";

export async function createDevi(data: DevisInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = devisSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
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

    // Calculer le montant total si non fourni
    let montantTotal = validated.data.montant_total;
    if (!montantTotal && validated.data.contenu) {
      montantTotal = validated.data.contenu.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
        0,
      );
    }

    // Créer le devis
    const { data: devis, error } = await adminClient
      .from("devis")
      .insert({
        client_id: validated.data.client_id || null,
        projet_id: validated.data.projet_id || null,
        titre: validated.data.titre || null,
        statut: validated.data.statut || "Brouillon",
        priorite: validated.data.priorite || "Moyenne",
        montant_total: montantTotal || null,
        date_emission: validated.data.date_emission || null,
        date_validite: validated.data.date_validite || null,
        contenu: validated.data.contenu || null,
        conditions: validated.data.conditions || null,
        notes: validated.data.notes || null,
        taxe_id: validated.data.taxe_id || "tva",
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/devis");
    if (validated.data.projet_id) {
      revalidatePath(`/dashboard/projects/${validated.data.projet_id}`);
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
