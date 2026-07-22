"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getTransactionSchema = z.object({
  id: z.string().uuid("ID transaction invalide"),
  includeProjet: z.boolean().default(true),
  includeResponsable: z.boolean().default(true),
  includeInvoice: z.boolean().default(false),
});

export async function getTransaction(
  id: string,
  options?: {
    includeProjet?: boolean;
    includeResponsable?: boolean;
    includeInvoice?: boolean;
  },
) {
  const supabase = await createServerClient();

  const validated = getTransactionSchema.safeParse({
    id,
    includeProjet: options?.includeProjet ?? true,
    includeResponsable: options?.includeResponsable ?? true,
    includeInvoice: options?.includeInvoice ?? false,
  });

  if (!validated.success) {
    throw new Error(
      validated.error.flatten().fieldErrors.id?.join(", ") || "ID invalide",
    );
  }

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (validated.data.includeProjet) {
    relations.push("projet:projet_id (*)");
  }

  if (validated.data.includeResponsable) {
    relations.push("responsable_member:responsable (*)");
  }

  if (validated.data.includeInvoice) {
    relations.push("invoice:invoice_id (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(select)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération de la transaction: ${error.message}`,
    );
  }

  return data;
}
