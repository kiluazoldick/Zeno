import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Facture } from "@/types/database";

interface UseFacturesOptions {
  includeClient?: boolean;
  includeProjet?: boolean;
}

export function useFacures(options?: UseFacturesOptions) {
  return useQuery({
    queryKey: ["factures", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.includeClient) params.append("includeClient", "true");
      if (options?.includeProjet) params.append("includeProjet", "true");

      const response = await fetch(`/api/factures?${params}`);
      if (!response.ok) throw new Error("Failed to fetch factures");
      return response.json() as Promise<Facture[]>;
    },
    initialData: [],
  });
}

export function useCreateFacture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Facture>) => {
      const response = await fetch("/api/factures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create facture");
      return response.json() as Promise<Facture>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
    },
  });
}

export function useUpdateFacture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Facture> }) => {
      const response = await fetch(`/api/factures/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update facture");
      return response.json() as Promise<Facture>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
    },
  });
}

export function useDeleteFacture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/factures/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete facture");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
    },
  });
}
