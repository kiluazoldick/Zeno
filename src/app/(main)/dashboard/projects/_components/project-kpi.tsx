"use client";

import { ArrowUpRight } from "lucide-react";

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
  // Calcul des KPI à partir des données réelles UNIQUEMENT
  const actifs = projects.filter((p) => p.statut === "En cours").length;
  const termines = projects.filter((p) => p.statut === "Terminé").length;
  const enAttente = projects.filter((p) => p.statut === "En attente").length;
  const annules = projects.filter((p) => p.statut === "Annulé").length;

  // Budget des projets en cours
  const budgetActif = projects
    .filter((p) => p.statut === "En cours")
    .reduce((sum, p) => sum + (p.budget_total || 0), 0);

  function formatFCFA(value: number) {
    return new Intl.NumberFormat("fr-FR").format(value);
  }

  const kpiData = [
    {
      label: "Projets actifs",
      value: actifs,
      description: `${actifs} projet${actifs > 1 ? "s" : ""} en cours`,
    },
    {
      label: "Projets terminés",
      value: termines,
      description: `${termines} projet${termines > 1 ? "s" : ""} terminé${termines > 1 ? "s" : ""}`,
    },
    {
      label: "Budget engagé",
      value: formatFCFA(budgetActif),
      description: "FCFA sur les projets en cours",
    },
    {
      label: "En attente",
      value: enAttente,
      description: `${enAttente} projet${enAttente > 1 ? "s" : ""} en attente`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpiData.map((kpi) => (
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
              {kpi.label === "Budget engagé" && (
                <span className="text-sm text-muted-foreground">FCFA</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
