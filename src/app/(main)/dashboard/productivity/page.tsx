"use client";

import { useProjects } from "@/hooks/queries/use-projects";
import { useTasks } from "@/hooks/queries/use-tasks";
import { useMembers } from "@/hooks/queries/use-members";
import { useDashboardKPI } from "@/hooks/queries/use-dashboard";

import { ProjectsSection } from "./_components/projects-section";
import { SummaryCards } from "./_components/summary-cards";
import { TasksSection } from "./_components/tasks-section";
import { FocusCard } from "./_components/focus-card";

export default function Page() {
  // Récupérer les données réelles
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks({
    includeAssignee: true,
    includeProject: true,
  });
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: kpi, isLoading: kpiLoading } = useDashboardKPI();

  // Filtrer les tâches du jour
  const todayTasks =
    tasks?.filter((task: any) => {
      if (!task.date_execution) return false;
      const taskDate = new Date(task.date_execution);
      const today = new Date();
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    }) || [];

  const isLoading =
    projectsLoading || tasksLoading || membersLoading || kpiLoading;

  // Construire les stats à partir des KPI
  const stats = kpi
    ? {
        total_projects: kpi.projects?.total || 0,
        total_tasks: kpi.tasks?.total || 0,
        completed_tasks: kpi.tasks?.completed || 0,
        total_members: kpi.members?.total || 0,
        active_projects: kpi.projects?.active || 0,
      }
    : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-9">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl text-foreground leading-none tracking-tight">
              Vue d'ensemble
            </h1>
            <p className="text-lg text-muted-foreground leading-none">
              Suivez l'avancement de vos projets et tâches
            </p>
          </div>

          <SummaryCards
            tasks={tasks}
            projects={projects}
            members={members}
            stats={stats}
            isLoading={isLoading}
          />

          <TasksSection tasks={todayTasks} isLoading={isLoading} />

          <ProjectsSection projects={projects} isLoading={isLoading} />
        </div>
      </section>

      <section className="flex flex-col gap-6 lg:col-span-3">
        <FocusCard />
      </section>
    </div>
  );
}
