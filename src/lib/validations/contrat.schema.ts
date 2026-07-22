import { z } from "zod";

export const contratSchema = z.object({
  client_id: z.string().uuid("ID client invalide").optional().nullable(),
  projet_id: z.string().uuid("ID projet invalide").optional().nullable(),
  devis_id: z.string().uuid("ID devis invalide").optional().nullable(),
  titre: z.string().optional().nullable(),
  statut: z
    .enum(["Brouillon", "En cours", "Signé", "Annulé"])
    .default("Brouillon"),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
  montant_total: z
    .number()
    .positive("Le montant doit être positif")
    .optional()
    .nullable(),
  date_emission: z.string().date("Date invalide").optional().nullable(),
  date_signature: z.string().date("Date invalide").optional().nullable(),
  date_debut: z.string().date("Date invalide").optional().nullable(),
  date_fin: z.string().date("Date invalide").optional().nullable(),
  contenu: z.array(z.any()).optional().nullable(),
  conditions: z.string().optional().nullable(),
  clauses: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const contratUpdateSchema = contratSchema.partial();
export const contratStatusUpdateSchema = z.object({
  statut: z.enum(["Brouillon", "En cours", "Signé", "Annulé"]),
});

export type ContratInput = z.infer<typeof contratSchema>;
export type ContratUpdateInput = z.infer<typeof contratUpdateSchema>;
export type ContratStatusUpdateInput = z.infer<
  typeof contratStatusUpdateSchema
>;
