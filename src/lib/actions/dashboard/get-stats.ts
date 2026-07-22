"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getStatsSchema = z.object({
  period: z.enum(["week", "month", "quarter", "year"]).default("month"),
  startDate: z.string().date("Date invalide").optional(),
  endDate: z.string().date("Date invalide").optional(),
});

export type GetStatsOptions = z.infer<typeof getStatsSchema>;

export async function getStats(options?: GetStatsOptions) {
  const supabase = await createServerClient();

  const validated = getStatsSchema.safeParse({
    period: options?.period || "month",
    startDate: options?.startDate,
    endDate: options?.endDate,
  });

  // Utiliser les vues existantes
  const { data: monthlyFinances, error: financesError } = await supabase
    .from("monthly_finances")
    .select("*")
    .limit(12);

  if (financesError) {
    console.error("Erreur finances:", financesError);
    // Ne pas throw, retourner des données vides
  }

  const { data: projectProgress, error: progressError } = await supabase
    .from("project_progress")
    .select("*");

  if (progressError) {
    console.error("Erreur projets:", progressError);
  }

  const { data: memberProductivity, error: productivityError } = await supabase
    .from("member_productivity")
    .select("*");

  if (productivityError) {
    console.error("Erreur productivité:", productivityError);
  }

  return {
    finances: monthlyFinances || [],
    projects: projectProgress || [],
    productivity: memberProductivity || [],
  };
}

// Récupérer les données pour les graphiques - VERSION CORRIGÉE
export async function getChartData() {
  const supabase = await createServerClient();

  // Récupérer les tâches par statut (sans .group())
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("statut");

  if (tasksError) {
    console.error("Erreur tâches:", tasksError);
  }

  // Compter manuellement les tâches par statut
  const tasksCount = tasks?.reduce(
    (acc, task) => {
      const statut = task.statut || "À faire";
      acc[statut] = (acc[statut] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tasksResult = Object.entries(tasksCount || {}).map(
    ([statut, count]) => ({
      statut,
      count,
    }),
  );

  // Récupérer les projets par statut (sans .group())
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("statut");

  if (projectsError) {
    console.error("Erreur projets:", projectsError);
  }

  const projectsCount = projects?.reduce(
    (acc, project) => {
      const statut = project.statut || "En attente";
      acc[statut] = (acc[statut] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const projectsResult = Object.entries(projectsCount || {}).map(
    ([statut, count]) => ({
      statut,
      count,
    }),
  );

  // Évolution mensuelle des entrées/sorties
  const { data: monthlyData, error: monthlyError } = await supabase
    .from("monthly_finances")
    .select("*")
    .order("mois", { ascending: true })
    .limit(12);

  if (monthlyError) {
    console.error("Erreur données mensuelles:", monthlyError);
  }

  return {
    tasks: tasksResult || [],
    projects: projectsResult || [],
    monthly: monthlyData || [],
  };
}
