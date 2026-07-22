"use server";

import { createServerClient } from "@/lib/supabase/server";
import { getInvoice } from "./get-invoice";
import { z } from "zod";

const generateInvoicePDFSchema = z.object({
  id: z.string().uuid("ID facture invalide"),
});

export async function generateInvoicePDF(id: string) {
  const supabase = await createServerClient();

  const validated = generateInvoicePDFSchema.safeParse({ id });

  if (!validated.success) {
    throw new Error(
      validated.error.flatten().fieldErrors.id?.join(", ") || "ID invalide",
    );
  }

  // Récupérer la facture avec toutes ses relations
  const invoice = await getInvoice(id, {
    includeClient: true,
    includeProjet: true,
    includeContrat: true,
    includeTransactions: true,
  });

  if (!invoice) {
    throw new Error("Facture non trouvée");
  }

  // Vérifier que l'utilisateur a accès à la facture
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Non authentifié");
  }

  // Ici, on génère le PDF
  return {
    invoice,
    user: {
      name: user.user_metadata?.nom || user.email,
    },
  };
}

// Alternative : générer le PDF avec une bibliothèque
export async function generateInvoicePDFBuffer(id: string) {
  // À implémenter avec une bibliothèque PDF
  throw new Error("Fonction à implémenter avec une bibliothèque PDF");
}
