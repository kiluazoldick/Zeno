"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Schéma pour les filtres
const getTransactionsFiltersSchema = z.object({
  search: z.string().optional(),
  type: z
    .enum([
      "Entrée Réalisée",
      "Dépense Réalisé",
      "Entrée Prévue",
      "Dépense Prévue",
    ])
    .optional(),
  statut: z.enum(["Prévue", "Réalisée", "Annulée"]).optional(),
  projet_id: z.string().uuid("ID projet invalide").optional(),
  responsable: z.string().uuid("ID membre invalide").optional(),
  categorie: z.string().optional(),
  date_from: z.string().date("Date invalide").optional(),
  date_to: z.string().date("Date invalide").optional(),
  montant_min: z.number().min(0).optional(),
  montant_max: z.number().min(0).optional(),
  includeProjet: z.boolean().default(true),
  includeResponsable: z.boolean().default(true),
  includeInvoice: z.boolean().default(false),
});

export type GetTransactionsFilters = z.infer<
  typeof getTransactionsFiltersSchema
>;

export async function getTransactions(filters?: GetTransactionsFilters) {
  const supabase = await createServerClient();

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (filters?.includeProjet) {
    relations.push("projet:projet_id (*)");
  }

  if (filters?.includeResponsable) {
    relations.push("responsable_member:responsable (*)");
  }

  if (filters?.includeInvoice) {
    relations.push("invoice:invoice_id (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  let query = supabase
    .from("transactions")
    .select(select)
    .order("date_transaction", { ascending: false });

  // Appliquer les filtres
  if (filters?.search) {
    query = query.or(
      `description.ilike.%${filters.search}%,reference.ilike.%${filters.search}%`,
    );
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  if (filters?.statut) {
    query = query.eq("statut", filters.statut);
  }

  if (filters?.projet_id) {
    query = query.eq("projet_id", filters.projet_id);
  }

  if (filters?.responsable) {
    query = query.eq("responsable", filters.responsable);
  }

  if (filters?.categorie) {
    query = query.eq("categorie", filters.categorie);
  }

  if (filters?.date_from) {
    query = query.gte("date_transaction", filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte("date_transaction", filters.date_to);
  }

  if (filters?.montant_min !== undefined) {
    query = query.gte("montant", filters.montant_min);
  }

  if (filters?.montant_max !== undefined) {
    query = query.lte("montant", filters.montant_max);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des transactions: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les transactions par projet
export async function getTransactionsByProject(projectId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      responsable_member:responsable (*)
    `,
    )
    .eq("projet_id", projectId)
    .order("date_transaction", { ascending: false });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des transactions du projet: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les transactions du mois en cours
export async function getCurrentMonthTransactions() {
  const supabase = await createServerClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      projet:projet_id (*)
    `,
    )
    .gte("date_transaction", startOfMonth.toISOString().split("T")[0])
    .order("date_transaction", { ascending: false });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des transactions du mois: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les catégories distinctes
export async function getTransactionCategories() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("categorie")
    .not("categorie", "is", null)
    .order("categorie", { ascending: true });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des catégories: ${error.message}`,
    );
  }

  const categories = [...new Set(data.map((d) => d.categorie).filter(Boolean))];
  return categories;
}
