"use client";

import { ArrowUpRight, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { Project } from "@/types/database";

interface ProjectKpiProps {
  projects: Project[];
}

export function ProjectKpi({ projects }: ProjectKpiProps) {
  // Calcul des KPI
  const total = projects.length;
  const actifs = projects.filter((p) => p.statut === "En cours").length;
  const termines = projects.filter((p) => p.statut === "Terminé").length;
  const enAttente = projects.filter((p) => p.statut === "En attente").length;

  // Budget total
  const budgetTotal = projects.reduce(
    (sum, p) => sum + (p.budget_total || 0),
    0,
  );

  // Budget des projets en cours
  const budgetActif = projects
    .filter((p) => p.statut === "En cours")
    .reduce((sum, p) => sum + (p.budget_total || 0), 0);

  const kpiData = [
    {
      label: "Projets actifs",
      value: actifs,
      change: "+2",
      trend: "up" as const,
      previous: "4",
      description: "En cours",
      icon: TrendingUp,
    },
    {
      label: "Projets terminés",
      value: termines,
      change: "+3",
      trend: "up" as const,
      previous: "9",
      description: "Derniers 6 mois",
      icon: TrendingUp,
    },
    {
      label: "Budget engagé",
      value: formatFCFA(budgetActif),
      change: "+8.5%",
      trend: "up" as const,
      previous: formatFCFA(budgetTotal * 0.7),
      description: "FCFA en cours",
      icon: TrendingUp,
    },
    {
      label: "En attente",
      value: enAttente,
      change: "-1",
      trend: "down" as const,
      previous: "3",
      description: "À démarrer",
      icon: TrendingDown,
    },
  ];

  function formatFCFA(value: number) {
    return new Intl.NumberFormat("fr-FR").format(value);
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;
        const isUp = kpi.trend === "up";

        return (
          <Card key={kpi.label}>
            <CardHeader>
              <CardDescription>{kpi.label}</CardDescription>
              <CardAction>
                <ArrowUpRight className="size-4" />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none tracking-tight">
                  {kpi.value}
                </span>
                <Badge
                  variant="outline"
                  className={
                    isUp
                      ? "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
                      : "border-destructive/20 bg-destructive/10 text-destructive"
                  }
                >
                  {isUp ? <TrendingUp /> : <TrendingDown />}
                  {kpi.change}
                </Badge>
              </div>
              <p className="text-sm">
                <span className="font-medium text-foreground">
                  {kpi.previous}
                </span>{" "}
                <span className="text-muted-foreground">{kpi.description}</span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
