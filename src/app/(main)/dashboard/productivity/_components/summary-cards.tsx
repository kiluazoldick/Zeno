"use client";

import { Clock3, FolderKanban, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardsProps {
  tasks?: any[];
  projects?: any[];
  members?: any[];
  stats?: {
    total_projects: number;
    total_tasks: number;
    completed_tasks: number;
    total_members: number;
    active_projects: number;
  };
  isLoading?: boolean;
}

export function SummaryCards({
  tasks,
  projects,
  members,
  stats,
  isLoading,
}: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-xs">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculer les vraies métriques
  const totalProjects = stats?.total_projects || 0;
  const activeProjects =
    stats?.active_projects ||
    projects?.filter((p: any) => p.statut === "En cours").length ||
    0;

  const today = new Date();
  const todayTasks =
    tasks?.filter((t: any) => {
      if (!t.date_execution) return false;
      const d = new Date(t.date_execution);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    }) || [];

  const totalTasks = stats?.total_tasks || tasks?.length || 0;
  const completedTasks =
    stats?.completed_tasks ||
    tasks?.filter((t: any) => t.statut === "Terminé").length ||
    0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeMembers =
    members?.filter((m: any) => m.statut === "Actif").length || 0;

  const summaryCards = [
    {
      title: "Projets",
      value: `${activeProjects}/${totalProjects}`,
      description: `${activeProjects} projet${activeProjects > 1 ? "s" : ""} en cours`,
      icon: FolderKanban,
    },
    {
      title: "Tâches aujourd'hui",
      value: todayTasks.length.toString(),
      description: `${todayTasks.length} tâche${todayTasks.length > 1 ? "s" : ""} aujourd'hui`,
      icon: Clock3,
    },
    {
      title: "Productivité",
      value: `${completionRate}%`,
      description: `${completedTasks}/${totalTasks} tâches terminées`,
      icon: TrendingUp,
    },
    {
      title: "Équipe",
      value: activeMembers.toString(),
      description: `${activeMembers} membre${activeMembers > 1 ? "s" : ""} actif${activeMembers > 1 ? "s" : ""}`,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {summaryCards.map((item) => (
        <Card key={item.title} className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="grid size-7 place-items-center rounded-lg border bg-muted">
                  <item.icon className="size-4" />
                </div>
                {item.title}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-2xl leading-none tracking-tight">
                {item.value}
              </div>
              <p className="text-muted-foreground tabular-nums text-sm leading-none">
                {item.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
