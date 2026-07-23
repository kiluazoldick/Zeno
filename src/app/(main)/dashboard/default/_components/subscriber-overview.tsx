"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Loader2,
  AlertCircle,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

        if (!projects || projects.length === 0) {
          setCustomers([]);
          setError(null);
          setIsLoading(false);
          return;
        }

        const formatted = projects.map((project: any) => {
          let billing = "En attente";
          if (project.budget_total && project.budget_total > 0) {
            billing = "Payé";
          }
          if (project.statut === "Annulé") {
            billing = "Annulé";
          }

          return {
            id: project.id.substring(0, 7).toUpperCase(),
            name: project.nom || "Projet sans nom",
            email: project.client?.email || "client@inconnu.cm",
            plan: project.priorite || "Standard",
            status: project.statut || "En cours",
            billing: billing,
            joined: project.date_debut
              ? new Date(project.date_debut).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Date non définie",
          };
        });

        setCustomers(formatted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  // Export CSV
  const handleExportCSV = () => {
    if (customers.length === 0) {
      alert("Aucune donnée à exporter");
      return;
    }

    // Définir les colonnes
    const headers = [
      "ID",
      "Projet",
      "Email",
      "Type",
      "Statut",
      "Paiement",
      "Date début",
    ];
    const rows = customers.map((c) => [
      c.id,
      c.name,
      c.email,
      c.plan,
      c.status,
      c.billing,
      c.joined,
    ]);

    // Construire le contenu CSV
    const csvContent = [
      headers.join(";"),
      ...rows.map((row) => row.join(";")),
    ].join("\n");

    // Ajouter BOM pour UTF-8
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `projets_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export PDF (version simplifiée - ouvre l'impression)
  const handleExportPDF = () => {
    if (customers.length === 0) {
      alert("Aucune donnée à exporter");
      return;
    }

    // Créer un tableau HTML pour l'impression
    const headers = [
      "ID",
      "Projet",
      "Email",
      "Type",
      "Statut",
      "Paiement",
      "Date début",
    ];
    const rows = customers.map((c) => [
      c.id,
      c.name,
      c.email,
      c.plan,
      c.status,
      c.billing,
      c.joined,
    ]);

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Liste des projets</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #02B3C4; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #1D3F92; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Liste des projets</h1>
        <p>Généré le ${new Date().toLocaleDateString("fr-FR")}</p>
        <table>
          <thead>
            <tr>
              ${headers.map((h) => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
              <tr>
                ${row.map((cell) => `<td>${cell}</td>`).join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        <div class="footer">
          <p>Zoldick Entreprise - Rapport exporté le ${new Date().toLocaleString("fr-FR")}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

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

  if (customers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">
            Projets et clients récents
          </CardTitle>
          <CardDescription>Aucun projet trouvé</CardDescription>
        </CardHeader>
        <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
          <p>Aucun projet disponible pour le moment</p>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="size-4" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>
                <FileSpreadsheet className="size-4 mr-2" />
                Exporter en CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileDown className="size-4 mr-2" />
                Exporter en PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-0">
        <RecentCustomersTable data={customers} />
      </CardContent>
    </Card>
  );
}
