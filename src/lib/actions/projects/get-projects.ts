"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Schéma pour les filtres
const getProjectsFiltersSchema = z.object({
  search: z.string().optional(),
  statut: z.enum(["En cours", "En attente", "Terminé", "Annulé"]).optional(),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).optional(),
  client_id: z.string().uuid("ID client invalide").optional(),
  date_debut_from: z.string().date("Date invalide").optional(),
  date_debut_to: z.string().date("Date invalide").optional(),
  includeClient: z.boolean().default(true),
  includeTasks: z.boolean().default(false),
});

export type GetProjectsFilters = z.infer<typeof getProjectsFiltersSchema>;

export async function getProjects(filters?: GetProjectsFilters) {
  const supabase = await createServerClient();

  // Construire la requête de base
  let query = supabase
    .from("projects")
    .select(
      `
      *,
      client:client_id (*)
    `,
    )
    .order("created_at", { ascending: false });

  // Appliquer les filtres
  if (filters?.search) {
    query = query.or(
      `nom.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
    );
  }

  if (filters?.statut) {
    query = query.eq("statut", filters.statut);
  }

  if (filters?.priorite) {
    query = query.eq("priorite", filters.priorite);
  }

  if (filters?.client_id) {
    query = query.eq("client_id", filters.client_id);
  }

  if (filters?.date_debut_from) {
    query = query.gte("date_debut", filters.date_debut_from);
  }

  if (filters?.date_debut_to) {
    query = query.lte("date_debut", filters.date_debut_to);
  }

  // Inclure les tâches si demandé
  if (filters?.includeTasks) {
    query = query.select(`
      *,
      client:client_id (*),
      tasks (*)
    `);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erreur getProjects:", error);
    return [];
  }

  return data || [];
}

// Récupérer les projets avec leur avancement
export async function getProjectsWithProgress() {
  const supabase = await createServerClient();

  try {
    // Récupérer les projets avec leurs tâches pour calculer la progression
    const { data: projects, error } = await supabase.from("projects").select(`
        id,
        nom,
        statut,
        progression,
        date_debut,
        date_fin,
        client:client_id (nom),
        tasks (id, statut)
      `);

    if (error) {
      console.error("Erreur getProjectsWithProgress:", error);
      return [];
    }

    // Formater les données avec les calculs
    return (
      projects?.map((project) => {
        const tasks = project.tasks || [];
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
          (t: any) => t.statut === "Terminé",
        ).length;
        const avancementTaches =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return {
          id: project.id,
          nom: project.nom,
          statut: project.statut,
          progression: project.progression || 0,
          date_debut: project.date_debut,
          date_fin: project.date_fin,
          client: project.client?.nom || null,
          total_taches: totalTasks,
          taches_terminees: completedTasks,
          avancement_taches: Math.round(avancementTaches),
        };
      }) || []
    );
  } catch (error) {
    console.error("Erreur:", error);
    return [];
  }
}

// Récupérer les projets d'un client
export async function getProjectsByClient(clientId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      client:client_id (*)
    `,
    )
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur getProjectsByClient:", error);
    return [];
  }

  return data || [];
}
