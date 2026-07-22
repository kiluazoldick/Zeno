"use client";

import {
  useProjects,
  useProjectsWithProgress,
} from "@/hooks/queries/use-projects";
import { Loader2, AlertCircle } from "lucide-react";

import { ProjectKpi } from "./_components/project-kpi";
import { ProjectList } from "./_components/project-list";
import { ProjectStatusChart } from "./_components/project-status-chart";
import { ProjectProgress } from "./_components/project-progress";

export default function Page() {
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjects({
    includeClient: true,
  });

  const { data: progressData, isLoading: progressLoading } =
    useProjectsWithProgress();

  const isLoading = projectsLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span>
            Erreur lors du chargement des projets: {projectsError.message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="space-y-1">
        <h2 className="text-3xl tracking-tight">Projets</h2>
        <p className="text-muted-foreground text-sm">
          Gérez l'ensemble des projets de Zoldick Entreprise
        </p>
      </div>

      <ProjectKpi projects={projects || []} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ProjectProgress
            data={progressData || []}
            isLoading={progressLoading}
          />
        </div>
        <div className="xl:col-span-5">
          <ProjectStatusChart projects={projects || []} />
        </div>
      </div>

      <ProjectList projects={projects || []} isLoading={projectsLoading} />
    </div>
  );
}
