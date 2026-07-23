import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
  type GetClientsFilters,
} from "@/lib/actions/clients";
import { toast } from "sonner";

// Clés de cache
export const clientsKeys = {
  all: ["clients"] as const,
  lists: () => [...clientsKeys.all, "list"] as const,
  list: (filters?: GetClientsFilters) =>
    [...clientsKeys.lists(), filters] as const,
  details: () => [...clientsKeys.all, "detail"] as const,
  detail: (id: string) => [...clientsKeys.details(), id] as const,
  stats: (id: string) => [...clientsKeys.all, "stats", id] as const,
};

// Hook pour récupérer tous les clients
export function useClients(filters?: GetClientsFilters) {
  return useQuery({
    queryKey: clientsKeys.list(filters),
    queryFn: () => getClients(filters),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer un client spécifique
export function useClient(id: string) {
  return useQuery({
    queryKey: clientsKeys.detail(id),
    queryFn: () => getClient(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour récupérer les statistiques d'un client
export function useClientStats(id: string) {
  return useQuery({
    queryKey: clientsKeys.stats(id),
    queryFn: () => getClientStats(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

// Mutation pour créer un client
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.lists() });
      toast.success("Client créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour un client
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateClient>[1];
    }) => updateClient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientsKeys.stats(id) });
      toast.success("Client mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour supprimer un client
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cascade }: { id: string; cascade?: boolean }) =>
      deleteClient(id, cascade),
    onSuccess: () => {
      // Invalider TOUTES les requêtes clients
      queryClient.invalidateQueries({ queryKey: clientsKeys.all });
      toast.success("Client supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
