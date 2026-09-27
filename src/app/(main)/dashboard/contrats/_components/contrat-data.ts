import { addDays, format } from "date-fns";
import type { Contrat } from "@/types";
import type { ContratInput } from "@/lib/validations";

// Dimensions du papier A4 en pixels (pour l'aperçu)
export const CONTRAT_PAPER_WIDTH = 794;
export const CONTRAT_PAPER_HEIGHT = 1123;
export const CONTRAT_PAPER_SCALE = 0.7;

// ============ TYPES ============
export type ContratStatus = "Brouillon" | "En cours" | "Signé" | "Annulé";
export type ContratPriority = "Haute" | "Moyenne" | "Basse";

export interface ContratLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ContratTaxOption {
  id: string;
  name: string;
  rate: number;
}

export type ContratDiscountType = "fixed" | "percent";

export interface ContratFromDetails {
  name: string;
  email: string;
  phone: string;
  website: string;
  addressLines: string[];
  taxId: string;
  issuerName: string;
  signature: string;
}

export interface ContratToDetails {
  id: string;
  name: string;
  email: string;
  addressLines: string[];
  taxId: string;
  telephone: string;
}

export interface ContratFormValues {
  id: string;
  numero: string;
 date: string;
  signatureDate: string;
  dateDebut: string;
  dateFin: string;
  from: ContratFromDetails;
  to: ContratToDetails;
  taxId: string;
  discountType: ContratDiscountType;
  montant_total: number;
  items: ContratLineItem[];
  notes: string;
  conditions: string;
  clauses: string;
}

// ============ CONSTANTES ============
const today = new Date();

export const contratTaxOptions: ContratTaxOption[] = [
  { id: "tva", name: "TVA", rate: 19.25 },
  { id: "tva-reduite", name: "TVA Réduite", rate: 5.5 },
  { id: "aucune", name: "Aucune taxe", rate: 0 },
];

const ContratFrom : ContratFromDetails = {
  name: "Zeno Solutions",
  issuerName: "Zeno Solutions",
  email: "contact@zenosolutions.cm",
  phone: "+237 6XX XXX XXX",
  website: "https://www.zenosolutions.cm",
  addressLines: ["BP 1234", "Douala", "Cameroun"],
  taxId: "RC-123456789",
  signature: "",
};

