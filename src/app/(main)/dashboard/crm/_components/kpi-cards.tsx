"use client";

import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { Client } from "@/types/database";

interface KpiCardsProps {
  clients: Client[];
}

export function KpiCards({ clients }: KpiCardsProps) {
  // Calcul des KPI
  const totalClients = clients.length;

  // Clients avec projets
  const clientsWithProjects = clients.filter(
    (c) => c.projects && c.projects.length > 0,
  );

  // Nombre total de projets
  const totalProjects = clients.reduce(
    (sum, c) => sum + (c.projects?.length || 0),
    0,
  );

  // Montant total des projets
  const totalBudget = clients.reduce((sum, c) => {
    const projectBudget =
      c.projects?.reduce((s, p) => s + (p.budget_total || 0), 0) || 0;
    return sum + projectBudget;
  }, 0);

  // Données mockées de fallback
  const fallbackData = {
    pipelineValue: "284 500 000",
    qualifiedRate: "28.4%",
    openOpportunities: "42",
    conversionRate: "18.1%",
  };

  const formatFCFA = (value: number) => {
    return new Intl.NumberFormat("fr-FR").format(value);
  };

  const kpiData = [
    {
      label: "Total clients",
      value: totalClients || 12,
      change: "+2",
      trend: "up" as const,
      previous: "10",
      description: "Clients actifs",
    },
    {
      label: "Projets clients",
      value: totalProjects || 8,
      change: "+3",
      trend: "up" as const,
      previous: "5",
      description: "Projets en cours",
    },
    {
      label: "Budget engagé",
      value: formatFCFA(totalBudget || 250_000_000),
      change: "+12%",
      trend: "up" as const,
      previous: "223 000 000",
      description: "FCFA total",
    },
    {
      label: "Taux conversion",
      value: "18.1%",
      change: "+1.6%",
      trend: "up" as const,
      previous: "16.5%",
      description: "Lead → Deal",
    },
  ];

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-3xl tracking-tight">Portefeuille clients</h2>
        <p className="text-muted-foreground text-sm">
          Suivez la qualité des leads, les opportunités ouvertes et les taux de
          conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiData.map((kpi) => {
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
                  {kpi.label === "Budget engagé" && (
                    <span className="text-sm text-muted-foreground">FCFA</span>
                  )}
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
                  <span className="text-muted-foreground">
                    {kpi.description}
                  </span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
