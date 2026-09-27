"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { contratSchema, type ContratInput } from "@/lib/validations/contrat.schema";
import { revalidatePath } from "next/cache";

export async function createContrat(data: ContratInput) {
  const supabase = await createAdminClient();
  const validated = contratSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // ------------------------------------------------------------
    // 1. Vérifications d'intégrité (client, projet, devis)
    // ------------------------------------------------------------
    if (validated.data.client_id) {
      const { data: client, error: clientError } = await supabase
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

    if (validated.data.project_id) {
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id, statut")
        .eq("id", validated.data.project_id)
        .single();

      if (projectError || !project) {
        return {
          success: false,
          error: { project_id: ["Projet non trouvé"] },
        };
      }

      if (project.statut === "Terminé" || project.statut === "Annulé") {
        return {
          success: false,
          error: {
            project_id: [
              "Le projet est terminé ou annulé, impossible de créer un contrat",
            ],
          },
        };
      }
    }

    if (validated.data.devis_id) {
      const { data: devis, error: devisError } = await supabase
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

    // ------------------------------------------------------------
    // 2. Génération automatique du numéro de contrat
    // ------------------------------------------------------------
    const year = new Date().getFullYear();
    const prefix = `CTR-${year}-`;

    // Récupérer le dernier numéro pour l'année en cours
    const { data: lastContract, error: lastError } = await supabase
      .from("contrats")
      .select("numero")
      .ilike("numero", `${prefix}%`)    // filtre sur le préfixe
      .order("numero", { ascending: false })
      .limit(1);

    if (lastError) {
      return {
        success: false,
        error: { db: ["Erreur lors de la génération du numéro"] },
      };
    }

    let nextNumber = 1;
    if (lastContract && lastContract.length > 0) {
      const lastNumero = (lastContract[0] as { numero: string }).numero;
      const suffix = lastNumero.replace(prefix, "");
      const num = parseInt(suffix, 10);
      if (!isNaN(num)) {
        nextNumber = num + 1;
      }
    }

    // Formatage : 3 chiffres avec zéros devant
    const numero = `${prefix}${String(nextNumber).padStart(3, "0")}`;

    // ------------------------------------------------------------
    // 3. Insertion du contrat
    // ------------------------------------------------------------
    const insertData = {
        numero,
        client_id: validated.data.client_id || null,
        projet_id: validated.data.project_id || null,
        devis_id: validated.data.devis_id || null,
        titre: validated.data.titre || null,
        statut: validated.data.statut || "Brouillon",
        priorite: validated.data.priorite || "Moyenne",
        montant_total: validated.data.montant_total || null,
        date_emission: validated.data.date_emission || null,
        date_signature: validated.data.date_signature || null,
        date_debut: validated.data.date_debut || null,
        date_fin: validated.data.date_fin || null,
        livrables: validated.data.livrables,
        paiements: validated.data.paiements,
        prestations: validated.data.prestations,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

    const { data: contrat, error } = await supabase
      .from("contrats")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    // ------------------------------------------------------------
    // 4. Mises à jour annexes (devis, projet)
    // ------------------------------------------------------------
    if (validated.data.devis_id) {
      await supabase
        .from("devis")
        .update({ statut: "Accepté" })
        .eq("id", validated.data.devis_id);
    }

    if (validated.data.statut === "Signé" && validated.data.project_id) {
      await supabase
        .from("projects")
        .update({ statut: "En cours" })
        .eq("id", validated.data.project_id);

    }

    revalidatePath("/dashboard/contrats");
    if (validated.data.project_id) {
      revalidatePath(`/dashboard/projects/${validated.data.project_id}`);
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