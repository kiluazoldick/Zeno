"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Schéma pour les filtres
const getClientsFiltersSchema = z.object({
  search: z.string().optional(),
  secteur: z.string().optional(),
  ville: z.string().optional(),
  hasProjects: z.boolean().optional(),
  includeProjects: z.boolean().default(false),
});

export type GetClientsFilters = z.infer<typeof getClientsFiltersSchema>;

export async function getClients(filters?: GetClientsFilters) {
  const supabase = await createServerClient();

  // Construire la sélection
  let select = "*";
  if (filters?.includeProjects) {
    select = `*, projects (*)`;
  }

  let query = supabase
    .from("clients")
    .select(select)
    .order("nom", { ascending: true });

  // Appliquer les filtres
  if (filters?.search) {
    query = query.or(
      `nom.ilike.%${filters.search}%,email.ilike.%${filters.search}%,telephone.ilike.%${filters.search}%`,
    );
  }

  if (filters?.secteur) {
    query = query.eq("secteur", filters.secteur);
  }

  if (filters?.ville) {
    query = query.ilike("ville", `%${filters.ville}%`);
  }

  // Filtrer par projets
  if (filters?.hasProjects !== undefined) {
    if (filters.hasProjects) {
      // Utiliser une sous-requête pour les clients avec projets
      const { data: clientsWithProjects } = await supabase
        .from("projects")
        .select("client_id")
        .not("client_id", "is", null);

      const clientIds = clientsWithProjects?.map((p) => p.client_id) || [];

      if (clientIds.length > 0) {
        query = query.in("id", clientIds);
      } else {
        query = query.eq("id", "00000000-0000-0000-0000-000000000000"); // Aucun résultat
      }
    } else {
      // Clients sans projets
      const { data: clientsWithProjects } = await supabase
        .from("projects")
        .select("client_id")
        .not("client_id", "is", null);

      const clientIds = clientsWithProjects?.map((p) => p.client_id) || [];

      if (clientIds.length > 0) {
        query = query.not("id", "in", `(${clientIds.join(",")})`);
      }
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des clients: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les secteurs d'activité distincts
export async function getClientSectors() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("clients")
    .select("secteur")
    .not("secteur", "is", null)
    .order("secteur", { ascending: true });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des secteurs: ${error.message}`,
    );
  }

  const sectors = [...new Set(data.map((d) => d.secteur).filter(Boolean))];
  return sectors;
}

// Récupérer les villes distinctes
export async function getClientCities() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("clients")
    .select("ville")
    .not("ville", "is", null)
    .order("ville", { ascending: true });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des villes: ${error.message}`,
    );
  }

  const cities = [...new Set(data.map((d) => d.ville).filter(Boolean))];
  return cities;
}
