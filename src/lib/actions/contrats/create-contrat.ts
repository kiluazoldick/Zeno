"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  contratSchema,
  type ContratInput,
} from "@/lib/validations/contrat.schema";
import { revalidatePath } from "next/cache";

export async function createContrat(data: ContratInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = contratSchema.safeParse(data);

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
        .select("id, statut")
        .eq("id", validated.data.projet_id)
        .single();

      if (projectError || !project) {
        return {
          success: false,
          error: { projet_id: ["Projet non trouvé"] },
        };
      }

      // Vérifier que le projet n'est pas terminé ou annulé
      if (project.statut === "Terminé" || project.statut === "Annulé") {
        return {
          success: false,
          error: {
            projet_id: [
              "Le projet est terminé ou annulé, impossible de créer un contrat",
            ],
          },
        };
      }
    }

    // Vérifier que le devis existe et est accepté si fourni
    if (validated.data.devis_id) {
      const { data: devis, error: devisError } = await adminClient
        .from("devis")
        .select("id, statut")
        .eq("id", validated.data.devis_id)
        .single();

      if (devisError || !devis) {
        return {
          success: false,
          error: { devis_id: ["Devis non trouvé"] },
        };
      }

      if (devis.statut !== "Accepté") {
        return {
          success: false,
          error: {
            devis_id: ["Le devis doit être accepté pour créer un contrat"],
          },
        };
      }
    }

    // Créer le contrat
    const { data: contrat, error } = await adminClient
      .from("contrats")
      .insert({
        client_id: validated.data.client_id || null,
        projet_id: validated.data.projet_id || null,
        devis_id: validated.data.devis_id || null,
        titre: validated.data.titre || null,
        statut: validated.data.statut || "Brouillon",
        priorite: validated.data.priorite || "Moyenne",
        montant_total: validated.data.montant_total || null,
        date_emission: validated.data.date_emission || null,
        date_signature: validated.data.date_signature || null,
        date_debut: validated.data.date_debut || null,
        date_fin: validated.data.date_fin || null,
        contenu: validated.data.contenu || null,
        conditions: validated.data.conditions || null,
        clauses: validated.data.clauses || null,
        notes: validated.data.notes || null,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    // Mettre à jour le statut du devis si lié
    if (validated.data.devis_id) {
      await adminClient
        .from("devis")
        .update({ statut: "Accepté" })
        .eq("id", validated.data.devis_id);
    }

    // Mettre à jour le statut du projet si signé
    if (validated.data.statut === "Signé" && validated.data.projet_id) {
      await adminClient
        .from("projects")
        .update({ statut: "En cours" })
        .eq("id", validated.data.projet_id);
    }

    revalidatePath("/dashboard/contrats");
    if (validated.data.projet_id) {
      revalidatePath(`/dashboard/projects/${validated.data.projet_id}`);
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
