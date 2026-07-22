"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Schéma pour les filtres
const getTasksFiltersSchema = z.object({
  search: z.string().optional(),
  statut: z.enum(["À faire", "En cours", "Annulé", "Terminé"]).optional(),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).optional(),
  projet_id: z.string().uuid("ID projet invalide").optional(),
  assigne_a: z.string().uuid("ID membre invalide").optional(),
  date_execution_from: z.string().date("Date invalide").optional(),
  date_execution_to: z.string().date("Date invalide").optional(),
  rapport_effectue: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  includeProject: z.boolean().default(true),
  includeAssignee: z.boolean().default(true),
});

export type GetTasksFilters = z.infer<typeof getTasksFiltersSchema>;

export async function getTasks(filters?: GetTasksFilters) {
  const supabase = await createServerClient();

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (filters?.includeProject) {
    relations.push("projet:projet_id (*)");
  }

  if (filters?.includeAssignee) {
    relations.push("assigne:assigne_a (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  let query = supabase
    .from("tasks")
    .select(select)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  // Appliquer les filtres
  if (filters?.search) {
    query = query.or(
      `titre.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
    );
  }

  if (filters?.statut) {
    query = query.eq("statut", filters.statut);
  }

  if (filters?.priorite) {
    query = query.eq("priorite", filters.priorite);
  }

  if (filters?.projet_id) {
    query = query.eq("projet_id", filters.projet_id);
  }

  if (filters?.assigne_a) {
    query = query.eq("assigne_a", filters.assigne_a);
  }

  if (filters?.date_execution_from) {
    query = query.gte("date_execution", filters.date_execution_from);
  }

  if (filters?.date_execution_to) {
    query = query.lte("date_execution", filters.date_execution_to);
  }

  if (filters?.rapport_effectue !== undefined) {
    query = query.eq("rapport_effectue", filters.rapport_effectue);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps("tags", filters.tags);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des tâches: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les tâches par projet
export async function getTasksByProject(projectId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      assigne:assigne_a (*)
    `,
    )
    .eq("projet_id", projectId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des tâches du projet: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les tâches d'un membre
export async function getTasksByMember(memberId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      projet:projet_id (*)
    `,
    )
    .eq("assigne_a", memberId)
    .order("date_execution", { ascending: true });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des tâches du membre: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les tâches par statut (pour le Kanban)
export async function getTasksByStatus() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      assigne:assigne_a (*),
      projet:projet_id (id, nom, client:client_id (nom))
    `,
    )
    .order("position", { ascending: true });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des tâches: ${error.message}`,
    );
  }

  // Grouper par statut
  const grouped = data.reduce(
    (acc, task) => {
      const key = task.statut || "À faire";
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    },
    {} as Record<string, typeof data>,
  );

  return grouped;
}
