import { z } from "zod";

export const clientSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().nullable(),
  telephone: z.string().optional().nullable(),
  adresse: z.string().optional().nullable(),
  secteur: z.string().optional().nullable(),
  code_postal: z.string().optional().nullable(),
  ville: z.string().optional().nullable(),
  pays: z.string().default("Cameroun"),
  tax_id: z.string().optional().nullable(),
});

export const clientUpdateSchema = clientSchema.partial();

export type ClientInput = z.infer<typeof clientSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
