// src/app/(main)/dashboard/devis/_components/devis-data.ts
import type { Devis } from "@/types/database";

// Dimensions du papier A4 en pixels (pour l'aperçu)
export const DEVIS_PAPER_WIDTH = 794;
export const DEVIS_PAPER_HEIGHT = 1123;
export const DEVIS_PAPER_SCALE = 0.7;

export interface DevisFormValues {
  id?: string;
  numero: string;
  titre: string;
  client_id: string | null;
  projet_id: string | null;
  statut: "Brouillon" | "Envoyé" | "Accepté" | "Refusé";
  priorite: "Haute" | "Moyenne" | "Basse";
  montant_total: number | null;
  date_emission: string | null;
  date_validite: string | null;
  conditions: string | null;
  notes: string | null;
  contexte: string | null;
  objectifs: string | null;
  architecture: string | null;
  modalites_paiement: string | null;
  contenu: Array<{
    description: string;
    quantite: number;
    prix_unitaire: number;
  }>;
  prestations: Array<{
    titre: string;
    description: string;
  }>;
  planning: Array<{
    semaine: string;
    taches: string;
  }>;
  client_nom?: string | null;
  projet_nom?: string | null;
}

// Fonctions utilitaires
export function getDevisItems(devis: DevisFormValues | null | undefined) {
  if (!devis) return [];
  return devis.contenu || [];
}

export function getDevisSubtotal(devis: DevisFormValues | null | undefined) {
  if (!devis) return 0;
  return getDevisItems(devis).reduce((sum, item) => {
    return sum + (item.quantite || 0) * (item.prix_unitaire || 0);
  }, 0);
}

export function getDevisTotal(devis: DevisFormValues | null | undefined) {
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

export interface DevisFormValues {
  id?: string;
  numero: string;
  titre: string;
  client_id: string | null;
  projet_id: string | null;
  client_nom?: string | null;
  projet_nom?: string | null;
  statut: "Brouillon" | "Envoyé" | "Accepté" | "Refusé";
  priorite: "Haute" | "Moyenne" | "Basse";
  montant_total: number | null;
  date_emission: string | null;
  date_validite: string | null;
  conditions: string | null;
  notes: string | null;
  contexte: string | null;
  objectifs: string | null;
  architecture: string | null;
  modalites_paiement: string | null;
  contenu: Array<{
    description: string;
    quantite: number;
    prix_unitaire: number;
  }>;
  prestations: Array<{
    titre: string;
    description: string;
  }>;
  planning: Array<{
    semaine: string;
    taches: string;
  }>;
}
