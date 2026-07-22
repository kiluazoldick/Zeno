"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getClientSchema = z.object({
  id: z.string().uuid("ID client invalide"),
  includeProjects: z.boolean().default(true),
  includeDevis: z.boolean().default(false),
  includeContrats: z.boolean().default(false),
  includeInvoices: z.boolean().default(false),
});

export async function getClient(
  id: string,
  options?: {
    includeProjects?: boolean;
    includeDevis?: boolean;
    includeContrats?: boolean;
    includeInvoices?: boolean;
  },
) {
  const supabase = await createServerClient();

  const validated = getClientSchema.safeParse({
    id,
    includeProjects: options?.includeProjects ?? true,
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

  if (validated.data.includeProjects) {
    relations.push("projects (*)");
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
    .from("clients")
    .select(select)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération du client: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les statistiques d'un client
export async function getClientStats(id: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      statut,
      budget_total,
      devis (montant_total, statut),
      contrats (montant_total, statut),
      invoices (montant_total, statut)
    `,
    )
    .eq("client_id", id);

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des statistiques: ${error.message}`,
    );
  }

  const stats = {
    totalProjects: data?.length || 0,
    projectsByStatus: {} as Record<string, number>,
    totalBudget: 0,
    totalDevis: 0,
    totalContrats: 0,
    totalInvoices: 0,
  };

  data?.forEach((project) => {
    // Projets par statut
    stats.projectsByStatus[project.statut] =
      (stats.projectsByStatus[project.statut] || 0) + 1;

    // Budget total
    if (project.budget_total) {
      stats.totalBudget += project.budget_total;
    }

    // Devis
    if (project.devis) {
      stats.totalDevis += project.devis
        .filter((d) => d.statut === "Accepté")
        .reduce((sum, d) => sum + (d.montant_total || 0), 0);
    }

    // Contrats
    if (project.contrats) {
      stats.totalContrats += project.contrats
        .filter((c) => c.statut === "Signé")
        .reduce((sum, c) => sum + (c.montant_total || 0), 0);
    }

    // Factures
    if (project.invoices) {
      stats.totalInvoices += project.invoices
        .filter((i) => i.statut === "Payée")
        .reduce((sum, i) => sum + (i.montant_total || 0), 0);
    }
  });

  return stats;
}
