// src/app/(main)/dashboard/devis/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  useDevis,
  useCreateDevis,
  useUpdateDevis,
  useDeleteDevi,
} from "@/hooks/queries/use-devis";
import { Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, List, Send, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { type DevisInput, DevisUpdateInput } from "@/lib/validations";

import { DevisList } from "./_components/devis-list";
import { DevisKpi } from "./_components/devis-kpi";
import { Devis } from "./_components/devis";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [editingDevis, setEditingDevis] = useState<any>(null);

  const {
    data: devis,
    isLoading,
    error,
    refetch,
  } = useDevis({
    includeClient: true,
    includeProjet: true,
    includeContrat: false,
  });

  const createDevis = useCreateDevis();
  const updateDevis = useUpdateDevis();
  const deleteDevis = useDeleteDevi();

  const handleAddDevis = () => {
    setEditingDevis(null);
    setActiveTab("create");
  };

  const handleEditDevis = (devis: DevisUpdateInput) => {
    console.log("✏️ handleEditDevis - Devis reçu:", devis);
    setEditingDevis(devis);
    setActiveTab("create");
  };

  const handleDeleteDevis = (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
      return;
    }

    deleteDevis.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Devis supprimé avec succès");
          refetch();
        },
        onError: (error: any) => {
          toast.error(
            "Erreur: " + (error.message || "Une erreur est survenue"),
          );
        },
      },
    );
  };

  const handleSaveDevis = (data: DevisInput) => {
    console.log("💾 handleSaveDevis - Data reçue:", data);
    console.log("💾 handleSaveDevis - editingDevis:", editingDevis);

    if (editingDevis) {
      // Modification
      const updateData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) =>
            value !== "" &&
            value !== null &&
            value !== undefined
        )
      );
      delete updateData.numero;

      console.log("📝 Mise à jour du devis:", editingDevis.id, updateData);

      updateDevis.mutate(
        { id: editingDevis.id, data: updateData },
        {
          onSuccess: () => {
            toast.success("Devis modifié avec succès");
            setEditingDevis(null);
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
      console.log("🆕 Création d'un nouveau devis:", data);
      const createData = { ...data };

      delete createData.numero;

      createDevis.mutate(createData);

      createDevis.mutate(data, {
        onSuccess: () => {
          toast.success("Devis créé avec succès");
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
    setEditingDevis(null);
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
            Gestion des devis
          </h1>
          <p className="text-muted-foreground text-sm">
            Créez, gérez et suivez tous vos devis
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as "list" | "create");
              if (v === "create") setEditingDevis(null);
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
                {editingDevis ? "Modifier le devis" : "Nouveau devis"}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <DevisKpi devis={devis || []} />

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="list" className="mt-0">
          <DevisList
            devis={devis || []}
            isLoading={isLoading}
            onAdd={handleAddDevis}
            onEdit={handleEditDevis}
            onDelete={handleDeleteDevis}
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
                  form="devis-form"
                  className="bg-zeno-primary hover:bg-zeno-primary/90"
                >
                  <Send className="size-4 mr-2" />
                  {editingDevis ? "Mettre à jour" : "Créer le devis"}
                </Button>
              </div>
            </div>
            <Devis
              devis={editingDevis}
              onSave={handleSaveDevis}
              isEditing={!!editingDevis}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
