"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

interface ProjectDialogSimpleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSuccess: () => void;
}

export function ProjectDialogSimple({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectDialogSimpleProps) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    client_id: "",
    statut: "En cours",
    priorite: "Moyenne",
    budget_total: "",
    lieu: "",
    date_debut: "",
  });

  useEffect(() => {
    if (open) {
      // Load clients
      fetch("/api/clients")
        .then((r) => r.json())
        .then((data) => setClients(data));

      if (project) {
        setFormData({
          nom: project.nom || "",
          description: project.description || "",
          client_id: project.client_id || "",
          statut: project.statut || "En cours",
          priorite: project.priorite || "Moyenne",
          budget_total: project.budget_total?.toString() || "",
          lieu: project.lieu || "",
          date_debut: project.date_debut || "",
        });
      } else {
        setFormData({
          nom: "",
          description: "",
          client_id: "",
          statut: "En cours",
          priorite: "Moyenne",
          budget_total: "",
          lieu: "",
          date_debut: "",
        });
      }
    }
  }, [open, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom.trim()) {
      toast({ title: "Erreur", description: "Le nom est requis", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (project) {
        // Update
        const response = await fetch(`/api/projects/${project.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            budget_total: formData.budget_total ? Number(formData.budget_total) : null,
          }),
        });
        if (response.ok) {
          toast({ title: "Succès", description: "Projet mis à jour" });
          onSuccess();
        }
      } else {
        // Create
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            budget_total: formData.budget_total ? Number(formData.budget_total) : null,
          }),
        });
        if (response.ok) {
          toast({ title: "Succès", description: "Projet créé" });
          onSuccess();
        }
      }
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de l'enregistrement", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{project ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nom du projet *</label>
            <Input
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Nom du projet"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Client</label>
            <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Statut</label>
              <Select value={formData.statut} onValueChange={(value) => setFormData({ ...formData, statut: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["En cours", "En attente", "Terminé", "Annulé"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Priorité</label>
              <Select value={formData.priorite} onValueChange={(value) => setFormData({ ...formData, priorite: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Haute", "Moyenne", "Basse"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Budget (FCFA)</label>
            <Input
              type="number"
              value={formData.budget_total}
              onChange={(e) => setFormData({ ...formData, budget_total: e.target.value })}
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Lieu</label>
            <Input
              value={formData.lieu}
              onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
              placeholder="Lieu"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date de début</label>
            <Input
              type="date"
              value={formData.date_debut}
              onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-zeno-primary">
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
