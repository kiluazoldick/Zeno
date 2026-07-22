"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Schéma pour les filtres
const getReportsFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["Quotidien", "Hebdomadaire", "Mensuel", "Réunion"]).optional(),
  statut: z.enum(["Brouillon", "En cours", "Validé", "Archivé"]).optional(),
  projet_id: z.string().uuid("ID projet invalide").optional(),
  auteur: z.string().uuid("ID membre invalide").optional(),
  task_id: z.string().uuid("ID tâche invalide").optional(),
  date_from: z.string().date("Date invalide").optional(),
  date_to: z.string().date("Date invalide").optional(),
  includeProjet: z.boolean().default(true),
  includeAuteur: z.boolean().default(true),
  includeTask: z.boolean().default(false),
});

export type GetReportsFilters = z.infer<typeof getReportsFiltersSchema>;

export async function getReports(filters?: GetReportsFilters) {
  const supabase = await createServerClient();

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (filters?.includeProjet) {
    relations.push("projet:projet_id (*)");
  }

  if (filters?.includeAuteur) {
    relations.push("auteur_member:auteur (*)");
  }

  if (filters?.includeTask) {
    relations.push("task:task_id (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  let query = supabase
    .from("reports")
    .select(select)
    .order("date_rapport", { ascending: false });

  // Appliquer les filtres
  if (filters?.search) {
    query = query.or(
      `titre.ilike.%${filters.search}%,description.ilike.%${filters.search}%,contenu.ilike.%${filters.search}%`,
    );
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  if (filters?.statut) {
    query = query.eq("statut", filters.statut);
  }

  if (filters?.projet_id) {
    query = query.eq("projet_id", filters.projet_id);
  }

  if (filters?.auteur) {
    query = query.eq("auteur", filters.auteur);
  }

  if (filters?.task_id) {
    query = query.eq("task_id", filters.task_id);
  }

  if (filters?.date_from) {
    query = query.gte("date_rapport", filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte("date_rapport", filters.date_to);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des rapports: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les rapports d'un projet
export async function getReportsByProject(projectId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select(
      `
      *,
      auteur_member:auteur (*)
    `,
    )
    .eq("projet_id", projectId)
    .order("date_rapport", { ascending: false });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des rapports du projet: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les rapports d'un membre
export async function getReportsByMember(memberId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select(
      `
      *,
      projet:projet_id (*)
    `,
    )
    .eq("auteur", memberId)
    .order("date_rapport", { ascending: false });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des rapports du membre: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les rapports validés
export async function getValidatedReports() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select(
      `
      *,
      projet:projet_id (*),
      auteur_member:auteur (*)
    `,
    )
    .eq("statut", "Validé")
    .order("date_rapport", { ascending: false });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des rapports validés: ${error.message}`,
    );
  }

  return data;
}
