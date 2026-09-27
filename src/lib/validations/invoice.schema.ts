// import { z } from "zod";

// export const invoiceSchema = z.object({
//   numero: z.string().optional().nullable(),
//   client_id: z.string().uuid("ID client invalide").optional().nullable(),
//   projet_id: z.string().uuid("ID projet invalide").optional().nullable(),
//   contrat_id: z.string().uuid("ID contrat invalide").optional().nullable(),
//   titre: z.string().optional().nullable(),
//   statut: z
//     .enum(["Brouillon", "Envoyée", "Payée", "Impayée", "Annulée"])
//     .default("Brouillon"),
//   priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
//   montant_total: z
//     .number()
//     .positive("Le montant doit être positif")
//     .optional()
//     .nullable(),
//   date_emission: z.string().date("Date invalide").optional().nullable(),
//   date_echeance: z.string().date("Date invalide").optional().nullable(),
//   date_paiement: z.string().date("Date invalide").optional().nullable(),
//   contenu: z.array(z.any()).optional().nullable(),
//   conditions: z.string().optional().nullable(),
//   notes: z.string().optional().nullable(),
// });

import { z } from "zod";

export const invoiceLineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "La description est obligatoire"),
  quantity: z.number().positive("La quantité doit être supérieure à 0"),
  unitPrice: z.number().nonnegative("Le prix unitaire ne peut pas être négatif"),
});

export const invoiceFromDetailsSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().email("Email invalide").or(z.literal("")),
  phone: z.string().optional().default(""),
  website: z.string().optional().default(""),
  addressLines: z.array(z.string()).optional().default([]),
  taxId: z.string().optional().default(""),
  paymentAccountName: z.string().optional().default(""),
  routingNumber: z.string().optional().default(""),
  issuerName: z.string().optional().default(""),
});

export const invoiceToDetailsSchema = z.object({
  id: z.string(),
  nom: z.string().min(1, "Le nom du client est obligatoire"),
  email: z.string().email("Email invalide").or(z.literal("")),
});

export const invoiceSchema = z.object({
  client_id: z.string().min(1, "Le client est obligatoire"),
  projet_id: z.string().optional().or(z.literal("")),
  contrat_id: z.string().optional().or(z.literal("")),
  titre: z.string().min(1, "Le titre est obligatoire"),
  statut: z.enum(["Brouillon", "Envoyée", "Payée", "Impayée", "Annulée"]),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]),
  montant_total: z.number().nonnegative().optional().default(0),
  date_emission: z.string().min(1, "Date d'émission obligatoire"),
  date_echeance: z.string().min(1, "Date d'échéance obligatoire"),
  date_paiement: z.string().optional(),
  contenu: z.array(invoiceLineItemSchema).min(1, "Au moins une ligne est obligatoire"),
  conditions: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  from: invoiceFromDetailsSchema,
  to: invoiceToDetailsSchema,
});

export const invoiceUpdateSchema = invoiceSchema.partial();
export const invoiceStatusUpdateSchema = z.object({
  statut: z.enum(["Brouillon", "Envoyée", "Payée", "Impayée", "Annulée"]),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
export type InvoiceUpdateInput = z.infer<typeof invoiceUpdateSchema>;
export type InvoiceStatusUpdateInput = z.infer<
  typeof invoiceStatusUpdateSchema
>;
