"use client";

import { addDays, format } from "date-fns";
import { Building2, ClipboardCheck, Globe, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectSectionProps {
  projects?: Array<{
    id: string;
    nom: string;
    client_id: string | null;
    description: string | null;
    statut: string;
    progression: number;
    date_fin: string | null;
    location: string | null;
  }>;
  isLoading?: boolean;
}

// Icônes par projet (fallback)
const projectIcons: Record<string, any> = {
  "Application Mobile Orange Money": Globe,
  "Site Web Institutionnel Afriland": Building2,
  "CRM MTN Entreprises": ClipboardCheck,
  "Chatbot IA ENEO": Globe,
};

export function ProjectsSection({ projects, isLoading }: ProjectSectionProps) {
  // Utiliser les données réelles ou le fallback
  const displayProjects = projects && projects.length > 0 ? projects : [];

  // Filtrer les projets en cours
  const activeProjects = displayProjects.filter((p) => p.statut === "En cours");

  if (isLoading) {
    return (
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl tracking-tight">Projets en cours</h2>
          <div className="flex items-center gap-2">
            <Select defaultValue="active">
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Actifs" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="planning">Planification</SelectItem>
                  <SelectItem value="completed">Terminés</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Plus data-icon="inline-start" />
              Nouveau
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-xs">
              <CardContent className="flex h-40 items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-4 border-zeno-primary border-t-transparent" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  // Si pas de projets, afficher un message
  if (activeProjects.length === 0) {
    return (
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl tracking-tight">Projets en cours</h2>
          <div className="flex items-center gap-2">
            <Select defaultValue="active">
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Actifs" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="planning">Planification</SelectItem>
                  <SelectItem value="completed">Terminés</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Plus data-icon="inline-start" />
              Nouveau
            </Button>
          </div>
        </div>
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
          <p>Aucun projet en cours</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight">Projets en cours</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="active">
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Actifs" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="planning">Planification</SelectItem>
                <SelectItem value="completed">Terminés</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Plus data-icon="inline-start" />
            Nouveau
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {activeProjects.slice(0, 3).map((project) => {
          const Icon = projectIcons[project.nom] || Building2;
          const progress = project.progression || 0;

          return (
            <Card key={project.id} className="shadow-xs">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="truncate">{project.nom}</span>
                  </div>
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">{project.statut}</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1">
                  <div className="text-sm leading-none">
                    {project.description || "Projet en cours"}
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={progress} className="h-2" />
                    <span className="shrink-0 text-sm">{progress}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="py-2.5">
                <span className="text-muted-foreground">
                  {project.date_fin
                    ? `Échéance ${format(new Date(project.date_fin), "d MMM")}`
                    : "Date non définie"}
                </span>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
