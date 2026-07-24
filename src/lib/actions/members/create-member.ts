// src/lib/actions/members/create-member.ts
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schéma de validation
const createMemberSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  role: z.enum([
    "direction",
    "finance",
    "commercial",
    "terrain",
    "bureau",
    "admin",
    "membre",
  ]),
  equipe: z.string().min(1, "L'équipe est requise"),
  status: z
    .enum([
      "Actif",
      "Invitation en attente",
      "Désactivé",
      "Verrouillé",
      "Suspendu",
    ])
    .default("Actif"),
});

export async function createMember(data: any) {
  const adminClient = await createAdminClient();

  console.log("📝 Tentative de création du membre:", data);

  // Valider les données
  const validated = createMemberSchema.safeParse(data);

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
    const { nom, email, role, equipe, status } = validated.data;

    // Vérifier si l'email existe déjà
    const { data: existing, error: checkError } = await adminClient
      .from("members")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      console.error("❌ Email déjà utilisé:", email);
      return {
        success: false,
        error: "Cet email est déjà utilisé par un autre membre",
      };
    }

    // Insérer le nouveau membre - utiliser les colonnes qui existent
    const insertData = {
      id: crypto.randomUUID(),
      nom: nom,
      email: email,
      role: role,
      equipe: equipe,
      status: status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("📝 Données d'insertion:", insertData);

    const { data: member, error } = await adminClient
      .from("members")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("❌ Erreur insertion membre:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Membre créé avec succès:", member);

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
