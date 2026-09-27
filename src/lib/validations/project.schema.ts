import { z } from "zod";

export const projectSchema = z.object({
  nom: z.string().min(2, "Le nom du projet est requis"),
  client_id: z.string().uuid("ID client invalide").optional().nullable(),
  description: z.string().optional().nullable(),
  statut: z
    .enum(["En cours", "En attente", "Terminé", "Annulé"])
    .optional(),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).optional(),
  budget_total: z
    .number()
    .positive("Le budget doit être positif")
    .optional()
    .nullable(),
  date_debut: z.string().date("Date invalide").optional().nullable(),
  date_fin: z.string().date("Date invalide").optional().nullable(),
  progression: z.number().min(0).max(100).optional(),
  location: z.string().optional().nullable(),
  documents: z.array(z.instanceof(File)).optional(),
});

export const projectUpdateSchema = projectSchema.partial();

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
