"use server";

import { createServerClient } from "@/lib/supabase/server";
import { getContrat } from "./get-contrat";
import { z } from "zod";

const generateContratPDFSchema = z.object({
  id: z.string().uuid("ID contrat invalide"),
});

export async function generateContratPDF(id: string) {
  const supabase = await createServerClient();

  const validated = generateContratPDFSchema.safeParse({ id });

  if (!validated.success) {
    throw new Error(
      validated.error.flatten().fieldErrors.id?.join(", ") || "ID invalide",
    );
  }

  // Récupérer le contrat avec toutes ses relations
  const contrat = await getContrat(id, {
    includeClient: true,
    includeProjet: true,
    includeDevis: true,
    includeInvoices: true,
  });

  if (!contrat) {
    throw new Error("Contrat non trouvé");
  }

  // Vérifier que l'utilisateur a accès au contrat
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Non authentifié");
  }

  // Ici, on génère le PDF
  return {
    contrat,
    user: {
      name: user.user_metadata?.nom || user.email,
    },
  };
}

// Alternative : générer le PDF avec une bibliothèque
export async function generateContratPDFBuffer(id: string) {
  // À implémenter avec une bibliothèque PDF
  throw new Error("Fonction à implémenter avec une bibliothèque PDF");
}
