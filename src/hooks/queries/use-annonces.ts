import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAnnonces,
  getAnnonce,
  createAnnonce,
  updateAnnonce,
  deleteAnnonce,
  updateAnnonceStatus,
  getPublishedAnnonces,
  getImportantAnnonces,
  getAnnonceTags,
  type GetAnnoncesFilters,
} from "@/lib/actions/annonces";
import { toast } from "sonner";

// Clés de cache
export const annoncesKeys = {
  all: ["annonces"] as const,
  lists: () => [...annoncesKeys.all, "list"] as const,
  list: (filters?: GetAnnoncesFilters) =>
    [...annoncesKeys.lists(), filters] as const,
  published: () => [...annoncesKeys.all, "published"] as const,
  important: () => [...annoncesKeys.all, "important"] as const,
  tags: () => [...annoncesKeys.all, "tags"] as const,
  details: () => [...annoncesKeys.all, "detail"] as const,
  detail: (id: string) => [...annoncesKeys.details(), id] as const,
};

// Hook pour récupérer toutes les annonces
export function useAnnonces(filters?: GetAnnoncesFilters) {
  return useQuery({
    queryKey: annoncesKeys.list(filters),
    queryFn: () => getAnnonces(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook pour récupérer les annonces publiées (fil d'actualité)
export function usePublishedAnnonces() {
  return useQuery({
    queryKey: annoncesKeys.published(),
    queryFn: () => getPublishedAnnonces(),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook pour récupérer les annonces importantes
export function useImportantAnnonces() {
  return useQuery({
    queryKey: annoncesKeys.important(),
    queryFn: () => getImportantAnnonces(),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook pour récupérer les tags
export function useAnnonceTags() {
  return useQuery({
    queryKey: annoncesKeys.tags(),
    queryFn: () => getAnnonceTags(),
    staleTime: 10 * 60 * 1000,
  });
}

// Hook pour récupérer une annonce spécifique
export function useAnnonce(id: string) {
  return useQuery({
    queryKey: annoncesKeys.detail(id),
    queryFn: () => getAnnonce(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation pour créer une annonce
export function useCreateAnnonce() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnnonce,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: annoncesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: annoncesKeys.published() });
      queryClient.invalidateQueries({ queryKey: annoncesKeys.important() });
      toast.success("Annonce créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour une annonce
export function useUpdateAnnonce() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateAnnonce>[1];
    }) => updateAnnonce(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: annoncesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: annoncesKeys.published() });
      queryClient.invalidateQueries({ queryKey: annoncesKeys.important() });
      queryClient.invalidateQueries({ queryKey: annoncesKeys.detail(id) });
      toast.success("Annonce mise à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour le statut d'une annonce
export function useUpdateAnnonceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      statut,
    }: Parameters<typeof updateAnnonceStatus>[0] &
      Parameters<typeof updateAnnonceStatus>[1]) =>
      updateAnnonceStatus(id, statut),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: annoncesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: annoncesKeys.published() });
      queryClient.invalidateQueries({ queryKey: annoncesKeys.important() });
      queryClient.invalidateQueries({ queryKey: annoncesKeys.detail(id) });
      toast.success("Statut de l'annonce mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour supprimer une annonce
export function useDeleteAnnonce() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnnonce,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: annoncesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: annoncesKeys.published() });
      queryClient.invalidateQueries({ queryKey: annoncesKeys.important() });
      toast.success("Annonce supprimée");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
