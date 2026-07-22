"use server";

import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import {
  projectUpdateSchema,
  type ProjectUpdateInput,
} from "@/lib/validations/project.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProjectSchema = z.object({
  id: z.string().uuid("ID projet invalide"),
  data: projectUpdateSchema,
});

export async function updateProject(id: string, data: ProjectUpdateInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateProjectSchema.safeParse({ id, data });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le projet existe
    const { data: existing, error: checkError } = await adminClient
      .from("projects")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Projet non trouvé"] },
      };
    }

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

    // Mettre à jour le projet
    const { data: project, error } = await adminClient
      .from("projects")
      .update({
        ...validated.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${id}`);
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

// Mettre à jour la progression d'un projet (calculée automatiquement)
export async function updateProjectProgress(id: string) {
  const adminClient = await createAdminClient();

  try {
    // La progression est mise à jour automatiquement via le trigger SQL
    // On force juste le revalidate
    const { data, error } = await adminClient
      .from("projects")
      .select("progression")
      .eq("id", id)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${id}`);

    return {
      success: true,
      progression: data.progression,
    };
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue",
    };
  }
}
