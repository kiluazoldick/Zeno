"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  invoiceSchema,
  type InvoiceInput,
} from "@/lib/validations/invoice.schema";
import { revalidatePath } from "next/cache";

export async function createInvoice(data: InvoiceInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = invoiceSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le client existe si fourni
    if (validated.data.client_id) {
      const { data: client, error: clientError } = await adminClient
        .from("clients")
        .select("id")
        .eq("id", validated.data.client_id)
        .single();

      if (clientError || !client) {
        return {
          success: false,
          error: { client_id: ["Client non trouvé"] },
        };
      }
    }

    // Vérifier que le projet existe si fourni
    if (validated.data.projet_id) {
      const { data: project, error: projectError } = await adminClient
        .from("projects")
        .select("id")
        .eq("id", validated.data.projet_id)
        .single();

      if (projectError || !project) {
        return {
          success: false,
          error: { projet_id: ["Projet non trouvé"] },
        };
      }
    }

    // Vérifier que le contrat existe et est signé si fourni
    if (validated.data.contrat_id) {
      const { data: contrat, error: contratError } = await adminClient
        .from("contrats")
        .select("id, statut")
        .eq("id", validated.data.contrat_id)
        .single();

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
            contrat_id: ["Le contrat doit être signé pour créer une facture"],
          },
        };
      }
    }

    // Calculer le montant total si non fourni
    let montantTotal = validated.data.montant_total;
    if (!montantTotal && validated.data.contenu) {
      montantTotal = validated.data.contenu.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
        0,
      );
    }

    // Créer la facture
    const { data: invoice, error } = await adminClient
      .from("invoices")
      .insert({
        client_id: validated.data.client_id || null,
        projet_id: validated.data.projet_id || null,
        contrat_id: validated.data.contrat_id || null,
        titre: validated.data.titre || null,
        statut: validated.data.statut || "Brouillon",
        priorite: validated.data.priorite || "Moyenne",
        montant_total: montantTotal || null,
        date_emission: validated.data.date_emission || null,
        date_echeance: validated.data.date_echeance || null,
        date_paiement: validated.data.date_paiement || null,
        contenu: validated.data.contenu || null,
        conditions: validated.data.conditions || null,
        notes: validated.data.notes || null,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/invoice");
    if (validated.data.projet_id) {
      revalidatePath(`/dashboard/projects/${validated.data.projet_id}`);
    }
    if (validated.data.contrat_id) {
      revalidatePath(`/dashboard/contrats/${validated.data.contrat_id}`);
    }

    return {
      success: true,
      data: invoice,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
