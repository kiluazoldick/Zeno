"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteReportSchema = z.object({
  id: z.string().uuid("ID rapport invalide"),
});

export async function deleteReport(id: string) {
  const adminClient = await createAdminClient();

  const validated = deleteReportSchema.safeParse({ id });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le rapport existe
    const { data: report, error: checkError } = await adminClient
      .from("reports")
      .select("id, statut, projet_id, task_id")
      .eq("id", id)
      .single();

    if (checkError || !report) {
      return {
        success: false,
        error: { notFound: ["Rapport non trouvé"] },
      };
    }

    // Vérifier qu'on ne peut pas supprimer un rapport validé
    if (report.statut === "Validé" || report.statut === "Archivé") {
      return {
        success: false,
        error: {
          statut: ["Un rapport validé ou archivé ne peut pas être supprimé"],
        },
      };
    }

    // Supprimer le rapport
    const { error } = await adminClient.from("reports").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/rapports");
    if (report.projet_id) {
      revalidatePath(`/dashboard/projects/${report.projet_id}`);
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
