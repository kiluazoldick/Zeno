"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getDeviSchema = z.object({
  id: z.string().uuid("ID devis invalide"),
  includeClient: z.boolean().default(true),
  includeProjet: z.boolean().default(true),
  includeContrat: z.boolean().default(false),
});

export async function getDevi(
  id: string,
  options?: {
    includeClient?: boolean;
    includeProjet?: boolean;
    includeContrat?: boolean;
  },
) {
  const supabase = await createServerClient();

  const validated = getDeviSchema.safeParse({
    id,
    includeClient: options?.includeClient ?? true,
    includeProjet: options?.includeProjet ?? true,
    includeContrat: options?.includeContrat ?? false,
  });

  if (!validated.success) {
    throw new Error(
      validated.error.flatten().fieldErrors.id?.join(", ") || "ID invalide",
    );
  }

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (validated.data.includeClient) {
    relations.push("client:client_id (*)");
  }

  if (validated.data.includeProjet) {
    relations.push("projet:projet_id (*)");
  }

  if (validated.data.includeContrat) {
    relations.push("contrat:contrats (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  const { data, error } = await supabase
    .from("devis")
    .select(select)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération du devis: ${error.message}`,
    );
  }

  return data;
}

// Récupérer un devis par numéro
export async function getDeviByNumero(numero: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("devis")
    .select(
      `
      *,
      client:client_id (*),
      projet:projet_id (*)
    `,
    )
    .eq("numero", numero)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération du devis: ${error.message}`,
    );
  }

  return data;
}
