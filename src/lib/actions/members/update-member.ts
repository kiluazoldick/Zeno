// src/lib/actions/members/update-member.ts
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateMemberSchema = z.object({
  nom: z.string().min(2, "Le nom est requis").optional(),
  email: z.string().email("Email invalide").optional(),
  role: z
    .enum([
      "direction",
      "finance",
      "commercial",
      "terrain",
      "bureau",
      "admin",
      "membre",
    ])
    .optional(),
  equipe: z.string().min(1, "L'équipe est requise").optional(),
  status: z
    .enum([
      "Actif",
      "Invitation en attente",
      "Désactivé",
      "Verrouillé",
      "Suspendu",
    ])
    .optional(),
  joined_date: z.string().nullable().optional(),
});

export async function updateMember(id: string, data: any) {
  const adminClient = await createAdminClient();

  console.log("📝 updateMember - ID:", id);
  console.log("📝 updateMember - Data:", data);

  const validated = updateMemberSchema.safeParse(data);

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
    const cleanData: any = {};
    const fields = validated.data;

    if (fields.nom !== undefined) cleanData.nom = fields.nom;
    if (fields.email !== undefined) cleanData.email = fields.email;
    if (fields.role !== undefined) cleanData.role = fields.role;
    if (fields.equipe !== undefined) cleanData.equipe = fields.equipe;
    if (fields.status !== undefined) cleanData.status = fields.status;
    if (fields.joined_date !== undefined)
      cleanData.joined_date = fields.joined_date || null;

    cleanData.updated_at = new Date().toISOString();

    console.log("📝 updateMember - CleanData:", cleanData);

    const { data: member, error } = await adminClient
      .from("members")
      .update(cleanData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Erreur updateMember:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Membre mis à jour:", member);

    revalidatePath("/dashboard/users");

    return {
      success: true,
      data: member,
    };
  } catch (error: any) {
    console.error("❌ Erreur inattendue:", error);
    return {
      success: false,
      error: error.message || "Une erreur inattendue s'est produite",
    };
  }
}
