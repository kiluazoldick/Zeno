"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import {
  invoiceSchema,
  type InvoiceFormValues,
} from "@/lib/validations/invoice.schema";

/**
 * Génère le prochain numéro de facture
 * Format : FAC-2026-001
 */
async function generateInvoiceNumber(
  adminClient: Awaited<ReturnType<typeof createAdminClient>>,
) {
  const year = new Date().getFullYear();

  const { data: lastInvoice, error } = await adminClient
    .from("invoices")
    .select("numero")
    .like("numero", `FAC-${year}-%`)
    .order("numero", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("❌ Erreur récupération dernier numéro :", error);
    throw new Error("Impossible de générer le numéro de facture");
  }

  if (!lastInvoice?.numero) {
    return `FAC-${year}-001`;
  }

  const match = lastInvoice.numero.match(/^FAC-(\d{4})-(\d+)$/);

  if (!match) {
    return `FAC-${year}-001`;
  }

  const lastSequence = Number(match[2]);
  const nextSequence = lastSequence + 1;

  return `FAC-${year}-${String(nextSequence).padStart(3, "0")}`;
}

export async function createInvoice(data: InvoiceFormValues) {
  console.log("🚀 createInvoice appelée");

  const adminClient = await createAdminClient();

  // 1. Validation Zod
  const validated = invoiceSchema.safeParse(data);

  if (!validated.success) {
    console.error("❌ Validation Zod échouée :", validated.error.flatten());
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  const invoiceData = validated.data;

  // ============================================
  // EXTRACTION DU client_id depuis "to"
  // ============================================
  const clientId =
    (invoiceData as any).to?.id ??
    invoiceData.client_id ??
    null;

  console.log("✅ client_id extrait :", clientId);

  try {
    // 2. Vérification du client
    if (clientId) {
      const { data: client, error: clientError } = await adminClient
        .from("clients")
        .select("id")
        .eq("id", clientId)
        .maybeSingle();

      if (clientError) {
        console.error("❌ Erreur vérification client :", clientError);
        return {
          success: false,
          error: { client_id: ["Impossible de vérifier le client"] },
        };
      }

      if (!client) {
        return {
          success: false,
          error: { client_id: ["Client non trouvé"] },
        };
      }
    }

    // 3. Vérification du projet
    if (invoiceData.projet_id) {
      const { data: project, error: projectError } = await adminClient
        .from("projects")
        .select("id")
        .eq("id", invoiceData.projet_id)
        .maybeSingle();

      if (projectError || !project) {
        return {
          success: false,
          error: { projet_id: ["Projet non trouvé"] },
        };
      }
    }

    // 4. Vérification du contrat
    if (invoiceData.contrat_id) {
      const { data: contrat, error: contratError } = await adminClient
        .from("contrats")
        .select("id, statut")
        .eq("id", invoiceData.contrat_id)
        .maybeSingle();

      if (contratError || !contrat) {
        return {
          success: false,
          error: { contrat_id: ["Contrat non trouvé"] },
        };
      }

      if (contrat.statut !== "Signé" && contrat.statut !== "En cours") {
        return {
          success: false,
          error: {
            contrat_id: [
              "Le contrat doit être signé ou en cours pour créer une facture",
            ],
          },
        };
      }
    }

    // 5. Calcul du montant total
    const items = Array.isArray(invoiceData.contenu)
      ? invoiceData.contenu
      : [];

    const montantTotal = items.reduce((total: number, item: any) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return total + quantity * unitPrice;
    }, 0);

    // 6. Génération du numéro
    const numero = await generateInvoiceNumber(adminClient);

    // 7. Création de la facture
    const { data: invoice, error: invoiceError } = await adminClient
      .from("invoices")
      .insert({
        numero,
        client_id: clientId,                    // ← maintenant correctement rempli
        projet_id: invoiceData.projet_id || null,
        contrat_id: invoiceData.contrat_id || null,
        titre: invoiceData.titre || null,
        statut: invoiceData.statut || "Brouillon",
        priorite: invoiceData.priorite || "Moyenne",
        montant_total: montantTotal,
        date_emission: invoiceData.date_emission || null,
        date_echeance: invoiceData.date_echeance || null,
        date_paiement: invoiceData.date_paiement || null,
        contenu: invoiceData.contenu || [],
        conditions: invoiceData.conditions || null,
        notes: invoiceData.notes || null,
      })
      .select()
      .single();

    if (invoiceError) {
      console.error("❌ Erreur création facture :", invoiceError);
      return {
        success: false,
        error: { db: [invoiceError.message] },
      };
    }

    console.log("✅ Facture créée :", invoice);

    // 8. Revalidation
    revalidatePath("/dashboard/invoice");

    if (invoiceData.projet_id) {
      revalidatePath(`/dashboard/projects/${invoiceData.projet_id}`);
    }
    if (invoiceData.contrat_id) {
      revalidatePath(`/dashboard/contrats/${invoiceData.contrat_id}`);
    }

    return {
      success: true,
      data: invoice,
    };
  } catch (error) {
    console.error("❌ Erreur inattendue createInvoice :", error);
    return {
      success: false,
      error: {
        unexpected: [
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite",
        ],
      },
    };
  }
}