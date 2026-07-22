import { z } from "zod";

export const reportMetricsSchema = z.object({
  tachesCompletees: z.number().int().min(0),
  budgetUtilise: z.number().positive().optional(),
  budgetTotal: z.number().positive().optional(),
  progression: z.number().min(0).max(100).optional(),
});

export const reportSchema = z.object({
  titre: z.string().min(2, "Le titre est requis"),
  type: z.enum(["Quotidien", "Hebdomadaire", "Mensuel", "Réunion"]),
  projet_id: z.string().uuid("ID projet invalide").optional().nullable(),
  task_id: z.string().uuid("ID tâche invalide").optional().nullable(),
  auteur: z.string().uuid("ID membre invalide").optional().nullable(),
  periode: z.string().optional().nullable(),
  date_rapport: z.string().date("Date invalide"),
  statut: z
    .enum(["Brouillon", "En cours", "Validé", "Archivé"])
    .default("Brouillon"),
  description: z.string().optional().nullable(),
  contenu: z.string().optional().nullable(),
  metriques: reportMetricsSchema.optional().nullable(),
  prochaines_etapes: z.array(z.string()).optional().nullable(),
  problemes: z.array(z.string()).optional().nullable(),
});

export const reportUpdateSchema = reportSchema.partial();
export const reportStatusUpdateSchema = z.object({
  statut: z.enum(["Brouillon", "En cours", "Validé", "Archivé"]),
});

export type ReportMetricsInput = z.infer<typeof reportMetricsSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ReportUpdateInput = z.infer<typeof reportUpdateSchema>;
export type ReportStatusUpdateInput = z.infer<typeof reportStatusUpdateSchema>;
