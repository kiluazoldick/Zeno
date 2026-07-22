"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getContratSchema = z.object({
  id: z.string().uuid("ID contrat invalide"),
  includeClient: z.boolean().default(true),
  includeProjet: z.boolean().default(true),
  includeDevis: z.boolean().default(true),
  includeInvoices: z.boolean().default(true),
});

export async function getContrat(
  id: string,
  options?: {
    includeClient?: boolean;
    includeProjet?: boolean;
    includeDevis?: boolean;
    includeInvoices?: boolean;
  },
) {
  const supabase = await createServerClient();

  const validated = getContratSchema.safeParse({
    id,
    includeClient: options?.includeClient ?? true,
    includeProjet: options?.includeProjet ?? true,
    includeDevis: options?.includeDevis ?? true,
    includeInvoices: options?.includeInvoices ?? true,
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

  if (validated.data.includeDevis) {
    relations.push("devis:devis_id (*)");
  }

  if (validated.data.includeInvoices) {
    relations.push("invoices (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  const { data, error } = await supabase
    .from("contrats")
    .select(select)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération du contrat: ${error.message}`,
    );
  }

  return data;
}

// Récupérer un contrat par numéro
export async function getContratByNumero(numero: string) {
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
    .eq("numero", numero)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération du contrat: ${error.message}`,
    );
  }

  return data;
}
