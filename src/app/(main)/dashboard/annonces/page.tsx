"use client";

import { useState } from "react";
import { Plus, List, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AnnonceList } from "./_components/annonce-list";
import { AnnonceForm } from "./_components/annonce-form";
import { AnnonceFeed } from "./_components/annonce-feed";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "create" | "feed">(
    "feed",
  );

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
          <AnnonceFeed />
        </TabsContent>
        <TabsContent value="list" className="mt-0">
          <AnnonceList />
        </TabsContent>
        <TabsContent value="create" className="mt-0">
          <AnnonceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
