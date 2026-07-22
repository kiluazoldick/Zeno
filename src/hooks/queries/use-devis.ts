import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDevis,
  getDevi,
  createDevi,
  updateDevi,
  deleteDevi,
  updateDevisStatus,
  type GetDevisFilters,
} from "@/lib/actions/devis";
import { toast } from "sonner";

// Clés de cache
export const devisKeys = {
  all: ["devis"] as const,
  lists: () => [...devisKeys.all, "list"] as const,
  list: (filters?: GetDevisFilters) => [...devisKeys.lists(), filters] as const,
  details: () => [...devisKeys.all, "detail"] as const,
  detail: (id: string) => [...devisKeys.details(), id] as const,
};

// Hook pour récupérer tous les devis
export function useDevis(filters?: GetDevisFilters) {
  return useQuery({
    queryKey: devisKeys.list(filters),
    queryFn: () => getDevis(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer un devis spécifique
export function useDevi(id: string) {
  return useQuery({
    queryKey: devisKeys.detail(id),
    queryFn: () => getDevi(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation pour créer un devis
export function useCreateDevi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDevi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: devisKeys.lists() });
      toast.success("Devis créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour un devis
export function useUpdateDevi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateDevi>[1];
    }) => updateDevi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: devisKeys.lists() });
      queryClient.invalidateQueries({ queryKey: devisKeys.detail(id) });
      toast.success("Devis mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour le statut d'un devis
export function useUpdateDevisStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      statut,
      notes,
    }: Parameters<typeof updateDevisStatus>[0] &
      Parameters<typeof updateDevisStatus>[1] & { notes?: string }) =>
      updateDevisStatus(id, statut, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: devisKeys.lists() });
      queryClient.invalidateQueries({ queryKey: devisKeys.detail(id) });
      toast.success("Statut du devis mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour supprimer un devis
export function useDeleteDevi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDevi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: devisKeys.lists() });
      toast.success("Devis supprimé");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
