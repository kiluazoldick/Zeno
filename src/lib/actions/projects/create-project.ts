"use server";

import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import {
  projectSchema,
  type ProjectInput,
} from "@/lib/validations/project.schema";
import { revalidatePath } from "next/cache";

export async function createProject(data: ProjectInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = projectSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le client existe si fourni
    if (validated.data.client_id) {
      const { data: client, error: clientError } = await adminClient
        .from("clients")
        .select("id")
        .eq("id", validated.data.client_id)
        .single();

      if (clientError || !client) {
        return {
          success: false,
          error: { client_id: ["Client non trouvé"] },
        };
      }
    }

    // Créer le projet
    const { data: project, error } = await adminClient
      .from("projects")
      .insert({
        nom: validated.data.nom,
        client_id: validated.data.client_id || null,
        description: validated.data.description || null,
        statut: validated.data.statut || "En cours",
        priorite: validated.data.priorite || "Moyenne",
        budget_total: validated.data.budget_total || null,
        date_debut: validated.data.date_debut || null,
        date_fin: validated.data.date_fin || null,
        progression: 0,
        location: validated.data.location || null,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/default");

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
