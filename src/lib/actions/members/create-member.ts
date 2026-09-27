// src/lib/actions/members/create-member.ts
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
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
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export async function createMember(data: any) {
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
    const { nom, email, role, equipe, status, password } = validated.data;
    const result = await auth.api.signUpEmail({
      body: {
        name: nom,
        email,
        password,
        role,
        equipe,
        status,
      },
      headers: await headers(),
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      data: result.user,
    };
  } catch (error: any) {
    console.error("❌ Erreur inattendue:", error);
    return {
      success: false,
      error: error.message || "Une erreur inattendue s'est produite",
    };
  }
}
