"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Schéma pour les filtres
const getAnnoncesFiltersSchema = z.object({
  search: z.string().optional(),
  importance: z.enum(["Haute", "Normale", "Basse"]).optional(),
  statut: z.enum(["Brouillon", "Publiée", "Archivée"]).optional(),
  auteur: z.string().uuid("ID membre invalide").optional(),
  tags: z.array(z.string()).optional(),
  date_from: z.string().date("Date invalide").optional(),
  date_to: z.string().date("Date invalide").optional(),
  includeAuteur: z.boolean().default(true),
  includeComments: z.boolean().default(false),
});

export type GetAnnoncesFilters = z.infer<typeof getAnnoncesFiltersSchema>;

export async function getAnnonces(filters?: GetAnnoncesFilters) {
  const supabase = await createServerClient();

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (filters?.includeAuteur) {
    relations.push("auteur_member:auteur (*)");
  }

  if (filters?.includeComments) {
    relations.push("comments (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  let query = supabase
    .from("annonces")
    .select(select)
    .order("date_annonce", { ascending: false });

  // Appliquer les filtres
  if (filters?.search) {
    query = query.or(
      `titre.ilike.%${filters.search}%,contenu.ilike.%${filters.search}%`,
    );
  }

  if (filters?.importance) {
    query = query.eq("importance", filters.importance);
  }

  if (filters?.statut) {
    query = query.eq("statut", filters.statut);
  }

  if (filters?.auteur) {
    query = query.eq("auteur", filters.auteur);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps("tags", filters.tags);
  }

  if (filters?.date_from) {
    query = query.gte("date_annonce", filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte("date_annonce", filters.date_to);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des annonces: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les annonces publiées (pour le fil d'actualité)
export async function getPublishedAnnonces() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("annonces")
    .select(
      `
      *,
      auteur_member:auteur (*)
    `,
    )
    .eq("statut", "Publiée")
    .order("date_annonce", { ascending: false });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des annonces publiées: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les annonces importantes (épinglées)
export async function getImportantAnnonces() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("annonces")
    .select(
      `
      *,
      auteur_member:auteur (*)
    `,
    )
    .eq("statut", "Publiée")
    .eq("importance", "Haute")
    .order("date_annonce", { ascending: false });

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des annonces importantes: ${error.message}`,
    );
  }

  return data;
}

// Récupérer les tags distincts
export async function getAnnonceTags() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("annonces")
    .select("tags")
    .not("tags", "is", null);

  if (error) {
    throw new Error(
      `Erreur lors de la récupération des tags: ${error.message}`,
    );
  }

  const allTags = data.flatMap((d) => d.tags || []).filter(Boolean);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags.sort();
}
