"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { taskStatusUpdateSchema } from "@/lib/validations/task.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateTaskStatusSchema = z.object({
  id: z.string().uuid("ID tâche invalide"),
  statut: z.enum(["À faire", "En cours", "Annulé", "Terminé"]),
  position: z.number().int().optional(),
  sourceColumnId: z.string().optional(),
  destinationColumnId: z.string().optional(),
});

export async function updateTaskStatus(
  id: string,
  statut: "À faire" | "En cours" | "Annulé" | "Terminé",
  options?: {
    position?: number;
    sourceColumnId?: string;
    destinationColumnId?: string;
  },
) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateTaskStatusSchema.safeParse({
    id,
    statut,
    position: options?.position,
    sourceColumnId: options?.sourceColumnId,
    destinationColumnId: options?.destinationColumnId,
  });

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
      .select("id, projet_id, statut")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Tâche non trouvée"] },
      };
    }

    // Si le statut change, gérer les positions
    if (existing.statut !== validated.data.statut) {
      // Si une position est fournie, l'utiliser
      if (validated.data.position !== undefined) {
        // Décaler les positions si nécessaire
        await adminClient
          .from("tasks")
          .update({ position: adminClient.rpc("increment", { x: 1 }) })
          .gte("position", validated.data.position)
          .eq("statut", validated.data.statut);
      } else {
        // Sinon, placer en dernière position
        const { data: maxPosData } = await adminClient
          .from("tasks")
          .select("position")
          .eq("statut", validated.data.statut)
          .order("position", { ascending: false })
          .limit(1);

        const maxPosition = maxPosData?.[0]?.position ?? 0;
        validated.data.position = maxPosition + 1;
      }
    }

    // Mettre à jour la tâche
    const { data: task, error } = await adminClient
      .from("tasks")
      .update({
        statut: validated.data.statut,
        position: validated.data.position || 0,
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
