"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Schéma pour les filtres
const getDevisFiltersSchema = z.object({
  search: z.string().optional(),
  statut: z.enum(["Brouillon", "Envoyé", "Accepté", "Refusé"]).optional(),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).optional(),
  client_id: z.string().uuid("ID client invalide").optional(),
  projet_id: z.string().uuid("ID projet invalide").optional(),
  date_emission_from: z.string().date("Date invalide").optional(),
  date_emission_to: z.string().date("Date invalide").optional(),
  includeClient: z.boolean().default(true),
  includeProjet: z.boolean().default(true),
  includeContrat: z.boolean().default(false),
});

export type GetDevisFilters = z.infer<typeof getDevisFiltersSchema>;

export async function getDevis(filters?: GetDevisFilters) {
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
    relations.push("contrat:contrats (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  let query = supabase
    .from("devis")
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
      `Erreur lors de la récupération des devis: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les devis d'un client
export async function getDevisByClient(clientId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("devis")
    .select(
      `
      *,
      projet:projet_id (*)
    `,
    )
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des devis du client: ${error.message}`,
    );
  }

  return data;
}
