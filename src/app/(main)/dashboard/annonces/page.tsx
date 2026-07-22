"use client";

import { useState } from "react";
import {
  useAnnonces,
  usePublishedAnnonces,
  useImportantAnnonces,
} from "@/hooks/queries/use-annonces";
import { Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List, Megaphone } from "lucide-react";

import { AnnonceFeed } from "./_components/annonce-feed";
import { AnnonceList } from "./_components/annonce-list";
import { AnnonceForm } from "./_components/annonce-form";
import { fallbackAnnonces } from "./_components/annonce-data";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "create" | "feed">(
    "feed",
  );

  // Récupérer les annonces publiées pour le fil d'actualité
  const {
    data: published,
    isLoading: publishedLoading,
    error: publishedError,
  } = usePublishedAnnonces();

  // Récupérer toutes les annonces pour la liste
  const {
    data: allAnnonces,
    isLoading: allLoading,
    error: allError,
  } = useAnnonces({
    includeAuteur: true,
  });

  const isLoading = publishedLoading || allLoading;
  const error = publishedError || allError;

  // Données de fallback
  const feedData =
    published && published.length > 0 ? published : fallbackAnnonces;
  const listData =
    allAnnonces && allAnnonces.length > 0 ? allAnnonces : fallbackAnnonces;

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
          <span>Erreur lors du chargement des annonces: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-3xl leading-none tracking-tight">
            Annonces
          </h1>
          <p className="text-muted-foreground text-sm">
            Communications officielles, réunions, reports et informations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "list" | "create" | "feed")}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="feed" className="gap-2">
                <Megaphone className="size-4" />
                Fil
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="size-4" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="create" className="gap-2">
                <Plus className="size-4" />
                Nouvelle annonce
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="feed" className="mt-0">
          <AnnonceFeed annonces={feedData} />
        </TabsContent>
        <TabsContent value="list" className="mt-0">
          <AnnonceList annonces={listData} isLoading={allLoading} />
        </TabsContent>
        <TabsContent value="create" className="mt-0">
          <AnnonceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
