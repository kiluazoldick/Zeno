"use client";

import { useProjects } from "@/hooks/queries/use-projects";
import { useTasks } from "@/hooks/queries/use-tasks";
import { useMembers } from "@/hooks/queries/use-members";
import { useDashboardKPI } from "@/hooks/queries/use-dashboard";

import { ProjectsSection } from "./_components/projects-section";
import { SummaryCards } from "./_components/summary-cards";
import { TasksSection } from "./_components/tasks-section";
import { FocusCard } from "./_components/focus-card";

type Task = {
  id: string;
  titre: string;
  description: string | null;
  statut: string;
  assigne: { nom: string } | null;
  date_execution: string | null;
  lieu: string | null;
  projet: { nom: string } | null;
  priorite: string;
};

export default function Page() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks({
    includeAssignee: true,
    includeProject: true,
  });
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: kpi, isLoading: kpiLoading } = useDashboardKPI();

  const isLoading =
    projectsLoading || tasksLoading || membersLoading || kpiLoading;

  // Safe conversion: Array.isArray + unknown intermediate
  const safeTasks: Task[] = Array.isArray(tasks)
    ? (tasks as unknown as Task[])
    : [];

  const stats = kpi
    ? {
        total_projects: projects?.length || 0,
        total_tasks: kpi.details.tasks.total,
        completed_tasks: kpi.tachesTerminees,
        total_members: members?.length || 0,
        active_projects: kpi.projetsActifs,
      }
    : undefined;

    const safeProjects = projects?.map((project) => ({
  id: project.id,
  nom: project.nom,
  client_id: project.client_id,
  description: project.description,
  statut: project.statut ?? "À faire",
  progression: project.progression ?? 0,
  date_fin: project.date_fin,
  location: project.location,
}));

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
            tasks={safeTasks}
            projects={projects}
            members={members}
            stats={stats}
            isLoading={isLoading}
          />

          <TasksSection tasks={safeTasks} isLoading={isLoading} />

          <ProjectsSection projects={safeProjects} isLoading={isLoading} />
        </div>
      </section>

      <section className="flex flex-col gap-6 lg:col-span-3">
        <FocusCard />
      </section>
    </div>
  );
}