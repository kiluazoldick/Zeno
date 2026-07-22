"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Schéma pour les filtres
const getContratsFiltersSchema = z.object({
  search: z.string().optional(),
  statut: z.enum(["Brouillon", "En cours", "Signé", "Annulé"]).optional(),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).optional(),
  client_id: z.string().uuid("ID client invalide").optional(),
  projet_id: z.string().uuid("ID projet invalide").optional(),
  date_emission_from: z.string().date("Date invalide").optional(),
  date_emission_to: z.string().date("Date invalide").optional(),
  includeClient: z.boolean().default(true),
  includeProjet: z.boolean().default(true),
  includeDevis: z.boolean().default(false),
  includeInvoices: z.boolean().default(false),
});

export type GetContratsFilters = z.infer<typeof getContratsFiltersSchema>;

export async function getContrats(filters?: GetContratsFilters) {
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

  if (filters?.includeDevis) {
    relations.push("devis:devis_id (*)");
  }

  if (filters?.includeInvoices) {
    relations.push("invoices (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  let query = supabase
    .from("contrats")
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

  if (filters?.date_emission_from) {
    query = query.gte("date_emission", filters.date_emission_from);
  }

  if (filters?.date_emission_to) {
    query = query.lte("date_emission", filters.date_emission_to);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des contrats: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les contrats d'un projet
export async function getContratsByProject(projectId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("contrats")
    .select(
      `
      *,
      client:client_id (*),
      devis:devis_id (*)
    `,
    )
    .eq("projet_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des contrats du projet: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les contrats en cours
export async function getActiveContrats() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("contrats")
    .select(
      `
      *,
      client:client_id (*),
      projet:projet_id (*)
    `,
    )
    .eq("statut", "En cours")
    .order("date_debut", { ascending: true });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des contrats actifs: ${error.message}`,
    );
  }

  return data;
}
