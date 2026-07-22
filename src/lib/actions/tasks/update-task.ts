"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  taskUpdateSchema,
  type TaskUpdateInput,
} from "@/lib/validations/task.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateTaskSchema = z.object({
  id: z.string().uuid("ID tâche invalide"),
  data: taskUpdateSchema,
});

export async function updateTask(id: string, data: TaskUpdateInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateTaskSchema.safeParse({ id, data });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que la tâche existe
    const { data: existing, error: checkError } = await adminClient
      .from("tasks")
      .select("id, projet_id")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Tâche non trouvée"] },
      };
    }

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

    // Mettre à jour la tâche
    const { data: task, error } = await adminClient
      .from("tasks")
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

    revalidatePath("/dashboard/kanban");
    revalidatePath("/dashboard/tasks");
    if (existing.projet_id) {
      revalidatePath(`/dashboard/projects/${existing.projet_id}`);
    }
    if (validated.data.projet_id) {
      revalidatePath(`/dashboard/projects/${validated.data.projet_id}`);
    }

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
