"use server";

import { createServerClient } from "@/lib/supabase/server";
import { getDevi } from "./get-devi";
import { z } from "zod";

const generateDevisPDFSchema = z.object({
  id: z.string().uuid("ID devis invalide"),
});

export async function generateDevisPDF(id: string) {
  const supabase = await createServerClient();

  const validated = generateDevisPDFSchema.safeParse({ id });

  if (!validated.success) {
    throw new Error(
      validated.error.flatten().fieldErrors.id?.join(", ") || "ID invalide",
    );
  }

  // Récupérer le devis avec toutes ses relations
  const devis = await getDevi(id, {
    includeClient: true,
    includeProjet: true,
    includeContrat: false,
  });

  if (!devis) {
    throw new Error("Devis non trouvé");
  }

  // Vérifier que l'utilisateur a accès au devis
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Non authentifié");
  }

  // Ici, on génère le PDF
  // Pour l'instant, on retourne les données pour le template
  return {
    devis,
    user: {
      name: user.user_metadata?.nom || user.email,
    },
  };
}

// Alternative : générer le PDF avec une bibliothèque comme @react-pdf/renderer ou puppeteer
export async function generateDevisPDFBuffer(id: string) {
  // À implémenter avec une bibliothèque PDF
  // Retourner un Buffer pour le téléchargement
  throw new Error("Fonction à implémenter avec une bibliothèque PDF");
}
