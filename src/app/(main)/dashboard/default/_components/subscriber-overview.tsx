"use client";

import { useEffect, useState } from "react";
import { Download, Plus, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProjects } from "@/lib/actions/projects";

import type { RecentCustomerRow } from "./recent-customers-table/schema";
import { RecentCustomersTable } from "./recent-customers-table/table";

export function SubscriberOverview() {
  const [customers, setCustomers] = useState<RecentCustomerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true);
        const projects = await getProjects({
          includeClient: true,
          includeTasks: false,
        });

        // Transformer les projets en format RecentCustomerRow
        const formatted = projects.map((project: any) => ({
          id: project.id.substring(0, 7).toUpperCase(),
          name: project.nom || "Projet sans nom",
          email: project.client?.email || "client@inconnu.cm",
          plan: project.priorite || "Standard",
          status: project.statut || "En cours",
          billing: project.budget_total ? "Payé" : "En attente",
          joined: project.date_debut || new Date().toISOString().split("T")[0],
        }));

        setCustomers(formatted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">
            Projets et clients récents
          </CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">
            Projets et clients récents
          </CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="size-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">
          Projets et clients récents
        </CardTitle>
        <CardDescription>
          Liste des derniers projets avec leur statut
        </CardDescription>
        <CardAction className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Exporter
          </Button>
          <Button
            size="sm"
            className="bg-zeno-primary hover:bg-zeno-primary/90"
          >
            <Plus className="size-4" />
            Nouveau projet
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-0">
        <RecentCustomersTable data={customers} />
      </CardContent>
    </Card>
  );
}
