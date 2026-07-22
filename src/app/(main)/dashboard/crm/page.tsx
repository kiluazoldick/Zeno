"use client";

import { useClients } from "@/hooks/queries/use-clients";
import { Loader2, AlertCircle } from "lucide-react";
import { KpiCards } from "./_components/kpi-cards";
import { OpportunitiesSection } from "./_components/opportunities-section";
import { PipelineActivity } from "./_components/pipeline-activity";
import { TaskReminders } from "./_components/task-reminders";

export default function Page() {
  const {
    data: clients,
    isLoading,
    error,
  } = useClients({
    includeProjects: true,
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
          <span>Erreur lors du chargement des clients: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <KpiCards clients={clients || []} />
      <PipelineActivity />
      <TaskReminders />
      <OpportunitiesSection clients={clients || []} />
    </div>
  );
}
