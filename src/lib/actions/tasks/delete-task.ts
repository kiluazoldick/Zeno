"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteTaskSchema = z.object({
  id: z.string().uuid("ID tâche invalide"),
});

export async function deleteTask(id: string) {
  const adminClient = await createAdminClient();

  const validated = deleteTaskSchema.safeParse({ id });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que la tâche existe
    const { data: task, error: checkError } = await adminClient
      .from("tasks")
      .select("id, projet_id, statut, position")
      .eq("id", id)
      .single();

    if (checkError || !task) {
      return {
        success: false,
        error: { notFound: ["Tâche non trouvée"] },
      };
    }

    // Supprimer la tâche
    const { error } = await adminClient.from("tasks").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    // Revalider les positions de la colonne
    const { data: tasksInColumn } = await adminClient
      .from("tasks")
      .select("id")
      .eq("statut", task.statut)
      .order("position", { ascending: true });

    if (tasksInColumn) {
      for (let i = 0; i < tasksInColumn.length; i++) {
        await adminClient
          .from("tasks")
          .update({ position: i })
          .eq("id", tasksInColumn[i].id);
      }
    }

    revalidatePath("/dashboard/kanban");
    revalidatePath("/dashboard/tasks");
    if (task.projet_id) {
      revalidatePath(`/dashboard/projects/${task.projet_id}`);
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
