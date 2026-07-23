"use client";

import { ArrowDownRight, ArrowUpRight, Ellipsis, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatsKpiStripProps {
  data?: {
    caMois: number;
    projetsActifs: number;
    tachesEnCours: number;
    tachesTerminees: number;
    devisEnvoyes: number;
    devisAcceptes: number;
  };
  isLoading?: boolean;
}

export function StatsKpiStrip({ data, isLoading }: StatsKpiStripProps) {
  // Formater les nombres
  const formatFCFA = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)} k`;
    }
    return value.toString();
  };

  // Calculer les variations (simulées pour l'instant)
  const getChange = (value: number, previous?: number) => {
    if (!previous || previous === 0)
      return { change: "+0%", trend: "up" as const };
    const diff = ((value - previous) / previous) * 100;
    return {
      change: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`,
      trend: diff >= 0 ? ("up" as const) : ("down" as const),
    };
  };

  // Valeurs par défaut
  const defaultData = {
    caMois: 0,
    projetsActifs: 0,
    tachesEnCours: 0,
    tachesTerminees: 0,
    devisEnvoyes: 0,
    devisAcceptes: 0,
  };

  const metrics = data || defaultData;

  const kpiData = [
    {
      id: "revenue",
      title: "Chiffre d'affaires",
      value: formatFCFA(metrics.caMois),
      unit: "FCFA",
      change: getChange(metrics.caMois, metrics.caMois * 0.8),
      period: "ce mois-ci",
    },
    {
      id: "projects",
      title: "Projets actifs",
      value: metrics.projetsActifs.toString(),
      unit: "",
      change: getChange(metrics.projetsActifs, metrics.projetsActifs * 0.7),
      period: "en cours",
    },
    {
      id: "tasks",
      title: "Tâches en cours",
      value: metrics.tachesEnCours.toString(),
      unit: "",
      change: getChange(metrics.tachesEnCours, metrics.tachesEnCours * 0.8),
      period: "à réaliser",
    },
    {
      id: "completed-tasks",
      title: "Tâches terminées",
      value: metrics.tachesTerminees.toString(),
      unit: "",
      change: getChange(metrics.tachesTerminees, metrics.tachesTerminees * 0.8),
      period: "ce mois-ci",
    },
    {
      id: "devis-sent",
      title: "Devis envoyés",
      value: metrics.devisEnvoyes.toString(),
      unit: "",
      change: getChange(metrics.devisEnvoyes, metrics.devisEnvoyes * 0.8),
      period: "en attente",
    },
    {
      id: "devis-accepted",
      title: "Devis acceptés",
      value: metrics.devisAcceptes.toString(),
      unit: "",
      change: getChange(metrics.devisAcceptes, metrics.devisAcceptes * 0.8),
      period: "taux: 65%",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl bg-card">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
      <div className="grid divide-y *:data-[slot=card]:rounded-none *:data-[slot=card]:ring-0 md:grid-cols-3 md:divide-x md:divide-y-0 xl:grid-cols-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.id}>
            <CardHeader>
              <CardTitle className="font-normal text-sm">{kpi.title}</CardTitle>
              <CardAction>
                <Ellipsis className="size-4" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl leading-none tracking-tight">
                    {kpi.value}
                  </span>
                  {kpi.unit && (
                    <span className="text-sm text-muted-foreground">
                      {kpi.unit}
                    </span>
                  )}
                </div>
                <Badge
                  className={
                    kpi.change.trend === "up"
                      ? "bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                      : "bg-destructive/10 text-destructive"
                  }
                >
                  {kpi.change.trend === "up" ? (
                    <ArrowUpRight />
                  ) : (
                    <ArrowDownRight />
                  )}
                  {kpi.change.change}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <span>{kpi.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
