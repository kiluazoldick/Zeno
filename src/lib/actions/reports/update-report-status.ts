"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { reportStatusUpdateSchema } from "@/lib/validations/report.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateReportStatusSchema = z.object({
  id: z.string().uuid("ID rapport invalide"),
  statut: z.enum(["Brouillon", "En cours", "Validé", "Archivé"]),
  notes: z.string().optional(),
});

export async function updateReportStatus(
  id: string,
  statut: "Brouillon" | "En cours" | "Validé" | "Archivé",
  notes?: string,
) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateReportStatusSchema.safeParse({ id, statut, notes });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le rapport existe
    const { data: existing, error: checkError } = await adminClient
      .from("reports")
      .select("id, statut, projet_id, task_id")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Rapport non trouvé"] },
      };
    }

    // Vérifier la transition de statut
    const validTransitions: Record<string, string[]> = {
      Brouillon: ["En cours", "Validé", "Archivé"],
      "En cours": ["Validé", "Archivé"],
      Validé: ["Archivé"],
      Archivé: [],
    };

    if (!validTransitions[existing.statut]?.includes(statut)) {
      return {
        success: false,
        error: {
          statut: [
            `Transition de "${existing.statut}" vers "${statut}" non autorisée`,
          ],
        },
      };
    }

    // Mettre à jour le statut
    const updateData: any = {
      statut,
      updated_at: new Date().toISOString(),
    };

    if (validated.data.notes) {
      updateData.notes = validated.data.notes;
    }

    const { data: report, error } = await adminClient
      .from("reports")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    // Si le rapport est validé, marquer la tâche comme rapport effectué
    if (statut === "Validé" && existing.task_id) {
      await adminClient
        .from("tasks")
        .update({
          rapport_effectue: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.task_id);
    }

    revalidatePath("/dashboard/rapports");
    revalidatePath(`/dashboard/rapports/${id}`);
    if (existing.projet_id) {
      revalidatePath(`/dashboard/projects/${existing.projet_id}`);
    }
    if (existing.task_id) {
      revalidatePath(`/dashboard/tasks`);
      revalidatePath(`/dashboard/kanban`);
    }

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
