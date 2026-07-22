"use client";

import { useProjects } from "@/hooks/queries/use-projects";
import { useTasks } from "@/hooks/queries/use-tasks";
import { useMembers } from "@/hooks/queries/use-members";

import { CalendarPanel } from "./_components/calendar-panel";
import { FocusCard } from "./_components/focus-card";
import { ProjectsSection } from "./_components/projects-section";
import { QuickActions } from "./_components/quick-actions";
import { QuoteCard } from "./_components/quote-card";
import { RecentNotesCard } from "./_components/recent-notes-card";
import { SummaryCards } from "./_components/summary-cards";
import { TasksSection } from "./_components/tasks-section";
import { WeeklySummaryCard } from "./_components/weekly-summary-card";

export default function Page() {
  // Récupérer les données réelles
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks({
    includeAssignee: true,
    includeProject: true,
  });
  const { data: members, isLoading: membersLoading } = useMembers();

  // Filtrer les tâches du jour
  const todayTasks =
    tasks?.filter((task: any) => {
      // Si pas de date, on laisse passer
      if (!task.date_execution) return true;
      const taskDate = new Date(task.date_execution);
      const today = new Date();
      return taskDate.toDateString() === today.toDateString();
    }) || [];

  const isLoading = projectsLoading || tasksLoading || membersLoading;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-9">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl text-foreground leading-none tracking-tight">
              Bonjour, Équipe Zoldick
            </h1>
            <p className="text-lg text-muted-foreground leading-none">
              Ensemble, construisons des projets d'exception.
            </p>
          </div>
          <SummaryCards tasks={tasks} members={members} />
          <TasksSection tasks={todayTasks} isLoading={isLoading} />
          <ProjectsSection projects={projects} isLoading={isLoading} />
          <QuickActions />
          <QuoteCard />
        </div>
      </section>

      <section className="flex flex-col gap-6 lg:col-span-3">
        <CalendarPanel />
        <FocusCard />
        <RecentNotesCard />
        <WeeklySummaryCard tasks={tasks} />
      </section>
    </div>
  );
}
