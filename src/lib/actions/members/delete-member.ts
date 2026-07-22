"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteMemberSchema = z.object({
  id: z.string(), // Peut être email ou UUID
  hardDelete: z.boolean().default(false),
});

export async function deleteMember(id: string, hardDelete: boolean = false) {
  const adminClient = await createAdminClient();

  const validated = deleteMemberSchema.safeParse({ id, hardDelete });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    let error = null;

    if (validated.data.hardDelete) {
      // Suppression définitive
      // Essayer d'abord avec l'email
      let result = await adminClient.from("members").delete().eq("email", id);

      if (result.error) {
        // Sinon avec l'UUID
        result = await adminClient.from("members").delete().eq("id", id);
        error = result.error;
      }
    } else {
      // Désactivation (soft delete)
      let result = await adminClient
        .from("members")
        .update({
          status: "Désactivé",
          updated_at: new Date().toISOString(),
        })
        .eq("email", id);

      if (result.error) {
        result = await adminClient
          .from("members")
          .update({
            status: "Désactivé",
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);
        error = result.error;
      }
    }

    if (error) {
      console.error("Erreur deleteMember:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/dashboard/users");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
    };
  }
}
