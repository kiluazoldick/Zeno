import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContrats,
  getContrat,
  createContrat,
  updateContrat,
  deleteContrat,
  updateContratStatus,
  getActiveContrats,
  type GetContratsFilters,
} from "@/lib/actions/contrats";
import { toast } from "sonner";

// Clés de cache
export const contratsKeys = {
  all: ["contrats"] as const,
  lists: () => [...contratsKeys.all, "list"] as const,
  list: (filters?: GetContratsFilters) =>
    [...contratsKeys.lists(), filters] as const,
  active: () => [...contratsKeys.all, "active"] as const,
  details: () => [...contratsKeys.all, "detail"] as const,
  detail: (id: string) => [...contratsKeys.details(), id] as const,
};

// Hook pour récupérer tous les contrats
export function useContrats(filters?: GetContratsFilters) {
  return useQuery({
    queryKey: contratsKeys.list(filters),
    queryFn: () => getContrats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer les contrats actifs
export function useActiveContrats() {
  return useQuery({
    queryKey: contratsKeys.active(),
    queryFn: () => getActiveContrats(),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour récupérer un contrat spécifique
export function useContrat(id: string) {
  return useQuery({
    queryKey: contratsKeys.detail(id),
    queryFn: () => getContrat(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation pour créer un contrat
export function useCreateContrat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContrat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contratsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contratsKeys.active() });
      toast.success("Contrat créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour un contrat
export function useUpdateContrat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateContrat>[1];
    }) => updateContrat(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: contratsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contratsKeys.active() });
      queryClient.invalidateQueries({ queryKey: contratsKeys.detail(id) });
      toast.success("Contrat mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour le statut d'un contrat
export function useUpdateContratStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      statut,
      notes,
    }: Parameters<typeof updateContratStatus>[0] &
      Parameters<typeof updateContratStatus>[1] & { notes?: string }) =>
      updateContratStatus(id, statut, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: contratsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contratsKeys.active() });
      queryClient.invalidateQueries({ queryKey: contratsKeys.detail(id) });
      toast.success("Statut du contrat mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour supprimer un contrat
export function useDeleteContrat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContrat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contratsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contratsKeys.active() });
      toast.success("Contrat supprimé");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
