import type { Devis } from "@/types/database";
import { addDays, format } from "date-fns";

// ============ TYPES ============
export type DevisStatus = "Brouillon" | "Envoyé" | "Accepté" | "Refusé";
export type DevisPriority = "Haute" | "Moyenne" | "Basse";

export interface DevisLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface DevisTaxOption {
  id: string;
  name: string;
  rate: number;
}

export type DevisDiscountType = "fixed" | "percent";

export interface DevisFromDetails {
  name: string;
  email: string;
  phone: string;
  website: string;
  addressLines: string[];
  taxId: string;
  issuerName: string;
  signature: string;
}

export interface DevisToDetails {
  id: string;
  name: string;
  email: string;
  addressLines: string[];
  taxId: string;
  telephone: string;
}

export interface DevisFormValues {
  id: string;
  numero: string;
  issuedDate: string;
  validiteDate: string;
  from: DevisFromDetails;
  to: DevisToDetails;
  taxId: string;
  discountType: DevisDiscountType;
  discountValue: number;
  items: DevisLineItem[];
  notes: string;
  conditions: string;
}

// ============ CONSTANTES ============
const today = new Date();

export const devisTaxOptions: DevisTaxOption[] = [
  { id: "tva", name: "TVA", rate: 19.25 },
  { id: "tva-reduite", name: "TVA Réduite", rate: 5.5 },
  { id: "aucune", name: "Aucune taxe", rate: 0 },
];

export const devisClients: DevisToDetails[] = [
  {
    id: "groupe-banto",
    name: "Groupe Banto",
    email: "contact@groupebanto.cm",
    telephone: "+237 6XX XXX XXX",
    addressLines: ["BP 1234", "Douala", "Cameroun"],
    taxId: "RC-123456789",
  },
  {
    id: "hotel-royal",
    name: "Hôtel Royal",
    email: "direction@hotelroyal.cm",
    telephone: "+237 6XX XXX XXX",
    addressLines: ["BP 5678", "Douala", "Cameroun"],
    taxId: "RC-987654321",
  },
  {
    id: "hopital-central",
    name: "Hôpital Central",
    email: "achats@hopitalcentral.cm",
    telephone: "+237 6XX XXX XXX",
    addressLines: ["BP 9012", "Yaoundé", "Cameroun"],
    taxId: "RC-456789123",
  },
  {
    id: "mairie-douala",
    name: "Mairie Douala",
    email: "marches@mairiedouala.cm",
    telephone: "+237 6XX XXX XXX",
    addressLines: ["BP 3456", "Douala", "Cameroun"],
    taxId: "RC-789123456",
  },
];

export const defaultDevisValues: DevisFormValues = {
  id: "",
  numero: `DEV-${format(today, "yyyy")}-001`,
  issuedDate: format(today, "yyyy-MM-dd"),
  validiteDate: format(addDays(today, 30), "yyyy-MM-dd"),
  from: {
    name: "Zoldick Entreprise",
    email: "contact@zoldick.cm",
    phone: "+237 6XX XXX XXX",
    website: "www.zoldick.cm",
    addressLines: ["BP 7890", "Douala", "Cameroun"],
    taxId: "RC-123456789",
    issuerName: "Nanga Doumer",
    signature: "Nanga Doumer",
  },
  to: devisClients[0],
  taxId: "tva",
  discountType: "fixed",
  discountValue: 0,
  items: [
    {
      id: "item-1",
      description: "Prestation de service",
      quantity: 1,
      unitPrice: 1000000,
    },
  ],
  notes:
    "Merci de nous faire part de votre décision dans les meilleurs délais.",
  conditions: "Devis valable 30 jours. Paiement à 30 jours fin de mois.",
};

