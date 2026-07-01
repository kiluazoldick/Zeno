import { addDays, format } from "date-fns";
import { Building2, ClipboardCheck, Globe, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const today = new Date();

const projects = [
  {
    title: "Construction Immeuble Banto",
    status: "En cours",
    description: "Bâtiment commercial R+5",
    progress: 68,
    due: `Échéance ${format(addDays(today, 9), "d MMM")}`,
    icon: Building2,
  },
  {
    title: "Rénovation Hôtel Royal",
    status: "Planification",
    description: "Rénovation complète",
    progress: 42,
    due: `Échéance ${format(addDays(today, 21), "d MMM")}`,
    icon: Globe,
  },
  {
    title: "Extension Hôpital Central",
    status: "Planification",
    description: "Aile pédiatrique",
    progress: 31,
    due: `Échéance ${format(addDays(today, 18), "d MMM")}`,
    icon: ClipboardCheck,
  },
] as const;

export function ProjectsSection() {
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
        {projects.map((project) => (
          <Card key={project.title} className="shadow-xs">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <project.icon className="size-4 text-muted-foreground" />
                  <span className="truncate">{project.title}</span>
                </div>
              </CardTitle>
              <CardAction>
                <Badge variant="outline">{project.status}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <div className="text-sm leading-none">{project.description}</div>
                <div className="flex items-center gap-3">
                  <Progress value={project.progress} className="h-2" />
                  <span className="shrink-0 text-sm">{project.progress}%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="py-2.5">
              <span className="text-muted-foreground">{project.due}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
