"use client";

import * as React from "react";

import { Calendar1 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
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

// Mapping des statuts pour les tags
const statusToTag: Record<string, string> = {
  "À faire": "À faire",
  "En cours": "En cours",
  Terminé: "Terminé",
  Annulé: "Annulé",
};

export function TasksSection({ tasks, isLoading }: TaskSectionProps) {
  const [filter, setFilter] = React.useState("today");

  if (isLoading) {
    return (
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl tracking-tight">Tâches du jour</h2>
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
        </div>
        <div className="rounded-xl border bg-background shadow-xs">
          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2 p-4">
                <Skeleton className="size-4 shrink-0" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Filtrer les tâches
  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];
    const now = new Date();

    switch (filter) {
      case "today":
        return tasks.filter((t) => {
          if (!t.date_execution) return false;
          const d = new Date(t.date_execution);
          return (
            d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        });
      case "tomorrow": {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tasks.filter((t) => {
          if (!t.date_execution) return false;
          const d = new Date(t.date_execution);
          return (
            d.getDate() === tomorrow.getDate() &&
            d.getMonth() === tomorrow.getMonth() &&
            d.getFullYear() === tomorrow.getFullYear()
          );
        });
      }
      case "this-week": {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return tasks.filter((t) => {
          if (!t.date_execution) return false;
          const d = new Date(t.date_execution);
          return d >= startOfWeek && d <= endOfWeek;
        });
      }
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const displayTasks = filteredTasks.slice(0, 5);
  const hasTasks = displayTasks.length > 0;

  // Transformer les données pour l'affichage
  const taskItems = displayTasks.map((t) => ({
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
  }));

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight">Tâches du jour</h2>
        <Select value={filter} onValueChange={setFilter}>
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
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
        <div className="divide-y">
          {!hasTasks ? (
            <div className="p-8 text-center text-muted-foreground">
              {filter === "today"
                ? "Aucune tâche pour aujourd'hui. Profitez-en pour vous organiser ! 🎯"
                : "Aucune tâche dans cette période"}
            </div>
          ) : (
            taskItems.map((task) => (
              <div key={task.id} className="flex items-center gap-2 p-4">
                <Checkbox checked={task.checked} aria-label={task.title} />
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
