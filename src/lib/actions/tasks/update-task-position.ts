// src/lib/actions/tasks/update-task-position.ts
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
  try {
    const supabase = await createAdminClient();

    // Valider les paramètres
    const validated = updateTaskPositionSchema.safeParse({
      taskId,
      newPosition,
      columnId,
    });

    if (!validated.success) {
      console.error("Validation error:", validated.error.flatten().fieldErrors);
      return {
        success: false,
        error: validated.error.flatten().fieldErrors,
      };
    }

    console.log("📦 updateTaskPosition - Déplacement:", {
      taskId,
      newPosition,
      columnId,
    });

    // 1. Récupérer la tâche
    const { data: task, error: getError } = await supabase
      .from("tasks")
      .select("id, statut, position")
      .eq("id", taskId)
      .single();

    if (getError || !task) {
      console.error("❌ Tâche non trouvée:", getError);
      return {
        success: false,
        error: { notFound: ["Tâche non trouvée"] },
      };
    }

    // Si la tâche est déjà dans la bonne colonne et à la bonne position
    if (task.statut === columnId && task.position === newPosition) {
      return { success: true };
    }

    // 2. Si changement de colonne, réorganiser la colonne source
    if (task.statut !== columnId) {
      // Décaler les positions dans la colonne source (supprimer la tâche)
      const { error: shiftSourceError } = await supabase.rpc(
        "decrement_task_positions",
        {
          p_column_id: task.statut,
          p_position: task.position,
        },
      );

      if (shiftSourceError) {
        console.error("❌ Erreur décalage source:", shiftSourceError);
      }
    }

    // 3. Mettre à jour la tâche avec sa nouvelle position
    const { data: updated, error: updateError } = await supabase
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
      console.error("❌ Erreur mise à jour:", updateError);
      return {
        success: false,
        error: { db: [updateError.message] },
      };
    }

    // 4. Décaler les positions dans la colonne destination
    const { error: shiftDestError } = await supabase.rpc(
      "increment_task_positions",
      {
        p_column_id: columnId,
        p_position: newPosition,
        p_exclude_task_id: taskId,
      },
    );

    if (shiftDestError) {
      console.error("❌ Erreur décalage destination:", shiftDestError);
    }

    // 5. Revalider les chemins
    revalidatePath("/dashboard/kanban");
    revalidatePath("/dashboard/tasks");

    console.log("✅ updateTaskPosition - Succès pour l'ID:", taskId);
    return {
      success: true,
      data: updated,
    };
  } catch (error: any) {
    console.error("❌ Erreur updateTaskPosition catch:", error);
    return {
      success: false,
      error: {
        unexpected: [error.message || "Une erreur inattendue s'est produite"],
      },
    };
  }
}
