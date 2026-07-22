"use client";

import { useState } from "react";
import { useDevis } from "@/hooks/queries/use-devis";
import { Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";

import { DevisForm } from "./_components/devis-form";
import { DevisList } from "./_components/devis-list";
import { DevisKpi } from "./_components/devis-kpi";
import { fallbackDevis } from "./_components/devis-data";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const {
    data: devis,
    isLoading,
    error,
  } = useDevis({
    includeClient: true,
    includeProjet: true,
  });

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
          <span>Erreur lors du chargement des devis: {error.message}</span>
        </div>
      </div>
    );
  }

  const devisData = devis && devis.length > 0 ? devis : fallbackDevis;

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
            onValueChange={(v) => setActiveTab(v as "list" | "create")}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="list" className="gap-2">
                <List className="size-4" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="create" className="gap-2">
                <Plus className="size-4" />
                Nouveau devis
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <DevisKpi devis={devisData} />

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="list" className="mt-0">
          <DevisList devis={devisData} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="create" className="mt-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline">
                  Sauvegarder
                </Button>
                <Button
                  type="button"
                  className="bg-zeno-primary hover:bg-zeno-primary/90"
                >
                  Envoyer le devis
                </Button>
              </div>
            </div>
            <DevisForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
