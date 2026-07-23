"use client";

import {
  useStats,
  useChartData,
  useProductivity,
} from "@/hooks/queries/use-dashboard";
import { useProjects } from "@/hooks/queries/use-projects";
import { useTasks } from "@/hooks/queries/use-tasks";
import { useMembers } from "@/hooks/queries/use-members";
import { useTransactions } from "@/hooks/queries/use-transactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { StatsKpiStrip } from "./_components/stats-kpi-strip";
import { StatsToolbar } from "./_components/stats-toolbar";
import { RevenueChart } from "./_components/revenue-chart";
import { ProjectsDistribution } from "./_components/projects-distribution";
import { ProductivityMembers } from "./_components/productivity-members";
import { BudgetVsActual } from "./_components/budget-vs-actual";
import { TasksStatus } from "./_components/tasks-status";
import { FinancialOverview } from "./_components/financial-overview";

import "@/styles/flag-icons/flags.css";

export default function Page() {
  // Récupérer les données réelles
  const { data: statsData, isLoading: statsLoading } = useStats();
  const { data: chartData, isLoading: chartLoading } = useChartData();
  const { data: productivityData, isLoading: productivityLoading } =
    useProductivity();
  const { data: projectsData, isLoading: projectsLoading } = useProjects({
    includeClient: true,
  });
  const { data: tasksData, isLoading: tasksLoading } = useTasks({
    includeAssignee: true,
    includeProject: true,
  });
  const { data: membersData, isLoading: membersLoading } = useMembers();
  const { data: transactionsData, isLoading: transactionsLoading } =
    useTransactions();

  const isLoading =
    statsLoading ||
    chartLoading ||
    productivityLoading ||
    projectsLoading ||
    tasksLoading ||
    membersLoading ||
    transactionsLoading;

  // Transformer les données pour chaque composant
  const projectsDistribution =
    projectsData?.reduce((acc: any[], project) => {
      const statut = project.statut || "En attente";
      const existing = acc.find((p) => p.statut === statut);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ statut, count: 1 });
      }
      return acc;
    }, []) || [];

  const tasksByStatus =
    tasksData?.reduce((acc: any[], task) => {
      const statut = task.statut || "À faire";
      const existing = acc.find((p) => p.statut === statut);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ statut, count: 1 });
      }
      return acc;
    }, []) || [];

  // Calculer la productivité par membre à partir des tâches
  const memberProductivity =
    membersData?.map((member: any) => {
      const memberTasks =
        tasksData?.filter((task: any) => task.assigne_a === member.id) || [];
      const totalTaches = memberTasks.length;
      const tachesTerminees = memberTasks.filter(
        (task: any) => task.statut === "Terminé",
      ).length;

      let taux = 0;
      if (totalTaches > 0) {
        taux = Math.round((tachesTerminees / totalTaches) * 100);
      }

      return {
        id: member.id,
        nom: member.nom,
        prenom: member.prenom,
        role: member.role,
        taux_productivite: taux,
        total_taches: totalTaches,
        taches_terminees: tachesTerminees,
      };
    }) || [];

  // Données pour les KPI
  const kpiData = {
    caMois:
      statsData?.finances?.reduce(
        (sum: number, item: any) => sum + item.entrees,
        0,
      ) || 0,
    projetsActifs:
      projectsData?.filter((p: any) => p.statut === "En cours").length || 0,
    tachesEnCours:
      tasksData?.filter((t: any) => t.statut === "En cours").length || 0,
    tachesTerminees:
      tasksData?.filter((t: any) => t.statut === "Terminé").length || 0,
    devisEnvoyes: 0, // À implémenter avec les devis
    devisAcceptes: 0, // À implémenter avec les devis
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Statistiques</h1>
        <p className="text-muted-foreground text-sm">
          Analyse complète des performances de Zoldick Entreprise
        </p>
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
          <StatsKpiStrip data={kpiData} isLoading={isLoading} />

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <RevenueChart data={statsData?.finances} isLoading={isLoading} />
            </div>
            <div className="xl:col-span-5">
              <ProjectsDistribution
                data={projectsDistribution}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <ProductivityMembers
                data={memberProductivity}
                isLoading={isLoading}
              />
            </div>
            <div className="xl:col-span-7">
              <BudgetVsActual
                data={statsData?.finances}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <TasksStatus data={tasksByStatus} isLoading={isLoading} />
            </div>
            <div className="xl:col-span-6">
              <FinancialOverview
                data={transactionsData}
                isLoading={isLoading}
              />
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
