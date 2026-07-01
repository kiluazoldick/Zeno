"use client";

import { useState } from "react";

import { List, Plus, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { type DevisFormValues, defaultDevisValues } from "./_components/devis-data";
import { DevisForm } from "./_components/devis-form";
import { DevisList } from "./_components/devis-list";
import { DevisPreview } from "./_components/devis-preview";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [formValues, setFormValues] = useState<DevisFormValues>(defaultDevisValues);
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-3xl leading-none tracking-tight">Gestion des devis</h1>
          <p className="text-muted-foreground text-sm">Créez, gérez et suivez tous vos devis</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "list" | "create")} className="w-auto">
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

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="list" className="mt-0">
          <DevisList />
        </TabsContent>
        <TabsContent value="create" className="mt-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Sauvegarder en brouillon
                    console.log("Sauvegardé en brouillon");
                  }}
                >
                  <Save className="size-4" />
                  Sauvegarder
                </Button>
                <Button
                  type="button"
                  className="bg-zeno-primary hover:bg-zeno-primary/90"
                  onClick={() => {
                    // Envoyer le devis
                    console.log("Devis envoyé");
                  }}
                >
                  <Send className="size-4" />
                  Envoyer le devis
                </Button>
              </div>
              <Button type="button" variant="outline" onClick={() => setIsPreview(!isPreview)}>
                {isPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}
              </Button>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <DevisForm onValuesChange={setFormValues} />
              {isPreview && (
                <div className="xl:col-span-1">
                  <DevisPreview devis={formValues} />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
