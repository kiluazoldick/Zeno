import { z } from "zod";

export const devisLineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "La description est requise"),
  quantity: z.number().positive("La quantité doit être positive"),
  unitPrice: z.number().positive("Le prix unitaire doit être positif"),
});

export const devisSchema = z.object({
  numero: z.string().optional(),
  client_id: z.string().uuid("ID client invalide").optional(),
  client_nom: z.string().optional(),
  projet_nom: z.string().optional(),
  projet_id: z.string().uuid("ID projet invalide").optional(),
  titre: z.string().optional(),
  statut: z
    .enum(["Brouillon", "Envoyé", "Accepté", "Refusé"])
    .default("Brouillon"),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
  montant_total: z
    .number()
    .positive("Le montant doit être positif")
    .optional(),
  date_emission: z.string().date("Date invalide").optional(),
  date_validite: z.string().date("Date invalide").optional(),
  contexte: z.string().optional(),
  objectifs: z.string().nullable().optional(),
  architecture: z.string().nullable().optional(),
  modalites_paiement: z.string().nullable().optional(),
  contenu: z
    .array(
      z.object({
        description: z.string(),
        quantite: z.number(),
        prix_unitaire: z.number(),
      }),
    )
    .default([]),
  prestations: z
    .array(
      z.object({
        titre: z.string(),
        description: z.string(),
      }),
    )
    .default([]),
  planning: z
    .array(
      z.object({
        semaine: z.string(),
        taches: z.string(),
      }),
    )
    .default([]),
  conditions: z.string().optional(),
  notes: z.string().optional(),
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
