import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPosition,
  getTasksByStatus,
  getTasksByProject,
  getTasksByMember,
  type GetTasksFilters,
} from "@/lib/actions/tasks";
import { toast } from "sonner";

// Clés de cache
export const tasksKeys = {
  all: ["tasks"] as const,
  lists: () => [...tasksKeys.all, "list"] as const,
  list: (filters?: GetTasksFilters) => [...tasksKeys.lists(), filters] as const,
  byStatus: () => [...tasksKeys.all, "by-status"] as const,
  byProject: (projectId: string) =>
    [...tasksKeys.all, "by-project", projectId] as const,
  byMember: (memberId: string) =>
    [...tasksKeys.all, "by-member", memberId] as const,
  details: () => [...tasksKeys.all, "detail"] as const,
  detail: (id: string) => [...tasksKeys.details(), id] as const,
};

// Hook pour récupérer toutes les tâches
export function useTasks(filters?: GetTasksFilters) {
  return useQuery({
    queryKey: tasksKeys.list(filters),
    queryFn: () => getTasks(filters),
    staleTime: 30 * 1000, // 30 secondes (Kanban nécessite plus de fraîcheur)
  });
}

// Hook pour récupérer les tâches par statut (pour le Kanban)
export function useTasksByStatus() {
  return useQuery({
    queryKey: tasksKeys.byStatus(),
    queryFn: () => getTasksByStatus(),
    staleTime: 30 * 1000,
  });
}

// Hook pour récupérer les tâches d'un projet
export function useTasksByProject(projectId: string) {
  return useQuery({
    queryKey: tasksKeys.byProject(projectId),
    queryFn: () => getTasksByProject(projectId),
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
}

// Hook pour récupérer les tâches d'un membre
export function useTasksByMember(memberId: string) {
  return useQuery({
    queryKey: tasksKeys.byMember(memberId),
    queryFn: () => getTasksByMember(memberId),
    enabled: !!memberId,
    staleTime: 30 * 1000,
  });
}

// Hook pour récupérer une tâche spécifique
export function useTask(id: string) {
  return useQuery({
    queryKey: tasksKeys.detail(id),
    queryFn: () => getTask(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

// Mutation pour créer une tâche
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tasksKeys.byStatus() });
      toast.success("Tâche créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour une tâche
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateTask>[1];
    }) => updateTask(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tasksKeys.byStatus() });
      queryClient.invalidateQueries({ queryKey: tasksKeys.detail(id) });
      toast.success("Tâche mise à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour le statut d'une tâche (Drag & Drop)
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      statut,
      options,
    }: {
      id: string;
      statut: Parameters<typeof updateTaskStatus>[1];
      options?: Parameters<typeof updateTaskStatus>[2];
    }) => updateTaskStatus(id, statut, options),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tasksKeys.byStatus() });
      queryClient.invalidateQueries({ queryKey: tasksKeys.detail(id) });
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors du déplacement: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour la position (Drag & Drop fin)
export function useUpdateTaskPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      newPosition,
      columnId,
    }: Parameters<typeof updateTaskPosition>[0] &
      Parameters<typeof updateTaskPosition>[1] &
      Parameters<typeof updateTaskPosition>[2]) =>
      updateTaskPosition(taskId, newPosition, columnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tasksKeys.byStatus() });
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors du repositionnement: ${error.message}`);
    },
  });
}

// Mutation pour supprimer une tâche
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tasksKeys.byStatus() });
      toast.success("Tâche supprimée");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
