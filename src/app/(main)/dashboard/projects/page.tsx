"use client";

import { useState } from "react";
import {
  useProjects,
  useProjectsWithProgress,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/queries/use-projects";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { ProjectKpi } from "./_components/project-kpi";
import { ProjectList } from "./_components/project-list";
import { ProjectStatusChart } from "./_components/project-status-chart";
import { ProjectProgress } from "./_components/project-progress";
import { ProjectDialog } from "./_components/project-dialog";

export default function Page() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
    refetch,
  } = useProjects({
    includeClient: true,
  });

  const { data: progressData, isLoading: progressLoading } =
    useProjectsWithProgress();

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const isLoading = projectsLoading || progressLoading;

  const handleAddProject = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Projet supprimé avec succès");
          refetch();
        },
        onError: (error: any) => {
          toast.error(
            "Erreur: " + (error.message || "Une erreur est survenue"),
          );
        },
      },
    );
  };

  const handleSaveProject = (data: any) => {
    if (editingProject) {
      updateProject.mutate(
        { id: editingProject.id, data },
        {
          onSuccess: () => {
            toast.success("Projet modifié avec succès");
            setDialogOpen(false);
            refetch();
          },
          onError: (error: any) => {
            toast.error(
              "Erreur: " + (error.message || "Une erreur est survenue"),
            );
          },
        },
      );
    } else {
      createProject.mutate(data, {
        onSuccess: () => {
          toast.success("Projet créé avec succès");
          setDialogOpen(false);
          refetch();
        },
        onError: (error: any) => {
          toast.error(
            "Erreur: " + (error.message || "Une erreur est survenue"),
          );
        },
      });
    }
  };

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

      <ProjectList
        projects={projects || []}
        isLoading={projectsLoading}
        onAdd={handleAddProject}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
        onSave={handleSaveProject}
        isEditing={!!editingProject}
      />
    </div>
  );
}
