import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BudgetVsActual } from "./_components/budget-vs-actual";
import { FinancialOverview } from "./_components/financial-overview";
import { ProductivityMembers } from "./_components/productivity-members";
import { ProjectsDistribution } from "./_components/projects-distribution";
import { RevenueChart } from "./_components/revenue-chart";
import { StatsKpiStrip } from "./_components/stats-kpi-strip";
import { StatsToolbar } from "./_components/stats-toolbar";
import { TasksStatus } from "./_components/tasks-status";

import "@/styles/flag-icons/flags.css";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Statistiques</h1>
        <p className="text-muted-foreground text-sm">Analyse complète des performances de Zoldick Entreprise</p>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="gap-1">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="finance">Finances</TabsTrigger>
            <TabsTrigger value="productivity">Productivité</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="team">Équipe</TabsTrigger>
          </TabsList>

          <StatsToolbar />
        </div>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <StatsKpiStrip />

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <RevenueChart />
            </div>
            <div className="xl:col-span-5">
              <ProjectsDistribution />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <ProductivityMembers />
            </div>
            <div className="xl:col-span-7">
              <BudgetVsActual />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <TasksStatus />
            </div>
            <div className="xl:col-span-6">
              <FinancialOverview />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="finance">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Analyse financière détaillée - Bientôt disponible
          </div>
        </TabsContent>

        <TabsContent value="productivity">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Analyse de productivité - Bientôt disponible
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Analyse des projets - Bientôt disponible
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Analyse de l'équipe - Bientôt disponible
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
