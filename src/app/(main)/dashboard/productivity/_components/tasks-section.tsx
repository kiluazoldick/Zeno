"use client";

import * as React from "react";

import { Calendar1, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Task = {
  title: string;
  tag: string;
  time: string;
  checked: boolean;
};

const tasks: Task[] = [
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

export function TasksSection() {
  const [items, setItems] = React.useState(tasks);

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
          {items.map((task) => (
            <div key={task.title} className="flex items-center gap-2 p-4">
              <Checkbox
                checked={task.checked}
                aria-label={task.title}
                onCheckedChange={(checked) => {
                  setItems((current) =>
                    current.map((item) => (item.title === task.title ? { ...item, checked: checked === true } : item)),
                  );
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                    <span className="truncate text-sm">{task.title}</span>
                    <Badge variant="outline" className="px-3 py-1 font-normal">
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
          ))}
        </div>
      </div>
    </section>
  );
}
