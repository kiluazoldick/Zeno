"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateTaskPositionSchema = z.object({
  taskId: z.string().uuid("ID tâche invalide"),
  newPosition: z.number().int().min(0),
  columnId: z.enum(["À faire", "En cours", "Annulé", "Terminé"]),
});

export async function updateTaskPosition(
  taskId: string,
  newPosition: number,
  columnId: "À faire" | "En cours" | "Annulé" | "Terminé",
) {
  const adminClient = await createAdminClient();

  const validated = updateTaskPositionSchema.safeParse({
    taskId,
    newPosition,
    columnId,
  });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Récupérer la tâche
    const { data: task, error: getError } = await adminClient
      .from("tasks")
      .select("id, statut, position")
      .eq("id", taskId)
      .single();

    if (getError || !task) {
      return {
        success: false,
        error: { notFound: ["Tâche non trouvée"] },
      };
    }

    // Si la tâche est déjà dans la bonne colonne et à la bonne position
    if (task.statut === columnId && task.position === newPosition) {
      return { success: true };
    }

    // Réorganiser les positions dans la colonne
    // 1. Si la tâche change de colonne ou de position
    // 2. Décaler les autres tâches

    // Mettre à jour la tâche
    const { data: updated, error: updateError } = await adminClient
      .from("tasks")
      .update({
        statut: columnId,
        position: newPosition,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: { db: [updateError.message] },
      };
    }

    // Revalider les positions de la colonne
    const { data: tasksInColumn } = await adminClient
      .from("tasks")
      .select("id")
      .eq("statut", columnId)
      .order("position", { ascending: true });

    if (tasksInColumn) {
      // Mettre à jour les positions en séquence
      for (let i = 0; i < tasksInColumn.length; i++) {
        await adminClient
          .from("tasks")
          .update({ position: i })
          .eq("id", tasksInColumn[i].id);
      }
    }

    revalidatePath("/dashboard/kanban");
    revalidatePath("/dashboard/tasks");

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
