import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  getUnpaidInvoices,
  type GetInvoicesFilters,
} from "@/lib/actions/invoices";
import { toast } from "sonner";

// Clés de cache
export const invoicesKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoicesKeys.all, "list"] as const,
  list: (filters?: GetInvoicesFilters) =>
    [...invoicesKeys.lists(), filters] as const,
  unpaid: () => [...invoicesKeys.all, "unpaid"] as const,
  details: () => [...invoicesKeys.all, "detail"] as const,
  detail: (id: string) => [...invoicesKeys.details(), id] as const,
};

// Hook pour récupérer toutes les factures
export function useInvoices(filters?: GetInvoicesFilters) {
  return useQuery({
    queryKey: invoicesKeys.list(filters),
    queryFn: () => getInvoices(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer les factures impayées
export function useUnpaidInvoices() {
  return useQuery({
    queryKey: invoicesKeys.unpaid(),
    queryFn: () => getUnpaidInvoices(),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour récupérer une facture spécifique
export function useInvoice(id: string) {
  return useQuery({
    queryKey: invoicesKeys.detail(id),
    queryFn: () => getInvoice(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation pour créer une facture
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.unpaid() });
      toast.success("Facture créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour une facture
export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateInvoice>[1];
    }) => updateInvoice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.unpaid() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.detail(id) });
      toast.success("Facture mise à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour le statut d'une facture
export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      statut,
      notes,
    }: Parameters<typeof updateInvoiceStatus>[0] &
      Parameters<typeof updateInvoiceStatus>[1] & { notes?: string }) =>
      updateInvoiceStatus(id, statut, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.unpaid() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.detail(id) });
      toast.success("Statut de la facture mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour supprimer une facture
export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.unpaid() });
      toast.success("Facture supprimée");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
