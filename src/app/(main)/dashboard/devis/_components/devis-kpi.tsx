// src/app/(main)/dashboard/devis/_components/devis-kpi.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Wallet, Clock, TrendingUp } from "lucide-react";

interface DevisKpiProps {
  devis: any[];
}

export function DevisKpi({ devis }: DevisKpiProps) {
  if (!devis || devis.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chargement...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalDevis = devis.length;
  const montantTotal = devis.reduce(
    (sum, d) => sum + (d.montant_total || 0),
    0,
  );
  const enAttente = devis.filter(
    (d) => d.statut === "Brouillon" || d.statut === "Envoyé",
  ).length;
  const acceptes = devis.filter((d) => d.statut === "Accepté").length;
  const tauxConversion =
    totalDevis > 0 ? Math.round((acceptes / totalDevis) * 100) : 0;

  const kpis = [
    {
      title: "Total devis",
      value: totalDevis,
      description: "Tous statuts confondus",
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Montant total",
      value: new Intl.NumberFormat("fr-FR").format(montantTotal),
      description: "FCFA",
      icon: Wallet,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "En attente",
      value: enAttente,
      description: "Brouillon + Envoyé",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      title: "Taux de conversion",
      value: `${tauxConversion}%`,
      description: "Devis → Contrats",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={cn("rounded-lg p-2", kpi.bg)}>
                <Icon className={cn("size-4", kpi.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Ajouter cn import
import { cn } from "@/lib/utils";
