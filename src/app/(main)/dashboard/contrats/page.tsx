"use client";

import { useState } from "react";
import {
  useContrats,
  useCreateContrat,
  useUpdateContrat,
  useDeleteContrat,
} from "@/hooks/queries/use-contrats";
import { Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, List, Send, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { type ContratInput, type ContratUpdateInput } from "@/lib/validations";

import { ContratList } from "./_components/contrat-list";
import { ContratKpi } from "./_components/contrat-kpi";
import { Contrat } from "./_components/contrat";
import { ContratFormValues } from "./_components/contrat-data";

type EditingContrat = ContratUpdateInput & { id: string };

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [editingContrat, setEditingContrat] = useState<EditingContrat | null>(null);

  const editingContratInput = editingContrat
    ? (editingContrat as ContratInput)
    : undefined;

  const {
    data: contrats,
    isLoading,
    error,
    refetch,
  } = useContrats({
    includeClient: true,
    includeProjet: true,
    includeDevis: true,
    includeInvoices: false,
  });

  const createContrat = useCreateContrat();
  const updateContrat = useUpdateContrat();
  const deleteContrat = useDeleteContrat();

  const handleAddContrat = () => {
    setEditingContrat(null);
    setActiveTab("create");
  };

  const handleEditContrat = (contrat: any) => {
    console.log("✏️ handleEditContrat - Contrat reçu:", contrat);
    setEditingContrat(contrat as EditingContrat);
    setActiveTab("create");
  };

  const handleDeleteContrat = (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) {
      return;
    }

    deleteContrat.mutate(id, {
      onSuccess: () => {
        toast.success("Contrat supprimé avec succès");
        refetch();
      },
      onError: (error: any) => {
        toast.error(
          "Erreur: " + (error.message || "Une erreur est survenue"),
        );
      },
    });
  };

  const handleSaveContrat = (data: ContratInput) => {
    console.log("💾 handleSaveContrat - Data reçue:", data);
    console.log("💾 handleSaveContrat - editingContrat:", editingContrat);

    if (editingContrat) {
      // Modification
      const updateData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) =>
            value !== "" &&
            value !== null &&
            value !== undefined
        )
      );
      delete updateData.numero; // si présent, sinon adapter

      console.log("📝 Mise à jour du contrat:", editingContrat.id, updateData);

      updateContrat.mutate(
        { id: editingContrat.id, data: updateData },
        {
          onSuccess: () => {
            toast.success("Contrat modifié avec succès");
            setEditingContrat(null);
            setActiveTab("list");
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
      console.log("🆕 Création d'un nouveau contrat:", data);
      const createData = { ...data };
      delete createData.numero; // si présent

      createContrat.mutate(createData, {
        onSuccess: () => {
          toast.success("Contrat créé avec succès");
          setActiveTab("list");
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

  // Revenir à la liste
  const handleBackToList = () => {
    setEditingContrat(null);
    setActiveTab("list");
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
          <span>Erreur: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-3xl leading-none tracking-tight">
            Gestion des contrats
          </h1>
          <p className="text-muted-foreground text-sm">
            Créez, gérez et suivez tous vos contrats
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as "list" | "create");
              if (v === "create") setEditingContrat(null);
            }}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="list" className="gap-2">
                <List className="size-4" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="create" className="gap-2">
                <Plus className="size-4" />
                {editingContrat ? "Modifier le contrat" : "Nouveau contrat"}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ContratKpi contrat={contrats || []} />

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="list" className="mt-0">
          <ContratList
            contrats={contrats || []}
            isLoading={isLoading}
            onAdd={handleAddContrat}
            onEdit={handleEditContrat}
            onDelete={handleDeleteContrat}
          />
        </TabsContent>
        <TabsContent value="create" className="mt-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Retour à la liste
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const form = document.querySelector("form");
                    if (form) {
                      form.dispatchEvent(
                        new Event("submit", {
                          cancelable: true,
                          bubbles: true,
                        }),
                      );
                    }
                  }}
                >
                  <Save className="size-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button
                  type="submit"
                  form="contrat-form"
                  className="bg-zeno-primary hover:bg-zeno-primary/90"
                >
                  <Send className="size-4 mr-2" />
                  {editingContrat ? "Mettre à jour" : "Créer le contrat"}
                </Button>
              </div>
            </div>
            <Contrat
              contrat={editingContratInput}
              onSave={handleSaveContrat}
              isEditing={!!editingContrat}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}