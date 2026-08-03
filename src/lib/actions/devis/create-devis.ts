// src/lib/actions/devis/create-devis.ts
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createDevisSchema = z.object({
  titre: z.string().min(2, "Le titre est requis"),
  client_id: z.string().uuid("ID client invalide").nullable().optional(),
  projet_id: z.string().uuid("ID projet invalide").nullable().optional(),
  statut: z
    .enum(["Brouillon", "Envoyé", "Accepté", "Refusé"])
    .default("Brouillon"),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
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
    .default([]),
  prestations: z
    .array(
      z.object({
        titre: z.string(),
        description: z.string(),
      }),
    )
    .default([]),
  planning: z
    .array(
      z.object({
        semaine: z.string(),
        taches: z.string(),
      }),
    )
    .default([]),
});

export async function createDevis(data: any) {
  const supabase = await createAdminClient();

  console.log("📝 Tentative de création du devis:", data);

  const validated = createDevisSchema.safeParse(data);

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
    // Générer un numéro unique
    const year = new Date().getFullYear();
    const { data: lastDevis } = await supabase
      .from("devis")
      .select("numero")
      .like("numero", `DEV-${year}-%`)
      .order("numero", { ascending: false })
      .limit(1);

    let nextNumber = 1;
    if (lastDevis && lastDevis.length > 0) {
      const lastNum = parseInt(lastDevis[0].numero.split("-")[2]);
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }

    const numero = `DEV-${year}-${String(nextNumber).padStart(3, "0")}`;

    // Récupérer les noms du client et du projet
    let client_nom = null;
    let projet_nom = null;

    if (validated.data.client_id) {
      const { data: client } = await supabase
        .from("clients")
        .select("nom")
        .eq("id", validated.data.client_id)
        .single();
      if (client) client_nom = client.nom;
    }

    if (validated.data.projet_id) {
      const { data: projet } = await supabase
        .from("projects")
        .select("nom")
        .eq("id", validated.data.projet_id)
        .single();
      if (projet) projet_nom = projet.nom;
    }

    // Calculer le montant total
    let montantTotal = validated.data.montant_total;
    if (!montantTotal && validated.data.contenu.length > 0) {
      montantTotal = validated.data.contenu.reduce(
        (sum, item) => sum + (item.quantite || 0) * (item.prix_unitaire || 0),
        0,
      );
    }

    const insertData = {
      numero,
      titre: validated.data.titre,
      client_id: validated.data.client_id || null,
      projet_id: validated.data.projet_id || null,
      client_nom,
      projet_nom,
      statut: validated.data.statut,
      priorite: validated.data.priorite,
      montant_total: montantTotal || null,
      date_emission:
        validated.data.date_emission || new Date().toISOString().split("T")[0],
      date_validite: validated.data.date_validite || null,
      conditions: validated.data.conditions || null,
      notes: validated.data.notes || null,
      contexte: validated.data.contexte || null,
      objectifs: validated.data.objectifs || null,
      architecture: validated.data.architecture || null,
      modalites_paiement: validated.data.modalites_paiement || null,
      contenu: validated.data.contenu || [],
      prestations: validated.data.prestations || [],
      planning: validated.data.planning || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("📝 Données d'insertion:", insertData);

    const { data: devis, error } = await supabase
      .from("devis")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("❌ Erreur insertion devis:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Devis créé avec succès:", devis);

    revalidatePath("/dashboard/devis");

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
