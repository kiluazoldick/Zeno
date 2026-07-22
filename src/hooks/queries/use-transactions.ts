import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCurrentMonthTransactions,
  getTransactionCategories,
  type GetTransactionsFilters,
} from "@/lib/actions/transactions";
import { toast } from "sonner";

// Clés de cache
export const transactionsKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionsKeys.all, "list"] as const,
  list: (filters?: GetTransactionsFilters) =>
    [...transactionsKeys.lists(), filters] as const,
  currentMonth: () => [...transactionsKeys.all, "current-month"] as const,
  categories: () => [...transactionsKeys.all, "categories"] as const,
  details: () => [...transactionsKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionsKeys.details(), id] as const,
};

// Hook pour récupérer toutes les transactions
export function useTransactions(filters?: GetTransactionsFilters) {
  return useQuery({
    queryKey: transactionsKeys.list(filters),
    queryFn: () => getTransactions(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook pour récupérer les transactions du mois en cours
export function useCurrentMonthTransactions() {
  return useQuery({
    queryKey: transactionsKeys.currentMonth(),
    queryFn: () => getCurrentMonthTransactions(),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook pour récupérer les catégories
export function useTransactionCategories() {
  return useQuery({
    queryKey: transactionsKeys.categories(),
    queryFn: () => getTransactionCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

// Hook pour récupérer une transaction spécifique
export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionsKeys.detail(id),
    queryFn: () => getTransaction(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation pour créer une transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: transactionsKeys.currentMonth(),
      });
      toast.success("Transaction créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour une transaction
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateTransaction>[1];
    }) => updateTransaction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: transactionsKeys.currentMonth(),
      });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.detail(id) });
      toast.success("Transaction mise à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour supprimer une transaction
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: transactionsKeys.currentMonth(),
      });
      toast.success("Transaction supprimée");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
