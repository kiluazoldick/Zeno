"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  clientSchema,
  type ClientInput,
} from "@/lib/validations/client.schema";
import { revalidatePath } from "next/cache";

export async function createClient(data: ClientInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = clientSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que l'email n'existe pas déjà
    if (validated.data.email) {
      const { data: existing, error: checkError } = await adminClient
        .from("clients")
        .select("id")
        .eq("email", validated.data.email)
        .maybeSingle();

      if (checkError) {
        return {
          success: false,
          error: { db: [checkError.message] },
        };
      }

      if (existing) {
        return {
          success: false,
          error: { email: ["Un client avec cet email existe déjà"] },
        };
      }
    }

    // Créer le client
    const { data: client, error } = await adminClient
      .from("clients")
      .insert({
        nom: validated.data.nom,
        email: validated.data.email || null,
        telephone: validated.data.telephone || null,
        adresse: validated.data.adresse || null,
        secteur: validated.data.secteur || null,
        code_postal: validated.data.code_postal || null,
        ville: validated.data.ville || null,
        pays: validated.data.pays || "Cameroun",
        tax_id: validated.data.tax_id || null,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/crm");
    revalidatePath("/dashboard/projects");

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
