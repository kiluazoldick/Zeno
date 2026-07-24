// src/lib/actions/members/delete-member.ts
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteMemberSchema = z.object({
  id: z.string().uuid("ID membre invalide"),
});

export async function deleteMember(id: string, hardDelete: boolean = true) {
  const adminClient = await createAdminClient();

  console.log("🗑️ deleteMember - ID:", id);
  console.log("🗑️ deleteMember - hardDelete:", hardDelete);

  // Valider l'ID
  const validated = deleteMemberSchema.safeParse({ id });

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
    // Suppression définitive
    console.log("🗑️ Suppression définitive du membre:", id);
    const { error } = await adminClient.from("members").delete().eq("id", id);

    if (error) {
      console.error("❌ Erreur deleteMember:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Membre supprimé définitivement");

    revalidatePath("/dashboard/users");

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("❌ Erreur inattendue:", error);
    return {
      success: false,
      error: error.message || "Une erreur inattendue s'est produite",
    };
  }
}
