"use client";

import * as React from "react";

import { Calendar1, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskSectionProps {
  tasks?: Array<{
    id: string;
    titre: string;
    description: string | null;
    statut: string;
    assigne: { nom: string } | null;
    date_execution: string | null;
    lieu: string | null;
    projet: { nom: string } | null;
    priorite: string;
  }>;
  isLoading?: boolean;
}

// Données mockées de fallback (si pas de données réelles)
const fallbackTasks = [
  {
    title: "Finaliser rapport projet Banto",
    tag: "Rapport",
    time: "09:00",
    checked: false,
  },
  {
    title: "Réunion chantier Hôtel Royal",
    tag: "Terrain",
    time: "10:30",
    checked: true,
  },
  {
    title: "Répondre aux emails clients",
    tag: "Admin",
    time: "14:00",
    checked: false,
  },
  {
    title: "Préparer devis extension hôpital",
    tag: "Devis",
    time: "15:30",
    checked: false,
  },
  {
    title: "Synthèse hebdomadaire équipe",
    tag: "Planning",
    time: "17:00",
    checked: false,
  },
];

// Mapping des statuts pour les tags
const statusToTag: Record<string, string> = {
  "À faire": "À faire",
  "En cours": "En cours",
  Terminé: "Terminé",
  Annulé: "Annulé",
};

export function TasksSection({ tasks, isLoading }: TaskSectionProps) {
  // Transformer les données réelles ou utiliser le fallback
  const displayTasks =
    tasks && tasks.length > 0
      ? tasks
          .filter((t) => t.statut === "À faire" || t.statut === "En cours")
          .slice(0, 5) // Limiter à 5 tâches
          .map((t) => ({
            id: t.id,
            title: t.titre,
            tag: t.projet?.nom || t.statut || "Général",
            time: t.date_execution
              ? new Date(t.date_execution).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "À planifier",
            checked: t.statut === "Terminé",
          }))
      : fallbackTasks;

  // Si on a des tâches mais moins de 5, compléter avec des fallbacks
  let items = displayTasks;
  if (displayTasks.length > 0 && displayTasks.length < 5) {
    const remaining = 5 - displayTasks.length;
    const extraFallbacks = fallbackTasks
      .slice(0, remaining)
      .map((task, index) => ({
        ...task,
        title: `${task.title} (fallback)`,
        id: `fallback-${index}`,
      }));
    items = [...displayTasks, ...extraFallbacks];
  }

  const [taskItems, setTaskItems] = React.useState(items);

  // Mettre à jour les items quand les tâches changent
  React.useEffect(() => {
    if (displayTasks.length > 0) {
      setTaskItems(displayTasks);
    }
  }, [tasks]);

  if (isLoading) {
    return (
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl tracking-tight">Tâches du jour</h2>
          <div className="flex items-center gap-2">
            <Select defaultValue="today">
              <SelectTrigger className="w-30">
                <SelectValue placeholder="Aujourd'hui" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="tomorrow">Demain</SelectItem>
                  <SelectItem value="this-week">Cette semaine</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="bg-zeno-primary hover:bg-zeno-primary/90">
              <Plus data-icon="inline-start" />
              Nouvelle tâche
            </Button>
          </div>
        </div>
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <div className="size-8 animate-spin rounded-full border-4 border-zeno-primary border-t-transparent" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight">Tâches du jour</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Aujourd'hui" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="tomorrow">Demain</SelectItem>
                <SelectItem value="this-week">Cette semaine</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="bg-zeno-primary hover:bg-zeno-primary/90">
            <Plus data-icon="inline-start" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
        <div className="divide-y">
          {taskItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Aucune tâche pour aujourd'hui. Profitez-en pour vous organiser !
              🎯
            </div>
          ) : (
            taskItems.map((task) => (
              <div
                key={task.id || task.title}
                className="flex items-center gap-2 p-4"
              >
                <Checkbox
                  checked={task.checked}
                  aria-label={task.title}
                  onCheckedChange={(checked) => {
                    setTaskItems((current) =>
                      current.map((item) =>
                        item.id === task.id || item.title === task.title
                          ? { ...item, checked: checked === true }
                          : item,
                      ),
                    );
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                      <span
                        className={`truncate text-sm ${task.checked ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="px-3 py-1 font-normal"
                      >
                        {task.tag}
                      </Badge>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-muted-foreground text-sm">
                      <span>{task.time}</span>
                      <Calendar1 className="size-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
