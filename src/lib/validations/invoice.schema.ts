import { z } from "zod";

export const invoiceSchema = z.object({
  client_id: z.string().uuid("ID client invalide").optional().nullable(),
  projet_id: z.string().uuid("ID projet invalide").optional().nullable(),
  contrat_id: z.string().uuid("ID contrat invalide").optional().nullable(),
  titre: z.string().optional().nullable(),
  statut: z
    .enum(["Brouillon", "Envoyée", "Payée", "Impayée", "Annulée"])
    .default("Brouillon"),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
  montant_total: z
    .number()
    .positive("Le montant doit être positif")
    .optional()
    .nullable(),
  date_emission: z.string().date("Date invalide").optional().nullable(),
  date_echeance: z.string().date("Date invalide").optional().nullable(),
  date_paiement: z.string().date("Date invalide").optional().nullable(),
  contenu: z.array(z.any()).optional().nullable(),
  conditions: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const invoiceUpdateSchema = invoiceSchema.partial();
export const invoiceStatusUpdateSchema = z.object({
  statut: z.enum(["Brouillon", "Envoyée", "Payée", "Impayée", "Annulée"]),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceUpdateInput = z.infer<typeof invoiceUpdateSchema>;
export type InvoiceStatusUpdateInput = z.infer<
  typeof invoiceStatusUpdateSchema
>;
