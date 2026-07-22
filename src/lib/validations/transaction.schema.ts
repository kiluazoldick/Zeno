import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(2, "La description est requise"),
  type: z.enum([
    "Entrée Réalisée",
    "Dépense Réalisé",
    "Entrée Prévue",
    "Dépense Prévue",
  ]),
  montant: z.number().positive("Le montant doit être positif"),
  date_transaction: z.string().date("Date invalide"),
  responsable: z.string().uuid("ID membre invalide").optional().nullable(),
  projet_id: z.string().uuid("ID projet invalide").optional().nullable(),
  invoice_id: z.string().uuid("ID facture invalide").optional().nullable(),
  categorie: z.string().optional().nullable(),
  statut: z.enum(["Prévue", "Réalisée", "Annulée"]).default("Prévue"),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const transactionUpdateSchema = transactionSchema.partial();

export type TransactionInput = z.infer<typeof transactionSchema>;
export type TransactionUpdateInput = z.infer<typeof transactionUpdateSchema>;
