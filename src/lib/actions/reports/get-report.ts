"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getReportSchema = z.object({
  id: z.string().uuid("ID rapport invalide"),
  includeProjet: z.boolean().default(true),
  includeAuteur: z.boolean().default(true),
  includeTask: z.boolean().default(false),
});

export async function getReport(
  id: string,
  options?: {
    includeProjet?: boolean;
    includeAuteur?: boolean;
    includeTask?: boolean;
  },
) {
  const supabase = await createServerClient();

  const validated = getReportSchema.safeParse({
    id,
    includeProjet: options?.includeProjet ?? true,
    includeAuteur: options?.includeAuteur ?? true,
    includeTask: options?.includeTask ?? false,
  });

  if (!validated.success) {
    throw new Error(
      validated.error.flatten().fieldErrors.id?.join(", ") || "ID invalide",
    );
  }

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (validated.data.includeProjet) {
    relations.push("projet:projet_id (*)");
  }

  if (validated.data.includeAuteur) {
    relations.push("auteur_member:auteur (*)");
  }

  if (validated.data.includeTask) {
    relations.push("task:task_id (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  const { data, error } = await supabase
    .from("reports")
    .select(select)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération du rapport: ${error.message}`,
    );
  }

  return data;
}
