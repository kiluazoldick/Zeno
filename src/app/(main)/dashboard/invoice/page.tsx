"use client";

import { useState } from "react";
import { useInvoices } from "@/hooks/queries/use-invoices";
import { Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, List, Send, Save } from "lucide-react";

import { Invoice } from "./_components/invoice";
import { FactureList } from "./_components/facture-list";
import { fallbackFactures } from "./_components/facture-data";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const {
    data: invoices,
    isLoading,
    error,
  } = useInvoices({
    includeClient: true,
    includeProjet: true,
    includeContrat: true,
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
          <span>Erreur lors du chargement des factures: {error.message}</span>
        </div>
      </div>
    );
  }

  const factureData =
    invoices && invoices.length > 0 ? invoices : fallbackFactures;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-3xl leading-none tracking-tight">
            Gestion des factures
          </h1>
          <p className="text-muted-foreground text-sm">
            Créez, gérez et suivez toutes vos factures
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
                Nouvelle facture
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="list" className="mt-0">
          <FactureList factures={factureData} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="create" className="mt-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline">
                  <Save className="size-4" />
                  Sauvegarder
                </Button>
                <Button
                  type="button"
                  className="bg-zeno-primary hover:bg-zeno-primary/90"
                >
                  <Send className="size-4" />
                  Envoyer la facture
                </Button>
              </div>
            </div>
            <Invoice />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
