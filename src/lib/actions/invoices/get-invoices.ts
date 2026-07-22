"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Schéma pour les filtres
const getInvoicesFiltersSchema = z.object({
  search: z.string().optional(),
  statut: z
    .enum(["Brouillon", "Envoyée", "Payée", "Impayée", "Annulée"])
    .optional(),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).optional(),
  client_id: z.string().uuid("ID client invalide").optional(),
  projet_id: z.string().uuid("ID projet invalide").optional(),
  contrat_id: z.string().uuid("ID contrat invalide").optional(),
  date_emission_from: z.string().date("Date invalide").optional(),
  date_emission_to: z.string().date("Date invalide").optional(),
  date_echeance_from: z.string().date("Date invalide").optional(),
  date_echeance_to: z.string().date("Date invalide").optional(),
  includeClient: z.boolean().default(true),
  includeProjet: z.boolean().default(true),
  includeContrat: z.boolean().default(false),
});

export type GetInvoicesFilters = z.infer<typeof getInvoicesFiltersSchema>;

export async function getInvoices(filters?: GetInvoicesFilters) {
  const supabase = await createServerClient();

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (filters?.includeClient) {
    relations.push("client:client_id (*)");
  }

  if (filters?.includeProjet) {
    relations.push("projet:projet_id (*)");
  }

  if (filters?.includeContrat) {
    relations.push("contrat:contrat_id (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  let query = supabase
    .from("invoices")
    .select(select)
    .order("created_at", { ascending: false });

  // Appliquer les filtres
  if (filters?.search) {
    query = query.or(
      `numero.ilike.%${filters.search}%,titre.ilike.%${filters.search}%`,
    );
  }

  if (filters?.statut) {
    query = query.eq("statut", filters.statut);
  }

  if (filters?.priorite) {
    query = query.eq("priorite", filters.priorite);
  }

  if (filters?.client_id) {
    query = query.eq("client_id", filters.client_id);
  }

  if (filters?.projet_id) {
    query = query.eq("projet_id", filters.projet_id);
  }

  if (filters?.contrat_id) {
    query = query.eq("contrat_id", filters.contrat_id);
  }

  if (filters?.date_emission_from) {
    query = query.gte("date_emission", filters.date_emission_from);
  }

  if (filters?.date_emission_to) {
    query = query.lte("date_emission", filters.date_emission_to);
  }

  if (filters?.date_echeance_from) {
    query = query.gte("date_echeance", filters.date_echeance_from);
  }

  if (filters?.date_echeance_to) {
    query = query.lte("date_echeance", filters.date_echeance_to);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des factures: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les factures impayées
export async function getUnpaidInvoices() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      client:client_id (*),
      projet:projet_id (*)
    `,
    )
    .eq("statut", "Impayée")
    .order("date_echeance", { ascending: true });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des factures impayées: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les factures d'un contrat
export async function getInvoicesByContrat(contratId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      client:client_id (*)
    `,
    )
    .eq("contrat_id", contratId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des factures du contrat: ${error.message}`,
    );
  }

  return data;
}
