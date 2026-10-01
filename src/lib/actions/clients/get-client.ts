"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { Client } from "@/types";

export type ClientWithRelations = Client & {
  projects?: unknown[] | null;
  devis?: unknown[] | null;
  contrats?: unknown[] | null;
  invoices?: unknown[] | null;
};

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
): Promise<ClientWithRelations> {
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

  return data as unknown as ClientWithRelations;
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

  const projectRows = (data ?? []) as unknown as Array<{
    id: string;
    statut: string | null;
    budget_total: number | null;
    devis: Array<{ montant_total: number | null; statut: string | null }> | null;
    contrats: Array<{
      montant_total: number | null;
      statut: string | null;
    }> | null;
    invoices: Array<{
      montant_total: number | null;
      statut: string | null;
    }> | null;
  }>;

  const stats = {
    totalProjects: projectRows.length,
    projectsByStatus: {} as Record<string, number>,
    totalBudget: 0,
    totalDevis: 0,
    totalContrats: 0,
    totalInvoices: 0,
  };

  projectRows.forEach((project) => {
    // Projets par statut
    const status = project.statut || "Inconnu";
    stats.projectsByStatus[status] =
      (stats.projectsByStatus[status] || 0) + 1;

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
