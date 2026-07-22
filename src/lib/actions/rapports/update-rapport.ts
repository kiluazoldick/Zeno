"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateRapport(id: string, data: any) {
  const adminClient = await createAdminClient();

  try {
    const { data: rapport, error } = await adminClient
      .from("rapports")
      .update({
        titre: data.titre,
        type: data.type,
        contenu: data.contenu,
        statut: data.statut,
        date_rapport: data.date_rapport,
        auteur_id: data.auteur_id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/rapports");
    return { success: true, data: rapport };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