// ============ DONNÉES MOCKÉES DE FALLBACK ============
export const fallbackDevis: Devis[] = [
  {
    id: "DEV-001",
    numero: "DEV-2026-001",
    client_id: null,
    projet_id: null,
    titre: "Construction Immeuble Banto",
    statut: "Accepté",
    priorite: "Haute",
    montant_total: 85000000,
    date_emission: "2026-01-10",
    date_validite: "2026-02-10",
    contenu: [],
    conditions: "",
    notes: "",
    taxe_id: "tva",
    created_at: "",
    updated_at: "",
  },
  {
    id: "DEV-002",
    numero: "DEV-2026-002",
    client_id: null,
    projet_id: null,
    titre: "Rénovation Hôtel Royal",
    statut: "Accepté",
    priorite: "Haute",
    montant_total: 42500000,
    date_emission: "2026-02-25",
    date_validite: "2026-03-25",
    contenu: [],
    conditions: "",
    notes: "",
    taxe_id: "tva",
    created_at: "",
    updated_at: "",
  },
  {
    id: "DEV-003",
    numero: "DEV-2026-003",
    client_id: null,
    projet_id: null,
    titre: "Extension Hôpital Central",
    statut: "Envoyé",
    priorite: "Haute",
    montant_total: 120000000,
    date_emission: "2026-03-15",
    date_validite: "2026-04-15",
    contenu: [],
    conditions: "",
    notes: "",
    taxe_id: "tva",
    created_at: "",
    updated_at: "",
  },
  {
    id: "DEV-004",
    numero: "DEV-2026-004",
    client_id: null,
    projet_id: null,
    titre: "Construction Marché Municipal",
    statut: "Envoyé",
    priorite: "Moyenne",
    montant_total: 65000000,
    date_emission: "2026-05-20",
    date_validite: "2026-06-20",
    contenu: [],
    conditions: "",
    notes: "",
    taxe_id: "tva",
    created_at: "",
    updated_at: "",
  },
  {
    id: "DEV-005",
    numero: "DEV-2026-005",
    client_id: null,
    projet_id: null,
    titre: "Complexe Sportif",
    statut: "Brouillon",
    priorite: "Haute",
    montant_total: 95000000,
    date_emission: "2026-05-01",
    date_validite: "2026-06-01",
    contenu: [],
    conditions: "",
    notes: "",
    taxe_id: "tva",
    created_at: "",
    updated_at: "",
  },
  {
    id: "DEV-006",
    numero: "DEV-2026-006",
    client_id: null,
    projet_id: null,
    titre: "Rénovation SIEM",
    statut: "Refusé",
    priorite: "Basse",
    montant_total: 15000000,
    date_emission: "2026-01-15",
    date_validite: "2026-02-15",
    contenu: [],
    conditions: "",
    notes: "",
    taxe_id: "tva",
    created_at: "",
    updated_at: "",
  },
];

// ============ FONCTIONS UTILES ============
export function getLineAmount(item?: DevisLineItem) {
  if (!item) return 0;
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;
  return quantity * unitPrice;
}

export function getDevisItems(devis: DevisFormValues) {
  return devis.items;
}

export function getDevisSubtotal(devis: DevisFormValues) {
  return getDevisItems(devis).reduce(
    (subtotal, item) => subtotal + getLineAmount(item),
    0,
  );
}

export function getDevisTaxOption(devis: DevisFormValues) {
  return (
    devisTaxOptions.find((taxOption) => taxOption.id === devis.taxId) ??
    devisTaxOptions[0]
  );
}

export function getDevisTax(devis: DevisFormValues) {
  const taxRate = getDevisTaxOption(devis).rate;
  return (
    Math.max(getDevisSubtotal(devis) - getDevisDiscount(devis), 0) *
    (taxRate / 100)
  );
}

export function getDevisDiscount(devis: DevisFormValues) {
  const subtotal = getDevisSubtotal(devis);
  const discountValue = Number.isFinite(devis.discountValue)
    ? devis.discountValue
    : 0;
  const discount =
    devis.discountType === "percent"
      ? subtotal * (discountValue / 100)
      : discountValue;
  return Math.min(Math.max(discount, 0), subtotal);
}

export function getDevisTotal(devis: DevisFormValues) {
  return (
    Math.max(getDevisSubtotal(devis) - getDevisDiscount(devis), 0) +
    getDevisTax(devis)
  );
}

// Fonctions pour les statistiques
export function getDevisByStatus(devis: Devis[], statut: string) {
  return devis.filter((d) => d.statut === statut);
}

export function getDevisAcceptes(devis: Devis[]) {
  return getDevisByStatus(devis, "Accepté");
}

export function getDevisEnAttente(devis: Devis[]) {
  return getDevisByStatus(devis, "Envoyé");
}
