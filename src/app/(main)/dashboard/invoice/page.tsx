"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { useInvoices } from "@/hooks/queries/use-invoices";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, List, Send, Save } from "lucide-react";
import { Invoice } from "./_components/invoice";
import { FactureList } from "./_components/facture-list";
import { fallbackFactures } from "./_components/facture-data";
import { createInvoice } from "@/lib/actions/invoices";
import { updateInvoice } from "@/lib/actions/invoices";
import { type InvoiceFormValues } from "@/lib/validations/invoice.schema";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  // On sépare l'id de la facture en cours d'édition
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceFormValues | null>(null);

  const {
    data: invoices,
    isLoading,
    error,
    refetch,
  } = useInvoices({
    includeClient: true,
    includeProjet: true,
    includeContrat: true,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span>Erreur lors du chargement des factures: {error.message}</span>
        </div>
      </div>
    );
  }

  const factureData = (
    invoices && invoices.length > 0 ? invoices : fallbackFactures
  ) as ComponentProps<typeof FactureList>["factures"];

  const handleEdit = (invoice: any) => {
    // ---- Contenu (items) ----
    let contenu = invoice.contenu;

    if (typeof contenu === "string") {
      try {
        contenu = JSON.parse(contenu);
      } catch {
        contenu = [];
      }
    }

    if (!Array.isArray(contenu)) {
      contenu = [];
    }

    // Ajouter un id à chaque ligne si manquant
    contenu = contenu.map((item: any, index: number) => ({
      id: item.id ?? crypto.randomUUID(),
      description: item.description ?? "",
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
    }));

    // ---- Objet from (émetteur) ----
    const from = invoice.from ?? {
      name: "Votre Entreprise",           // ← mettez le vrai nom ici
      email: "contact@votreentreprise.com",
      phone: "+221 XX XXX XX XX",
      website: "www.votreentreprise.com",
      addressLines: ["Adresse de l'entreprise"],
      taxId: "",
      paymentAccountName: "",
      routingNumber: "",
      issuerName: "Votre Entreprise",
    };

    // ---- Objet to (client) ----
    const to = invoice.to ?? {
      id: invoice.client_id ?? "",
      nom: invoice.client?.nom ?? "",
      email: invoice.client?.email ?? "",
    };

    setEditingInvoiceId(invoice.id);

    setEditingInvoice({
      client_id: invoice.client_id ?? "",
      projet_id: invoice.projet_id ?? "",
      contrat_id: invoice.contrat_id ?? "",
      titre: invoice.titre ?? "",
      statut: invoice.statut ?? "Brouillon",
      priorite: invoice.priorite ?? "Moyenne",
      montant_total: Number(invoice.montant_total) || 0,
      date_emission: invoice.date_emission ?? "",
      date_echeance: invoice.date_echeance ?? "",
      date_paiement: invoice.date_paiement ?? undefined,
      contenu,
      conditions: invoice.conditions ?? "",
      notes: invoice.notes ?? "",
      from,
      to,
    });

    setActiveTab("create");
  };

  const handleSave = async (data: InvoiceFormValues) => {
    console.log("📥 DONNÉES REÇUES PAR LE PARENT :", data);

    try {
      if (editingInvoiceId) {
        // Mode modification
        const result = await updateInvoice(editingInvoiceId, data);
        if (!result.success) {
          console.error("❌ Erreur :", result.error);
          return;
        }
        console.log("✅ Facture mise à jour");
      } else {
        // Mode création
        const result = await createInvoice(data);
        if (!result.success) {
          console.error("❌ Erreur :", result.error);
          return;
        }
        console.log("✅ Facture créée :", result.data);
      }

      // Retour à la liste + reset
      setActiveTab("list");
      setEditingInvoiceId(null);
      setEditingInvoice(null);
      refetch?.();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
    }
  };

  const handleBackToList = () => {
    setActiveTab("list");
    setEditingInvoiceId(null);
    setEditingInvoice(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-3xl leading-none tracking-tight">
            Gestion des factures
          </h1>
          <p className="text-muted-foreground text-sm">
            Créez, gérez et suivez toutes vos factures
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              const newTab = v as "list" | "create";
              setActiveTab(newTab);
              if (newTab === "list") {
                setEditingInvoiceId(null);
                setEditingInvoice(null);
              }
            }}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="list" className="gap-2">
                <List className="size-4" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="create" className="gap-2">
                <Plus className="size-4" />
                {editingInvoiceId ? "Modifier la facture" : "Nouvelle facture"}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="list" className="mt-0">
          <FactureList
            factures={factureData}
            isLoading={isLoading}
            onEdit={handleEdit}
            onInvoiceDeleted={() => refetch?.()}
          />
        </TabsContent>

        <TabsContent value="create" className="mt-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="size-4" />
                  Retour à la liste
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button type="button" variant="outline">
                  <Save className="size-4" />
                  Sauvegarder
                </Button>

                <Button
                  type="submit"
                  form="invoice-form"
                  className="bg-zeno-primary hover:bg-zeno-primary/90"
                >
                  <Send className="size-4" />
                  {editingInvoiceId ? "Mettre à jour la facture" : "Envoyer la facture"}
                </Button>
              </div>
            </div>

            <Invoice
              facture={editingInvoice ?? undefined}
              isEditing={!!editingInvoiceId}
              onSave={handleSave}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}