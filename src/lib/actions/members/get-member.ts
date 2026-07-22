"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const getMemberSchema = z.object({
  id: z.string().uuid("ID membre invalide"),
});

export async function getMember(id: string) {
  const adminClient = await createAdminClient();

  const validated = getMemberSchema.safeParse({ id });

  if (!validated.success) {
    return null;
  }

  const { data, error } = await adminClient
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur getMember:", error);
    return null;
  }

  return data;
}
