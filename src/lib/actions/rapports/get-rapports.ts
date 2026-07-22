"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function getRapports() {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("rapports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
