"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getAnnonceSchema = z.object({
  id: z.string().uuid("ID annonce invalide"),
  includeAuteur: z.boolean().default(true),
  includeComments: z.boolean().default(true),
});

export async function getAnnonce(
  id: string,
  options?: {
    includeAuteur?: boolean;
    includeComments?: boolean;
  },
) {
  const supabase = await createServerClient();

  const validated = getAnnonceSchema.safeParse({
    id,
    includeAuteur: options?.includeAuteur ?? true,
    includeComments: options?.includeComments ?? true,
  });

  if (!validated.success) {
    throw new Error(
      validated.error.flatten().fieldErrors.id?.join(", ") || "ID invalide",
    );
  }

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (validated.data.includeAuteur) {
    relations.push("auteur_member:auteur (*)");
  }

  if (validated.data.includeComments) {
    relations.push("comments (*, auteur_member:auteur (*))");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  const { data, error } = await supabase
    .from("annonces")
    .select(select)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération de l'annonce: ${error.message}`,
    );
  }

  return data;
}
