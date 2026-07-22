"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFacture(data: any) {
  const adminClient = await createAdminClient();

  try {
    const { data: facture, error } = await adminClient
      .from("factures")
      .insert({
        numero: data.numero,
        titre: data.titre,
        client_id: data.client_id,
        projet_id: data.projet_id,
        statut: data.statut || "Brouillon",
        montant_total: data.montant_total || 0,
        date_emission: data.date_emission,
        date_echeance: data.date_echeance,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/factures");
    return { success: true, data: facture };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
