"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getInvoiceSchema = z.object({
  id: z.string().uuid("ID facture invalide"),
  includeClient: z.boolean().default(true),
  includeProjet: z.boolean().default(true),
  includeContrat: z.boolean().default(true),
  includeTransactions: z.boolean().default(false),
});

export async function getInvoice(
  id: string,
  options?: {
    includeClient?: boolean;
    includeProjet?: boolean;
    includeContrat?: boolean;
    includeTransactions?: boolean;
  },
) {
  const supabase = await createServerClient();

  const validated = getInvoiceSchema.safeParse({
    id,
    includeClient: options?.includeClient ?? true,
    includeProjet: options?.includeProjet ?? true,
    includeContrat: options?.includeContrat ?? true,
    includeTransactions: options?.includeTransactions ?? false,
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
    relations.push("contrat:contrat_id (*)");
  }

  if (validated.data.includeTransactions) {
    relations.push("transactions (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  const { data, error } = await supabase
    .from("invoices")
    .select(select)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération de la facture: ${error.message}`,
    );
  }

  return data;
}

// Récupérer une facture par numéro
export async function getInvoiceByNumero(numero: string) {
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
    .eq("numero", numero)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération de la facture: ${error.message}`,
    );
  }

  return data;
}
