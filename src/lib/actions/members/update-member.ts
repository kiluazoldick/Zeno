"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateMemberSchema = z.object({
  id: z.string(), // Peut être email ou UUID
  data: z.object({
    nom: z.string().optional(),
    email: z.string().email().optional(),
    role: z
      .enum([
        "direction",
        "finance",
        "commercial",
        "terrain",
        "bureau",
        "admin",
      ])
      .optional(),
    equipe: z.string().optional(),
    status: z
      .enum([
        "Actif",
        "Invitation en attente",
        "Désactivé",
        "Verrouillé",
        "Suspendu",
      ])
      .optional(),
  }),
});

export async function updateMember(id: string, data: any) {
  const adminClient = await createAdminClient();

  const validated = updateMemberSchema.safeParse({ id, data });

  if (!validated.success) {
    console.error("Validation error:", validated.error.flatten().fieldErrors);
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Essayer d'abord avec l'ID comme email
    let query = adminClient
      .from("members")
      .update({
        ...validated.data.data,
        updated_at: new Date().toISOString(),
      })
      .eq("email", id)
      .select()
      .single();

    let { data: member, error } = await query;

    // Si l'email ne fonctionne pas, essayer avec l'UUID
    if (error) {
      query = adminClient
        .from("members")
        .update({
          ...validated.data.data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      const result = await query;
      member = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Erreur updateMember:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/dashboard/users");

    return {
      success: true,
      data: member,
    };
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
    };
  }
}
