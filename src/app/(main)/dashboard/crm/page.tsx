"use client";

import { useState, useCallback } from "react";
import { useClients } from "@/hooks/queries/use-clients";
import {
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks/queries/use-clients";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { KpiCards } from "./_components/kpi-cards";
import { OpportunitiesSection } from "./_components/opportunities-section";
import { ClientDialog } from "./_components/client-dialog";

export default function Page() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const {
    data: clients,
    isLoading,
    error,
    refetch,
  } = useClients({
    includeProjects: true,
  });

  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const handleAddClient = useCallback(() => {
    setEditingClient(null);
    setDialogOpen(true);
  }, []);

  const handleEditClient = useCallback((client: any) => {
    setEditingClient(client);
    setDialogOpen(true);
  }, []);

  const handleDeleteClient = useCallback(
    (id: string) => {
      deleteClient.mutate(
        { id },
        {
          onSuccess: () => {
            toast.success("Client supprimé avec succès");
          },
          onError: (error: any) => {
            toast.error(
              "Erreur: " + (error.message || "Une erreur est survenue"),
            );
          },
        },
      );
    },
    [deleteClient],
  );

  const handleSaveClient = useCallback(
    (data: any) => {
      if (editingClient) {
        updateClient.mutate(
          { id: editingClient.id, data },
          {
            onSuccess: () => {
              toast.success("Client modifié avec succès");
              setDialogOpen(false);
            },
            onError: (error: any) => {
              toast.error(
                "Erreur: " + (error.message || "Une erreur est survenue"),
              );
            },
          },
        );
      } else {
        createClient.mutate(data, {
          onSuccess: () => {
            toast.success("Client créé avec succès");
            setDialogOpen(false);
          },
          onError: (error: any) => {
            toast.error(
              "Erreur: " + (error.message || "Une erreur est survenue"),
            );
          },
        });
      }
    },
    [editingClient, createClient, updateClient],
  );

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
          <span>Erreur lors du chargement des clients: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl tracking-tight">Clients</h2>
          <p className="text-muted-foreground text-sm">
            Gérez vos clients et suivez leurs projets
          </p>
        </div>
        <Button
          className="bg-zeno-primary hover:bg-zeno-primary/90"
          onClick={handleAddClient}
        >
          <Plus className="size-4" />
          Nouveau client
        </Button>
      </div>

      <KpiCards clients={clients || []} />

      <OpportunitiesSection
        clients={clients || []}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />

      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editingClient}
        onSave={handleSaveClient}
        isEditing={!!editingClient}
      />
    </div>
  );
}
