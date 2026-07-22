"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateFacture(id: string, data: any) {
  const adminClient = await createAdminClient();

  try {
    const { data: facture, error } = await adminClient
      .from("factures")
      .update({
        numero: data.numero,
        titre: data.titre,
        client_id: data.client_id,
        projet_id: data.projet_id,
        statut: data.statut,
        montant_total: data.montant_total,
        date_emission: data.date_emission,
        date_echeance: data.date_echeance,
        notes: data.notes,
      })
      .eq("id", id)
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
