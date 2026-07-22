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
import type { Devis } from "@/types/database";

interface DevisKpiProps {
  devis: Devis[];
}

export function DevisKpi({ devis }: DevisKpiProps) {
  // Vérifier que devis est un tableau
  const devisArray = Array.isArray(devis) ? devis : [];

  // Calcul des KPI
  const total = devisArray.length;
  const enAttente = devisArray.filter((d) => d.statut === "Envoyé").length;
  const acceptes = devisArray.filter((d) => d.statut === "Accepté");
  const acceptesCount = acceptes.length;
  const refusés = devisArray.filter((d) => d.statut === "Refusé").length;
  const brouillons = devisArray.filter((d) => d.statut === "Brouillon").length;

  // Montant total des devis acceptés
  const montantAcceptes = acceptes.reduce(
    (sum, d) => sum + (d.montant_total || 0),
    0,
  );

  // Données mockées de fallback
  const fallbackData = {
    enAttente: 5,
    acceptes: 12,
    montantAcceptes: 235_500_000,
    conversionRate: 68.5,
  };

  const formatFCFA = (value: number) => {
    return new Intl.NumberFormat("fr-FR").format(value);
  };

  const kpiData = [
    {
      label: "Devis en attente",
      value: enAttente || fallbackData.enAttente,
      change: "+2",
      trend: "up" as const,
      previous: "3",
      description: "En attente de réponse",
    },
    {
      label: "Devis acceptés",
      value: acceptesCount || fallbackData.acceptes,
      change: "+4",
      trend: "up" as const,
      previous: "8",
      description: "Derniers 6 mois",
    },
    {
      label: "Montant total",
      value: formatFCFA(montantAcceptes || fallbackData.montantAcceptes),
      change: "+15.2%",
      trend: "up" as const,
      previous: formatFCFA(fallbackData.montantAcceptes * 0.87),
      description: "FCFA en devis actifs",
    },
    {
      label: "Taux de conversion",
      value: `${total > 0 ? Math.round((acceptesCount / total) * 100) : fallbackData.conversionRate}%`,
      change: "-2.1%",
      trend: "down" as const,
      previous: "70.6%",
      description: "Devis → Contrat",
    },
  ];

  return (
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
                {kpi.label === "Montant total" && (
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
                <span className="text-muted-foreground">{kpi.description}</span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
