"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getMembers() {
  const adminClient = await createAdminClient();

  try {
    const { data, error } = await adminClient
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur getMembers:", error);
      return [];
    }

    console.log("Membres récupérés:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return [];
  }
}
