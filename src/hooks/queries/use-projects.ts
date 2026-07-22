import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectsWithProgress,
  type GetProjectsFilters,
} from "@/lib/actions/projects";
import { toast } from "sonner";

// Clés de cache
export const projectsKeys = {
  all: ["projects"] as const,
  lists: () => [...projectsKeys.all, "list"] as const,
  list: (filters?: GetProjectsFilters) =>
    [...projectsKeys.lists(), filters] as const,
  progress: () => [...projectsKeys.all, "progress"] as const,
  details: () => [...projectsKeys.all, "detail"] as const,
  detail: (id: string) => [...projectsKeys.details(), id] as const,
};

// Hook pour récupérer tous les projets
export function useProjects(filters?: GetProjectsFilters) {
  return useQuery({
    queryKey: projectsKeys.list(filters),
    queryFn: () => getProjects(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook pour récupérer les projets avec progression
export function useProjectsWithProgress() {
  return useQuery({
    queryKey: projectsKeys.progress(),
    queryFn: () => getProjectsWithProgress(),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook pour récupérer un projet spécifique
export function useProject(id: string) {
  return useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation pour créer un projet
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectsKeys.progress() });
      toast.success("Projet créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour un projet
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateProject>[1];
    }) => updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectsKeys.progress() });
      queryClient.invalidateQueries({ queryKey: projectsKeys.detail(id) });
      toast.success("Projet mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour supprimer un projet
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cascade }: { id: string; cascade?: boolean }) =>
      deleteProject(id, cascade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectsKeys.progress() });
      toast.success("Projet supprimé");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
