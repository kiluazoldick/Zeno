"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getProductivitySchema = z.object({
  period: z.enum(["week", "month", "quarter", "year"]).default("month"),
  memberId: z.string().uuid("ID membre invalide").optional(),
  projectId: z.string().uuid("ID projet invalide").optional(),
});

export type GetProductivityOptions = z.infer<typeof getProductivitySchema>;

export async function getProductivity(options?: GetProductivityOptions) {
  const supabase = await createServerClient();

  const validated = getProductivitySchema.safeParse({
    period: options?.period || "month",
    memberId: options?.memberId,
    projectId: options?.projectId,
  });

  // Récupérer la productivité par membre
  let memberQuery = supabase.from("member_productivity").select("*");

  if (validated.data.memberId) {
    memberQuery = memberQuery.eq("id", validated.data.memberId);
  }

  const { data: memberProductivity, error: memberError } = await memberQuery;

  if (memberError) {
    throw new Error(
      `Erreur lors de la récupération de la productivité des membres: ${memberError.message}`,
    );
  }

  // Récupérer la productivité par projet
  let projectQuery = supabase.from("project_progress").select("*");

  if (validated.data.projectId) {
    projectQuery = projectQuery.eq("id", validated.data.projectId);
  }

  const { data: projectProductivity, error: projectError } = await projectQuery;

  if (projectError) {
    throw new Error(
      `Erreur lors de la récupération de la productivité des projets: ${projectError.message}`,
    );
  }

  // Récupérer les tendances
  const period = validated.data.period;
  const startDate = new Date();

  switch (period) {
    case "week":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "quarter":
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  const { data: trends, error: trendsError } = await supabase
    .from("tasks")
    .select("created_at, statut")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true });

  if (trendsError) {
    throw new Error(
      `Erreur lors de la récupération des tendances: ${trendsError.message}`,
    );
  }

  // Calculer les métriques globales
  const totalTasks = trends?.length || 0;
  const completedTasks =
    trends?.filter((t) => t.statut === "Terminé").length || 0;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculer la productivité moyenne
  const avgProductivity =
    memberProductivity.reduce((sum, m) => sum + (m.taux_productivite || 0), 0) /
    (memberProductivity.length || 1);

  return {
    members: memberProductivity || [],
    projects: projectProductivity || [],
    trends: trends || [],
    summary: {
      totalTasks,
      completedTasks,
      completionRate: Math.round(completionRate),
      avgProductivity: Math.round(avgProductivity),
      activeMembers: memberProductivity.filter((m) => m.taux_productivite > 0)
        .length,
    },
  };
}

// Récupérer la productivité d'un membre spécifique
export async function getMemberProductivity(memberId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("member_productivity")
    .select("*")
    .eq("id", memberId)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération de la productivité du membre: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les statistiques de productivité globales
export async function getProductivityStats() {
  const supabase = await createServerClient();

  // Nombre total de tâches par statut
  const { data: tasksByStatus, error: tasksError } = await supabase
    .from("tasks")
    .select("statut, count(*)")
    .group("statut");

  if (tasksError) {
    throw new Error(
      `Erreur lors de la récupération des statistiques: ${tasksError.message}`,
    );
  }

  // Temps moyen de complétion (approximatif)
  const { data: completedTasks, error: completedError } = await supabase
    .from("tasks")
    .select("created_at, updated_at")
    .eq("statut", "Terminé");

  if (completedError) {
    throw new Error(
      `Erreur lors de la récupération des tâches terminées: ${completedError.message}`,
    );
  }

  let avgCompletionTime = 0;
  if (completedTasks && completedTasks.length > 0) {
    const totalDays = completedTasks.reduce((sum, task) => {
      const created = new Date(task.created_at);
      const updated = new Date(task.updated_at);
      const days =
        (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);
    avgCompletionTime = totalDays / completedTasks.length;
  }

  return {
    tasksByStatus: tasksByStatus || [],
    avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
    totalCompleted: completedTasks?.length || 0,
  };
}
