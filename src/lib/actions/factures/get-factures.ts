"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function getFactures() {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("factures")
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
