import { z } from "zod";

export const devisLineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "La description est requise"),
  quantity: z.number().positive("La quantité doit être positive"),
  unitPrice: z.number().positive("Le prix unitaire doit être positif"),
});

export const devisSchema = z.object({
  client_id: z.string().uuid("ID client invalide").optional().nullable(),
  projet_id: z.string().uuid("ID projet invalide").optional().nullable(),
  titre: z.string().optional().nullable(),
  statut: z
    .enum(["Brouillon", "Envoyé", "Accepté", "Refusé"])
    .default("Brouillon"),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
  montant_total: z
    .number()
    .positive("Le montant doit être positif")
    .optional()
    .nullable(),
  date_emission: z.string().date("Date invalide").optional().nullable(),
  date_validite: z.string().date("Date invalide").optional().nullable(),
  contenu: z.array(devisLineItemSchema).optional().nullable(),
  conditions: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  taxe_id: z.string().default("tva"),
});

export const devisUpdateSchema = devisSchema.partial();
export const devisStatusUpdateSchema = z.object({
  statut: z.enum(["Brouillon", "Envoyé", "Accepté", "Refusé"]),
});

export type DevisLineItemInput = z.infer<typeof devisLineItemSchema>;
export type DevisInput = z.infer<typeof devisSchema>;
export type DevisUpdateInput = z.infer<typeof devisUpdateSchema>;
export type DevisStatusUpdateInput = z.infer<typeof devisStatusUpdateSchema>;
