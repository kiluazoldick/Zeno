"use client";

import { useState } from "react";
import { useFacures as useFactures } from "@/hooks/queries/use-factures";
import { Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, List, FileText } from "lucide-react";

import { FactureForm } from "./_components/facture-form";
import { FactureList } from "./_components/facture-list";
import { fallbackFactures } from "./_components/facture-data";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const {
    data: factures,
    isLoading,
    error,
  } = useFactures({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factures</h1>
          <p className="text-muted-foreground">
            Gérez vos factures et suivez vos paiements
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3">
          <AlertCircle className="size-5 text-destructive mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive">Erreur</h3>
            <p className="text-sm text-destructive/80">
              {error instanceof Error ? error.message : "Une erreur est survenue"}
            </p>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="list" className="gap-2">
            <List className="size-4" />
            Liste des factures
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2">
            <Plus className="size-4" />
            Nouvelle facture
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <FactureList factures={factures || fallbackFactures} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="create">
          <FactureForm onSuccess={() => setActiveTab("list")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
