"use server";

import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { taskSchema, type TaskInput } from "@/lib/validations/task.schema";
import { revalidatePath } from "next/cache";

export async function createTask(data: TaskInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = taskSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le projet existe si fourni
    if (validated.data.projet_id) {
      const { data: project, error: projectError } = await adminClient
        .from("projects")
        .select("id")
        .eq("id", validated.data.projet_id)
        .single();

      if (projectError || !project) {
        return {
          success: false,
          error: { projet_id: ["Projet non trouvé"] },
        };
      }
    }

    // Vérifier que le membre existe si fourni
    if (validated.data.assigne_a) {
      const { data: member, error: memberError } = await adminClient
        .from("members")
        .select("id")
        .eq("id", validated.data.assigne_a)
        .single();

      if (memberError || !member) {
        return {
          success: false,
          error: { assigne_a: ["Membre non trouvé"] },
        };
      }
    }

    // Récupérer la position max pour le statut actuel
    const { data: maxPosData } = await adminClient
      .from("tasks")
      .select("position")
      .eq("statut", validated.data.statut || "À faire")
      .order("position", { ascending: false })
      .limit(1);

    const maxPosition = maxPosData?.[0]?.position ?? 0;

    // Créer la tâche
    const { data: task, error } = await adminClient
      .from("tasks")
      .insert({
        titre: validated.data.titre,
        description: validated.data.description || null,
        projet_id: validated.data.projet_id || null,
        assigne_a: validated.data.assigne_a || null,
        statut: validated.data.statut || "À faire",
        priorite: validated.data.priorite || "Moyenne",
        date_execution: validated.data.date_execution || null,
        lieu: validated.data.lieu || null,
        rapport_effectue: validated.data.rapport_effectue || false,
        tags: validated.data.tags || null,
        position: maxPosition + 1,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/kanban");
    revalidatePath("/dashboard/tasks");
    if (validated.data.projet_id) {
      revalidatePath(`/dashboard/projects/${validated.data.projet_id}`);
    }
    revalidatePath("/dashboard/default");

    return {
      success: true,
      data: task,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
