"use client";

import { ArrowUpRight } from "lucide-react";

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
  // Total des clients
  const totalClients = clients.length;

  // Clients avec projets
  const clientsWithProjects = clients.filter(
    (c) => c.projects && c.projects.length > 0,
  );

  // Nombre total de projets (tous clients confondus)
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

  const formatFCFA = (value: number) => {
    return new Intl.NumberFormat("fr-FR").format(value);
  };

  const kpiData = [
    {
      label: "Total clients",
      value: totalClients,
      description: `${totalClients} client${totalClients > 1 ? "s" : ""} enregistré${totalClients > 1 ? "s" : ""}`,
    },
    {
      label: "Projets clients",
      value: totalProjects,
      description: `${totalProjects} projet${totalProjects > 1 ? "s" : ""} en cours`,
    },
    {
      label: "Budget engagé",
      value: formatFCFA(totalBudget),
      description: "FCFA sur tous les projets",
    },
    {
      label: "Clients actifs",
      value: clientsWithProjects.length,
      description: `${clientsWithProjects.length} client${clientsWithProjects.length > 1 ? "s" : ""} avec projet${clientsWithProjects.length > 1 ? "s" : ""}`,
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
