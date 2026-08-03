// src/lib/actions/devis/update-devis.ts
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateDevisSchema = z.object({
  titre: z.string().min(2, "Le titre est requis").optional(),
  client_id: z.string().uuid("ID client invalide").nullable().optional(),
  projet_id: z.string().uuid("ID projet invalide").nullable().optional(),
  statut: z.enum(["Brouillon", "Envoyé", "Accepté", "Refusé"]).optional(),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).optional(),
  montant_total: z.number().nullable().optional(),
  date_emission: z.string().nullable().optional(),
  date_validite: z.string().nullable().optional(),
  conditions: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  contexte: z.string().nullable().optional(),
  objectifs: z.string().nullable().optional(),
  architecture: z.string().nullable().optional(),
  modalites_paiement: z.string().nullable().optional(),
  contenu: z
    .array(
      z.object({
        description: z.string(),
        quantite: z.number(),
        prix_unitaire: z.number(),
      }),
    )
    .default([])
    .optional(),
  prestations: z
    .array(
      z.object({
        titre: z.string(),
        description: z.string(),
      }),
    )
    .default([])
    .optional(),
  planning: z
    .array(
      z.object({
        semaine: z.string(),
        taches: z.string(),
      }),
    )
    .default([])
    .optional(),
});

export async function updateDevis(id: string, data: any) {
  const supabase = await createAdminClient();

  console.log("📝 updateDevis - ID:", id);
  console.log("📝 updateDevis - Data:", data);

  const validated = updateDevisSchema.safeParse(data);

  if (!validated.success) {
    console.error(
      "❌ Validation error:",
      validated.error.flatten().fieldErrors,
    );
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const cleanData: any = {};
    const fields = validated.data;

    if (fields.titre !== undefined) cleanData.titre = fields.titre;
    if (fields.client_id !== undefined) cleanData.client_id = fields.client_id;
    if (fields.projet_id !== undefined) cleanData.projet_id = fields.projet_id;
    if (fields.statut !== undefined) cleanData.statut = fields.statut;
    if (fields.priorite !== undefined) cleanData.priorite = fields.priorite;
    if (fields.date_emission !== undefined)
      cleanData.date_emission = fields.date_emission;
    if (fields.date_validite !== undefined)
      cleanData.date_validite = fields.date_validite;
    if (fields.conditions !== undefined)
      cleanData.conditions = fields.conditions;
    if (fields.notes !== undefined) cleanData.notes = fields.notes;
    if (fields.contexte !== undefined) cleanData.contexte = fields.contexte;
    if (fields.objectifs !== undefined) cleanData.objectifs = fields.objectifs;
    if (fields.architecture !== undefined)
      cleanData.architecture = fields.architecture;
    if (fields.modalites_paiement !== undefined)
      cleanData.modalites_paiement = fields.modalites_paiement;

    if (fields.contenu !== undefined) {
      cleanData.contenu = fields.contenu;
      const total = fields.contenu.reduce(
        (sum, item) => sum + (item.quantite || 0) * (item.prix_unitaire || 0),
        0,
      );
      if (total > 0) {
        cleanData.montant_total = total;
      }
    }

    if (fields.prestations !== undefined)
      cleanData.prestations = fields.prestations;
    if (fields.planning !== undefined) cleanData.planning = fields.planning;

    if (fields.montant_total !== undefined && fields.contenu === undefined) {
      cleanData.montant_total = fields.montant_total;
    }

    // Mettre à jour les noms si le client ou le projet change
    if (fields.client_id !== undefined) {
      const { data: client } = await supabase
        .from("clients")
        .select("nom")
        .eq("id", fields.client_id)
        .single();
      if (client) cleanData.client_nom = client.nom;
      else cleanData.client_nom = null;
    }

    if (fields.projet_id !== undefined) {
      const { data: projet } = await supabase
        .from("projects")
        .select("nom")
        .eq("id", fields.projet_id)
        .single();
      if (projet) cleanData.projet_nom = projet.nom;
      else cleanData.projet_nom = null;
    }

    cleanData.updated_at = new Date().toISOString();

    console.log("📝 updateDevis - CleanData:", cleanData);

    const { data: devis, error } = await supabase
      .from("devis")
      .update(cleanData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Erreur updateDevis:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Devis mis à jour:", devis);

    revalidatePath("/dashboard/devis");
    revalidatePath(`/dashboard/devis/${id}`);

    return {
      success: true,
      data: devis,
    };
  } catch (error: any) {
    console.error("❌ Erreur inattendue:", error);
    return {
      success: false,
      error: error.message || "Une erreur inattendue s'est produite",
    };
  }
}
