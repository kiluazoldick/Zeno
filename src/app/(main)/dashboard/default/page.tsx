"use client";

import { MetricCards } from "./_components/metric-cards";
import { PerformanceOverview } from "./_components/performance-overview";
import { SubscriberOverview } from "./_components/subscriber-overview";
import { useDashboardKPI, useChartData } from "@/hooks/queries/use-dashboard";

export default function Page() {
  const {
    data: kpiData,
    isLoading: kpiLoading,
    error: kpiError,
  } = useDashboardKPI("month");
  // Le graphique utilise maintenant des données mockées en fallback
  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError,
  } = useChartData();

  // Log des erreurs pour débogage
  if (kpiError) console.error("KPI Error:", kpiError);
  if (chartError) console.error("Chart Error:", chartError);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground text-sm">
            Vue d'ensemble de l'activité Zoldick Entreprise
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-zeno-primary/10 px-3 py-1 text-xs font-medium text-zeno-primary">
            Mise à jour en temps réel
          </span>
        </div>
      </div>

      <MetricCards data={kpiData} isLoading={kpiLoading} error={kpiError} />
      {/* Passer les données mockées au graphique si nécessaire */}
      <PerformanceOverview data={chartData} isLoading={chartLoading} />
      <SubscriberOverview />
    </div>
  );
}
