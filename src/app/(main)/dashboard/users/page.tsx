// src/app/(main)/dashboard/users/page.tsx
"use client";

import { useState } from "react";
import {
  useMembers,
  useCreateMember,
  useUpdateMember,
  useDeleteMember,
} from "@/hooks/queries/use-members";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Users } from "./_components/users";

export default function Page() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const { data: members, isLoading, error, refetch } = useMembers();

  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  const handleAddMember = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleEditMember = (member: any) => {
    console.log("✏️ handleEditMember - Membre reçu:", member);
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    console.log("🗑️ handleDeleteMember - ID:", id);

    if (!id || id === "") {
      toast.error("ID du membre invalide");
      return;
    }

    // Confirmer la suppression
    if (
      !confirm("Êtes-vous sûr de vouloir supprimer définitivement ce membre ?")
    ) {
      return;
    }

    deleteMember.mutate(
      { id, hardDelete: true }, // Suppression définitive
      {
        onSuccess: () => {
          toast.success("Membre supprimé avec succès");
          refetch();
        },
        onError: (error: any) => {
          console.error("❌ Erreur suppression:", error);
          toast.error(
            "Erreur: " + (error.message || "Une erreur est survenue"),
          );
        },
      },
    );
  };

  const handleSaveMember = (data: any) => {
    console.log("💾 handleSaveMember - Data reçue:", data);
    console.log("💾 handleSaveMember - editingMember:", editingMember);

    if (editingMember) {
      // Modification
      const updateData = { ...data };

      // Supprimer les champs vides
      Object.keys(updateData).forEach((key) => {
        if (
          updateData[key] === "" ||
          updateData[key] === null ||
          updateData[key] === undefined
        ) {
          delete updateData[key];
        }
      });

      console.log("📝 Mise à jour du membre:", editingMember.id, updateData);

      updateMember.mutate(
        { id: editingMember.id, data: updateData },
        {
          onSuccess: () => {
            toast.success("Membre modifié avec succès");
            setDialogOpen(false);
            refetch();
          },
          onError: (error: any) => {
            console.error("❌ Erreur modification:", error);
            toast.error(
              "Erreur: " + (error.message || "Une erreur est survenue"),
            );
          },
        },
      );
    } else {
      // Création
      console.log("🆕 Création d'un nouveau membre:", data);

      createMember.mutate(data, {
        onSuccess: () => {
          toast.success("Membre créé avec succès");
          setDialogOpen(false);
          refetch();
        },
        onError: (error: any) => {
          console.error("❌ Erreur création:", error);
          toast.error(
            "Erreur: " + (error.message || "Une erreur est survenue"),
          );
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span>Erreur lors du chargement des membres: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <Users
      users={members || []}
      onAddMember={handleAddMember}
      onEditMember={handleEditMember}
      onDeleteMember={handleDeleteMember}
      onSaveMember={handleSaveMember}
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      editingMember={editingMember}
      refetch={refetch}
    />
  );
}
