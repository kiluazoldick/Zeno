"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  reportUpdateSchema,
  type ReportUpdateInput,
} from "@/lib/validations/report.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateReportSchema = z.object({
  id: z.string().uuid("ID rapport invalide"),
  data: reportUpdateSchema,
});

export async function updateReport(id: string, data: ReportUpdateInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateReportSchema.safeParse({ id, data });

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
      .select("id, statut")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Rapport non trouvé"] },
      };
    }

    // Vérifier qu'on ne peut pas modifier un rapport validé ou archivé
    if (existing.statut === "Validé" || existing.statut === "Archivé") {
      return {
        success: false,
        error: {
          statut: ["Un rapport validé ou archivé ne peut pas être modifié"],
        },
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
    if (validated.data.auteur) {
      const { data: member, error: memberError } = await adminClient
        .from("members")
        .select("id")
        .eq("id", validated.data.auteur)
        .single();

      if (memberError || !member) {
        return {
          success: false,
          error: { auteur: ["Membre non trouvé"] },
        };
      }
    }

    // Vérifier que la tâche existe si fournie
    if (validated.data.task_id) {
      const { data: task, error: taskError } = await adminClient
        .from("tasks")
        .select("id")
        .eq("id", validated.data.task_id)
        .single();

      if (taskError || !task) {
        return {
          success: false,
          error: { task_id: ["Tâche non trouvée"] },
        };
      }
    }

    // Mettre à jour le rapport
    const { data: report, error } = await adminClient
      .from("reports")
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

    revalidatePath("/dashboard/rapports");
    revalidatePath(`/dashboard/rapports/${id}`);

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
