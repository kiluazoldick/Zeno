"use client";

import { useState } from "react";
import { Plus, List, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RapportList } from "./_components/rapport-list";
import { RapportForm } from "./_components/rapport-form";
import { RapportKpi } from "./_components/rapport-kpi";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-3xl leading-none tracking-tight">
            Rapports
          </h1>
          <p className="text-muted-foreground text-sm">
            Gérez les rapports d'activité, financiers et de projets
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
                Nouveau rapport
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="list" className="mt-0 space-y-4">
          <RapportKpi />
          <RapportList />
        </TabsContent>
        <TabsContent value="create" className="mt-0">
          <RapportForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
