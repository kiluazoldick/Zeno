import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  updateReportStatus,
  getReportsByProject,
  getReportsByMember,
  getValidatedReports,
  type GetReportsFilters,
} from "@/lib/actions/reports";
import { toast } from "sonner";

// Clés de cache
export const reportsKeys = {
  all: ["reports"] as const,
  lists: () => [...reportsKeys.all, "list"] as const,
  list: (filters?: GetReportsFilters) =>
    [...reportsKeys.lists(), filters] as const,
  validated: () => [...reportsKeys.all, "validated"] as const,
  byProject: (projectId: string) =>
    [...reportsKeys.all, "by-project", projectId] as const,
  byMember: (memberId: string) =>
    [...reportsKeys.all, "by-member", memberId] as const,
  details: () => [...reportsKeys.all, "detail"] as const,
  detail: (id: string) => [...reportsKeys.details(), id] as const,
};

// Hook pour récupérer tous les rapports
export function useReports(filters?: GetReportsFilters) {
  return useQuery({
    queryKey: reportsKeys.list(filters),
    queryFn: () => getReports(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer les rapports validés
export function useValidatedReports() {
  return useQuery({
    queryKey: reportsKeys.validated(),
    queryFn: () => getValidatedReports(),
    staleTime: 10 * 60 * 1000,
  });
}

// Hook pour récupérer les rapports d'un projet
export function useReportsByProject(projectId: string) {
  return useQuery({
    queryKey: reportsKeys.byProject(projectId),
    queryFn: () => getReportsByProject(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour récupérer les rapports d'un membre
export function useReportsByMember(memberId: string) {
  return useQuery({
    queryKey: reportsKeys.byMember(memberId),
    queryFn: () => getReportsByMember(memberId),
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour récupérer un rapport spécifique
export function useReport(id: string) {
  return useQuery({
    queryKey: reportsKeys.detail(id),
    queryFn: () => getReport(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation pour créer un rapport
export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportsKeys.validated() });
      toast.success("Rapport créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour un rapport
export function useUpdateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateReport>[1];
    }) => updateReport(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: reportsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportsKeys.validated() });
      queryClient.invalidateQueries({ queryKey: reportsKeys.detail(id) });
      toast.success("Rapport mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour le statut d'un rapport
export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      statut,
      notes,
    }: Parameters<typeof updateReportStatus>[0] &
      Parameters<typeof updateReportStatus>[1] & { notes?: string }) =>
      updateReportStatus(id, statut, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: reportsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportsKeys.validated() });
      queryClient.invalidateQueries({ queryKey: reportsKeys.detail(id) });
      toast.success("Statut du rapport mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour supprimer un rapport
export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportsKeys.validated() });
      toast.success("Rapport supprimé");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
