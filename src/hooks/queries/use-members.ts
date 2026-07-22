import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  type GetMembersFilters,
} from "@/lib/actions/members";
import { toast } from "sonner";

// Clés de cache
export const membersKeys = {
  all: ["members"] as const,
  lists: () => [...membersKeys.all, "list"] as const,
  list: (filters?: GetMembersFilters) =>
    [...membersKeys.lists(), filters] as const,
  details: () => [...membersKeys.all, "detail"] as const,
  detail: (id: string) => [...membersKeys.details(), id] as const,
};

// Hook pour récupérer tous les membres
export function useMembers(filters?: GetMembersFilters) {
  return useQuery({
    queryKey: membersKeys.list(filters),
    queryFn: () => getMembers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook pour récupérer un membre spécifique
export function useMember(id: string) {
  return useQuery({
    queryKey: membersKeys.detail(id),
    queryFn: () => getMember(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation pour créer un membre
export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
      toast.success("Membre créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour mettre à jour un membre
export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateMember>[1];
    }) => updateMember(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: membersKeys.detail(id) });
      toast.success("Membre mis à jour");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Mutation pour supprimer un membre
export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hardDelete }: { id: string; hardDelete?: boolean }) =>
      deleteMember(id, hardDelete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
      toast.success("Membre supprimé");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
