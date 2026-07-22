"use server";

import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteProjectSchema = z.object({
  id: z.string().uuid("ID projet invalide"),
  cascade: z.boolean().default(true), // Supprimer les tâches associées
});

export async function deleteProject(id: string, cascade: boolean = true) {
  const adminClient = await createAdminClient();

  const validated = deleteProjectSchema.safeParse({ id, cascade });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le projet existe
    const { data: project, error: checkError } = await adminClient
      .from("projects")
      .select("id, nom, client_id")
      .eq("id", id)
      .single();

    if (checkError || !project) {
      return {
        success: false,
        error: { notFound: ["Projet non trouvé"] },
      };
    }

    // Vérifier les relations avant suppression
    if (!cascade) {
      // Vérifier les tâches
      const { count: tasksCount, error: tasksError } = await adminClient
        .from("tasks")
        .select("id", { count: "exact", head: true })
        .eq("projet_id", id);

      if (tasksError) {
        return {
          success: false,
          error: { db: [tasksError.message] },
        };
      }

      if (tasksCount && tasksCount > 0) {
        return {
          success: false,
          error: {
            relations: [
              `Le projet a ${tasksCount} tâche(s) associée(s). Utilisez cascade pour les supprimer.`,
            ],
          },
        };
      }

      // Vérifier les devis
      const { count: devisCount, error: devisError } = await adminClient
        .from("devis")
        .select("id", { count: "exact", head: true })
        .eq("projet_id", id);

      if (devisError) {
        return {
          success: false,
          error: { db: [devisError.message] },
        };
      }

      if (devisCount && devisCount > 0) {
        return {
          success: false,
          error: { relations: [`Le projet a ${devisCount} devis associé(s).`] },
        };
      }
    }

    // Supprimer le projet (les relations sont gérées par CASCADE en DB)
    const { error } = await adminClient.from("projects").delete().eq("id", id);

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
      data: {
        id: project.id,
        nom: project.nom,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
