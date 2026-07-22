"use client";

import {
  Banknote,
  FolderKanban,
  CheckSquare,
  FileText,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardsProps {
  data?: {
    projetsActifs: number;
    tachesAFaire: number;
    caMois: number;
    devisEnvoyes: number;
    beneficeMois: number;
    tachesEnCours: number;
  };
  isLoading: boolean;
  error?: Error | null;
}

export function MetricCards({ data, isLoading, error }: MetricCardsProps) {
  // Données par défaut (loading)
  const defaultData = {
    projetsActifs: 0,
    tachesAFaire: 0,
    caMois: 0,
    devisEnvoyes: 0,
    beneficeMois: 0,
    tachesEnCours: 0,
  };

  const metrics = data || defaultData;

  const metricItems = [
    {
      id: "revenue",
      title: "Chiffre d'affaires",
      value: metrics.caMois || 0,
      currency: "FCFA",
      change: "+12.5%",
      trend: "up" as const,
      icon: Banknote,
      description: "Ce mois-ci",
    },
    {
      id: "projects",
      title: "Projets en cours",
      value: metrics.projetsActifs || 0,
      change: "+2",
      trend: "up" as const,
      icon: FolderKanban,
      description: "Actifs",
    },
    {
      id: "tasks",
      title: "Tâches en cours",
      value: metrics.tachesEnCours || 0,
      change: "+5",
      trend: "up" as const,
      icon: CheckSquare,
      description: "À réaliser",
    },
    {
      id: "quotes",
      title: "Devis en attente",
      value: metrics.devisEnvoyes || 0,
      change: "-1",
      trend: "down" as const,
      icon: FileText,
      description: "À traiter",
    },
  ];

  // Formatage des montants en FCFA
  const formatFCFA = (value: number) => {
    return new Intl.NumberFormat("fr-FR").format(value);
  };

  if (error) {
    return (
      <div className="col-span-full rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4" />
          <span>Erreur lors du chargement des données: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {isLoading
        ? // Squelette de chargement
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))
        : metricItems.map((metric) => {
            const Icon = metric.icon;
            const isUp = metric.trend === "up";

            return (
              <Card
                key={metric.id}
                className="border-l-4 border-l-zeno-primary"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>
                    <div className="flex size-8 items-center justify-center rounded-lg bg-zeno-primary/10 text-zeno-primary">
                      <Icon className="size-4" />
                    </div>
                  </CardTitle>
                  <Badge
                    variant={isUp ? "default" : "destructive"}
                    className={
                      isUp
                        ? "bg-zeno-primary/10 text-zeno-primary hover:bg-zeno-primary/20"
                        : ""
                    }
                  >
                    {isUp ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {metric.change}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1">
                      <span className="font-medium text-2xl leading-none tracking-tight">
                        {metric.currency
                          ? formatFCFA(metric.value)
                          : metric.value}
                      </span>
                      {metric.currency && (
                        <span className="text-xs font-medium text-muted-foreground">
                          {metric.currency}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {metric.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
    </div>
  );
}
