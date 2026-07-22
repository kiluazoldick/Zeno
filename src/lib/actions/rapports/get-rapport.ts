"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function getRapport(id: string) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("rapports")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
