import { z } from "zod";

const normalizeEmptyString = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

const optionalStringSchema = z.preprocess(
  normalizeEmptyString,
  z.string().optional().nullable(),
);

const optionalNonEmptyStringSchema = (message: string) =>
  z.preprocess(
    normalizeEmptyString,
    z.string().min(1, message).optional().nullable(),
  );

const optionalEmailSchema = z.preprocess(
  normalizeEmptyString,
  z.string().email("Email invalide").optional().nullable(),
);

const optionalDateSchema = z.preprocess(
  normalizeEmptyString,
  z.string().date("Date invalide").optional().nullable(),
);

const entrepriseSchema = z.object({
  name: optionalNonEmptyStringSchema("Nom requis"),
  issuerName: optionalNonEmptyStringSchema("Nom requis"),
  email: optionalEmailSchema,
  addressLines: z.array(optionalStringSchema),
  website: optionalStringSchema,
  phone: optionalStringSchema,
  taxId: optionalStringSchema,
  signature: optionalStringSchema,
});

const clientSchema = z.object({
  name: optionalStringSchema,
  addressLines: z.array(optionalStringSchema),
  telephone: optionalStringSchema,
  email: optionalEmailSchema,
  taxId: optionalStringSchema,
});

const livableSchema = z.object({
  name: optionalStringSchema,
});

const prestationSchema = z.object({
  title: optionalNonEmptyStringSchema("Titre requis").optional(),
  items: z.array(optionalNonEmptyStringSchema("Élément requis")).min(1, "Au moins un élément").optional().nullable(),
});

const paiementSchema = z.object({
  label: optionalStringSchema,
  percentage: z.number().min(0).max(100).optional(),
  montant: z.number().min(0).optional(),
});

export const contratSchema = z.object({
  numero: z.string().optional().nullable(),
  client_id: z.string().uuid("ID client invalide").optional().nullable(),
  project_id: z.string().uuid("ID projet invalide").optional().nullable(),
  devis_id: z.string().uuid("ID devis invalide").optional().nullable(),
  titre: optionalStringSchema,
  statut: z.enum(["Brouillon", "En cours", "Signé", "Annulé"]).default("Brouillon"),
  priorite: z.enum(["Haute", "Moyenne", "Basse"]).default("Moyenne"),
  montant_total: z.coerce.number().min(0, "Le montant doit être positif").optional().nullable(),
  date_emission: optionalDateSchema,
  date_signature: optionalDateSchema,
  date_debut: optionalDateSchema,
  date_fin: optionalDateSchema,
  from: entrepriseSchema,
  to: clientSchema,
  taxId: optionalStringSchema,
  prestations: z.array(prestationSchema).optional().nullable(),
  paiements: z.array(paiementSchema).optional().nullable(),
  livrables: z.array(livableSchema).optional().nullable(),
}).superRefine((data, ctx) => {
  const paiements = data.paiements ?? [];

  const total = paiements.reduce(
    (sum, payment) => sum + Number(payment.percentage ?? 0),
    0
  );

  const hasPercentage = paiements.some(
    (payment) =>
      payment.percentage !== undefined &&
      payment.percentage > 0
  );

  if (hasPercentage && Math.abs(total - 100) > 0.01) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Le total des paiements doit être égal à 100%",
      path: ["paiements"],
    });
  }

  const dateDebut = data.date_debut
    ? new Date(data.date_debut)
    : null;

  const dateFin = data.date_fin
    ? new Date(data.date_fin)
    : null;

  if (dateDebut && dateFin && dateFin < dateDebut) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La date de fin doit être après la date de début",
      path: ["date_fin"],
    });
  }
});

export const contratUpdateSchema = contratSchema;
export const contratStatusUpdateSchema = z.object({
  statut: z.enum(["Brouillon", "En cours", "Signé", "Annulé"]),
});

export type ContratInput = z.infer<typeof contratSchema>;
export type ContratUpdateInput = z.infer<typeof contratUpdateSchema>;
export type ContratStatusUpdateInput = z.infer<
  typeof contratStatusUpdateSchema
>;
