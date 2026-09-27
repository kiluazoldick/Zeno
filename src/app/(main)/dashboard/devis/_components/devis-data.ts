// src/app/(main)/dashboard/devis/_components/devis-data.ts
import type { Devis } from "@/types";
import { z } from "zod";
import  { devisSchema } from '@/lib/validations';

// Dimensions du papier A4 en pixels (pour l'aperçu)
export const DEVIS_PAPER_WIDTH = 794;
export const DEVIS_PAPER_HEIGHT = 1123;
export const DEVIS_PAPER_SCALE = 0.7;

export type DevisFormValues = z.infer<typeof devisSchema>;

// Fonctions utilitaires
export function getDevisItems(devis: DevisFormValues) {
  if (!devis) return [];
  return devis.contenu || [];
}

export function getDevisSubtotal(devis: DevisFormValues) {
  if (!devis) return 0;
  return getDevisItems(devis).reduce((sum, item) => {
    return sum + (item.quantite || 0) * (item.prix_unitaire || 0);
  }, 0);
}

export function getDevisTotal(devis: DevisFormValues) {
  return getDevisSubtotal(devis);
}

export function getLineAmount(item: {
  quantite: number;
  prix_unitaire: number;
}) {
  return (item.quantite || 0) * (item.prix_unitaire || 0);
}

export function formatDevisCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
