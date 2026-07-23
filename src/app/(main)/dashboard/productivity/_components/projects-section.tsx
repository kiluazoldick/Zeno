"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

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

export function ProjectsSection({ projects, isLoading }: ProjectSectionProps) {
  const activeProjects = projects?.filter((p) => p.statut === "En cours") || [];

  if (isLoading) {
    return (
      <section className="flex flex-col gap-2">
        <h2 className="text-xl tracking-tight">Projets en cours</h2>
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

  if (activeProjects.length === 0) {
    return (
      <section className="flex flex-col gap-2">
        <h2 className="text-xl tracking-tight">Projets en cours</h2>
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
          <p>Aucun projet en cours</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl tracking-tight">Projets en cours</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {activeProjects.slice(0, 3).map((project) => {
          const progress = project.progression || 0;

          return (
            <Card key={project.id} className="shadow-xs">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    <span className="truncate">{project.nom}</span>
                  </div>
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">{project.statut}</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1">
                  <div className="text-sm leading-none text-muted-foreground line-clamp-2">
                    {project.description || "Projet en cours"}
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={progress} className="h-2" />
                    <span className="shrink-0 text-sm">{progress}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="py-2.5">
                <span className="text-muted-foreground text-sm">
                  {project.date_fin
                    ? `Échéance ${format(new Date(project.date_fin), "d MMM", { locale: fr })}`
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
