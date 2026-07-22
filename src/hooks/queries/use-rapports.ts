import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as actions from "@/lib/actions/rapports";

export function useRapports() {
  return useQuery({
    queryKey: ["rapports"],
    queryFn: async () => {
      const result = await actions.getRapports();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useCreateRapport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => actions.createRapport(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Rapport créé avec succès");
        queryClient.invalidateQueries({ queryKey: ["rapports"] });
      } else {
        toast.error(`Erreur: ${result.error}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

export function useUpdateRapport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      actions.updateRapport(id, data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Rapport modifié avec succès");
        queryClient.invalidateQueries({ queryKey: ["rapports"] });
      } else {
        toast.error(`Erreur: ${result.error}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

export function useDeleteRapport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => actions.deleteRapport(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Rapport supprimé avec succès");
        queryClient.invalidateQueries({ queryKey: ["rapports"] });
      } else {
        toast.error(`Erreur: ${result.error}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
