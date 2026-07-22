"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getProjectSchema = z.object({
  id: z.string().uuid("ID projet invalide"),
  includeTasks: z.boolean().default(true),
  includeClient: z.boolean().default(true),
  includeDevis: z.boolean().default(false),
  includeContrats: z.boolean().default(false),
  includeInvoices: z.boolean().default(false),
});

export async function getProject(
  id: string,
  options?: {
    includeTasks?: boolean;
    includeClient?: boolean;
    includeDevis?: boolean;
    includeContrats?: boolean;
    includeInvoices?: boolean;
  },
) {
  const supabase = await createServerClient();

  const validated = getProjectSchema.safeParse({
    id,
    includeTasks: options?.includeTasks ?? true,
    includeClient: options?.includeClient ?? true,
    includeDevis: options?.includeDevis ?? false,
    includeContrats: options?.includeContrats ?? false,
    includeInvoices: options?.includeInvoices ?? false,
  });

  if (!validated.success) {
    throw new Error(
      validated.error.flatten().fieldErrors.id?.join(", ") || "ID invalide",
    );
  }

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (validated.data.includeClient) {
    relations.push("client:client_id (*)");
  }

  if (validated.data.includeTasks) {
    relations.push("tasks (*)");
  }

  if (validated.data.includeDevis) {
    relations.push("devis (*)");
  }

  if (validated.data.includeContrats) {
    relations.push("contrats (*)");
  }

  if (validated.data.includeInvoices) {
    relations.push("invoices (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(select)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur getProject:", error);
    return null;
  }

  return data;
}

// Récupérer l'avancement d'un projet
export async function getProjectProgress(id: string) {
  const supabase = await createServerClient();

  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select(
        `
        id,
        nom,
        progression,
        tasks (id, statut)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erreur getProjectProgress:", error);
      return null;
    }

    const tasks = project?.tasks || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (t: any) => t.statut === "Terminé",
    ).length;
    const avancementTaches =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      id: project.id,
      nom: project.nom,
      progression: project.progression || 0,
      total_taches: totalTasks,
      taches_terminees: completedTasks,
      avancement_taches: Math.round(avancementTaches),
    };
  } catch (error) {
    console.error("Erreur:", error);
    return null;
  }
}
