"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  reportSchema,
  type ReportInput,
} from "@/lib/validations/report.schema";
import { revalidatePath } from "next/cache";

export async function createReport(data: ReportInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = reportSchema.safeParse(data);

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

    // Créer le rapport
    const { data: report, error } = await adminClient
      .from("reports")
      .insert({
        titre: validated.data.titre,
        type: validated.data.type,
        projet_id: validated.data.projet_id || null,
        task_id: validated.data.task_id || null,
        auteur: validated.data.auteur || null,
        periode: validated.data.periode || null,
        date_rapport: validated.data.date_rapport,
        statut: validated.data.statut || "Brouillon",
        description: validated.data.description || null,
        contenu: validated.data.contenu || null,
        metriques: validated.data.metriques || null,
        prochaines_etapes: validated.data.prochaines_etapes || null,
        problemes: validated.data.problemes || null,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/rapports");
    if (validated.data.projet_id) {
      revalidatePath(`/dashboard/projects/${validated.data.projet_id}`);
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
