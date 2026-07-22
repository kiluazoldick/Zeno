"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ProjectDialogSimple } from "./project-dialog-simple";

interface Project {
  id: string;
  nom: string;
  description?: string;
  client_id?: string;
  statut?: string;
  priorite?: string;
  budget_total?: number;
  lieu?: string;
  date_debut?: string;
}

interface ProjectsCrudProps {
  initialProjects: Project[];
  onRefresh: () => void;
}

export function ProjectsCrud({ initialProjects, onRefresh }: ProjectsCrudProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
    } else {
      setEditingProject(null);
    }
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        toast({ title: "Succès", description: "Projet supprimé" });
      } else {
        toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  const handleSuccess = async () => {
    // Refresh projects list
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        onRefresh();
      }
    } catch (error) {
      console.error("Error refreshing projects:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projets</h3>
        <Button onClick={() => handleOpenDialog()} className="gap-2 bg-zeno-primary">
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Budget (FCFA)</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.nom}</TableCell>
                  <TableCell>{project.client_id || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        project.statut === "En cours"
                          ? "bg-blue-100 text-blue-800"
                          : project.statut === "Terminé"
                            ? "bg-green-100 text-green-800"
                            : project.statut === "En attente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.statut}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        project.priorite === "Haute"
                          ? "bg-red-100 text-red-800"
                          : project.priorite === "Moyenne"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {project.priorite}
                    </span>
                  </TableCell>
                  <TableCell>{project.budget_total?.toLocaleString("fr-FR") || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(project)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(project.id)}
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Aucun projet trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ProjectDialogSimple
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
