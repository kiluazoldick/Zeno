import { MetricCards } from "./_components/metric-cards";
import { PerformanceOverview } from "./_components/performance-overview";
import { SubscriberOverview } from "./_components/subscriber-overview";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground text-sm">Vue d'ensemble de l'activité Zoldick Entreprise</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-zeno-primary/10 px-3 py-1 text-xs font-medium text-zeno-primary">
            Mise à jour en temps réel
          </span>
        </div>
      </div>
      <MetricCards />
      <PerformanceOverview />
      <SubscriberOverview />
    </div>
  );
}
