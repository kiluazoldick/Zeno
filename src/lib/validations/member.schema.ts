import { z } from "zod";

export const memberSchema = z.object({
  email: z.string().email("Email invalide"),
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().optional().nullable(),
  role: z.enum([
    "direction",
    "finance",
    "commercial",
    "terrain",
    "bureau",
    "admin",
  ]),
  equipe: z
    .enum([
      "Direction",
      "Terrain",
      "Bureau",
      "Finance",
      "Commercial",
      "Rapport",
      "Admin",
    ])
    .optional()
    .nullable(),
  avatar_url: z.string().url("URL invalide").optional().nullable(),
  status: z
    .enum([
      "Actif",
      "Invitation en attente",
      "Désactivé",
      "Verrouillé",
      "Suspendu",
    ])
    .default("Actif"),
});

export const memberUpdateSchema = memberSchema.partial();

export type MemberInput = z.infer<typeof memberSchema>;
export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>;
