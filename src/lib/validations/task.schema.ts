import { z } from "zod";

export const taskSchema = z.object({
  titre: z.string().min(2, "Le titre est requis"),
  description: z.string().optional().nullable(),
  projet_id: z.string().uuid("ID projet invalide").optional().nullable(),
  assigne_a: z.string().uuid("ID membre invalide").optional().nullable(),
  statut: z
    .enum(["À faire", "En cours", "Annulé", "Terminé"])
    .default("À faire"),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
  date_execution: z.string().date("Date invalide").optional().nullable(),
  lieu: z.string().optional().nullable(),
  rapport_effectue: z.boolean().default(false),
  tags: z.array(z.string()).optional().nullable(),
  position: z.number().int().default(0),
});

export const taskUpdateSchema = taskSchema.partial();

export type TaskInput = z.infer<typeof taskSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

// Schéma pour la mise à jour du statut uniquement
export const taskStatusUpdateSchema = z.object({
  statut: z.enum(["À faire", "En cours", "Annulé", "Terminé"]),
  position: z.number().int().optional(),
});
