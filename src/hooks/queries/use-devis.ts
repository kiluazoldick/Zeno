// src/hooks/queries/use-devis.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDevis,
  getDevi,
  createDevis, // ← doit correspondre à l'export dans index.ts
  updateDevis, // ← doit correspondre à l'export dans index.ts
  deleteDevi, // ← Changé de deleteDevis à deleteDevi
  updateDevisStatus,
  type GetDevisFilters,
} from "@/lib/actions/devis";
import { toast } from "sonner";
import { DevisUpdateInput, type DevisInput } from "@/lib/validations";

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
    staleTime: 5 * 60 * 1000,
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
export function useCreateDevis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DevisInput) => {
      const result = await createDevis(data);

      if (!result.success) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Erreur lors de la création du devis"
        );
      }

      return result.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: devisKeys.lists(),
      });

      toast.success("Devis créé avec succès");
    },

    onError: (error) => {
      console.error("❌ Erreur création:", error);

      toast.error(
        error.message || "Une erreur est survenue"
      );
    },
  });
}

// Mutation pour mettre à jour un devis
export function useUpdateDevis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DevisUpdateInput }) =>
      updateDevis(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: devisKeys.lists() });
      queryClient.invalidateQueries({ queryKey: devisKeys.detail(id) });
      toast.success("Devis modifié avec succès");
    },
    onError: (error: any) => {
      console.error("❌ Erreur modification:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
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
    }: {
      id: string;
      statut: any;
      notes?: string;
    }) => updateDevisStatus(id, statut, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: devisKeys.lists() });
      queryClient.invalidateQueries({ queryKey: devisKeys.detail(id) });
      toast.success("Statut du devis mis à jour");
    },
    onError: (error: any) => {
      console.error("❌ Erreur mise à jour statut:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
    },
  });
}

// Mutation pour supprimer un devis - Changé de useDeleteDevis à useDeleteDevi
export function useDeleteDevi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteDevi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: devisKeys.lists() });
      toast.success("Devis supprimé avec succès");
    },
    onError: (error: any) => {
      console.error("❌ Erreur suppression:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
    },
  });
}
