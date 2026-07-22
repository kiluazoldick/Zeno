"use server";

import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().optional(),
});

export async function register(formData: FormData) {
  const supabase = await createServerClient();

  const validatedFields = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, nom, prenom } = validatedFields.data;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nom,
        prenom,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Créer automatiquement le membre dans la table members
  if (data.user) {
    const adminClient = await createAdminClient();
    await adminClient.from("members").insert({
      id: data.user.id,
      email: data.user.email!,
      nom,
      prenom: prenom || null,
      role: "terrain", // Rôle par défaut
      status: "Actif",
    });
  }

  redirect("/dashboard/default");
}