export const contratClients: ContratToDetails[] = [
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

export const defaultContratValues: ContratInput = {
  numero: undefined,
  project_id: undefined,
  client_id: undefined,
  devis_id: undefined,
  from: ContratFrom,
  prestations: [{ title: "", items: [""] }],
  livrables: [{ name: "" }],
  date_debut: undefined,
  date_fin: undefined,
  montant_total: 0,
  paiements: [{ 
    label: "", 
    percentage: 100,
    montant: 0 
  }],
  priorite: "Moyenne",
  statut: "Brouillon",
  taxId: "",
  titre: "",
  date_emission: format(today, "yyyy-MM-dd"),
  date_signature: undefined,
  to: {
    name: "",
    addressLines: [""],
    telephone: "",
    email: "",
    taxId: "",
  },
};

// ============ DONNÉES MOCKÉES DE FALLBACK ============
// export const fallbackContrats: Contrat[] = [
//   {
//     id: "CTR-001",
//     numero: "CTR-2026-001",
//     client_id: null,
//     projet_id: null,
//     devis_id: null,
//     titre: "Construction Immeuble Banto",
//     statut: "En cours",
//     priorite: "Haute",
//     montant_total: 85000000,
//     date_emission: "2026-02-15",
//     date_signature: "2026-03-15",
//     date_debut: "2026-03-15",
//     date_fin: "2027-03-15",
//     contenu: [],
//     conditions: "",
//     clauses: "",
//     notes: "",
//     created_at: "",
//     updated_at: "",
//   },
//   {
//     id: "CTR-002",
//     numero: "CTR-2026-002",
//     client_id: null,
//     projet_id: null,
//     devis_id: null,
//     titre: "Rénovation Hôtel Royal",
//     statut: "Signé",
//     priorite: "Haute",
//     montant_total: 42500000,
//     date_emission: "2026-04-01",
//     date_signature: "2026-04-15",
//     date_debut: "2026-04-15",
//     date_fin: "2026-10-15",
//     contenu: [],
//     conditions: "",
//     clauses: "",
//     notes: "",
//     created_at: "",
//     updated_at: "",
//   },
//   {
//     id: "CTR-003",
//     numero: "CTR-2026-003",
//     client_id: null,
//     projet_id: null,
//     devis_id: null,
//     titre: "Extension Hôpital Central",
//     statut: "Brouillon",
//     priorite: "Haute",
//     montant_total: 120000000,
//     date_emission: "2026-04-15",
//     date_signature: null,
//     date_debut: "2026-06-01",
//     date_fin: "2027-06-01",
//     contenu: [],
//     conditions: "",
//     clauses: "",
//     notes: "",
//     created_at: "",
//     updated_at: "",
//   },
//   {
//     id: "CTR-004",
//     numero: "CTR-2026-004",
//     client_id: null,
//     projet_id: null,
//     devis_id: null,
//     titre: "Complexe Sportif",
//     statut: "En cours",
//     priorite: "Haute",
//     montant_total: 95000000,
//     date_emission: "2026-06-01",
//     date_signature: "2026-06-15",
//     date_debut: "2026-06-15",
//     date_fin: "2027-06-15",
//     contenu: [],
//     conditions: "",
//     clauses: "",
//     notes: "",
//     created_at: "",
//     updated_at: "",
//   },
//   {
//     id: "CTR-005",
//     numero: "CTR-2026-005",
//     client_id: null,
//     projet_id: null,
//     devis_id: null,
//     titre: "Rénovation SIEM",
//     statut: "Annulé",
//     priorite: "Basse",
//     montant_total: 15000000,
//     date_emission: "2026-01-15",
//     date_signature: "2026-01-30",
//     date_debut: "2026-02-01",
//     date_fin: "2026-08-01",
//     contenu: [],
//     conditions: "",
//     clauses: "",
//     notes: "",
//     created_at: "",
//     updated_at: "",
//   },
// ];

// ============ COULEURS DES STATUTS ============
export const statusColors: Record<string, string> = {
  Brouillon: "border-muted-foreground/20 bg-muted text-muted-foreground",
  "En cours":
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Signé:
    "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
  Annulé: "border-destructive/20 bg-destructive/10 text-destructive",
};

// ============ FONCTIONS UTILES ============
export function getLineAmount(item?: ContratLineItem) {
  if (!item) return 0;
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;
  return quantity * unitPrice;
}

export function getContratItems(contrat: ContratFormValues) {
  return contrat.items;
}

export function getContratSubtotal(contrat: ContratFormValues) {
  return getContratItems(contrat).reduce(
    (subtotal, item) => subtotal + getLineAmount(item),
    0,
  );
}

export function getContratTaxOption(contrat: ContratFormValues) {
  return (
    contratTaxOptions.find((taxOption) => taxOption.id === contrat.taxId) ??
    contratTaxOptions[0]
  );
}

export function getContratTax(contrat: ContratFormValues) {
  const taxRate = getContratTaxOption(contrat).rate;
  return (
    Math.max(getContratSubtotal(contrat) - getContratDiscount(contrat), 0) *
    (taxRate / 100)
  );
}

export function getContratDiscount(contrat: ContratFormValues) {
  const subtotal = getContratSubtotal(contrat);
  const montant_total = Number.isFinite(contrat.montant_total)
    ? contrat.montant_total
    : 0;
  const discount =
    contrat.discountType === "percent"
      ? subtotal * (montant_total / 100)
      : montant_total;
  return Math.min(Math.max(discount, 0), subtotal);
}

export function getContratTotal(contrat: ContratFormValues) {
  return (
    Math.max(getContratSubtotal(contrat) - getContratDiscount(contrat), 0) +
    getContratTax(contrat)
  );
}
