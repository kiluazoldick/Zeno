import { z } from "zod";

export const annonceSchema = z.object({
  titre: z.string().min(2, "Le titre est requis"),
  contenu: z.string().min(10, "Le contenu est requis"),
  auteur: z.string().uuid("ID membre invalide").optional().nullable(),
  importance: z.enum(["Haute", "Normale", "Basse"]).default("Normale"),
  statut: z.enum(["Brouillon", "Publiée", "Archivée"]).default("Brouillon"),
  date_reunion: z.string().date("Date invalide").optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
});

export const annonceUpdateSchema = annonceSchema.partial();
export const annonceStatusUpdateSchema = z.object({
  statut: z.enum(["Brouillon", "Publiée", "Archivée"]),
});

export type AnnonceInput = z.infer<typeof annonceSchema>;
export type AnnonceUpdateInput = z.infer<typeof annonceUpdateSchema>;
export type AnnonceStatusUpdateInput = z.infer<
  typeof annonceStatusUpdateSchema
>;
