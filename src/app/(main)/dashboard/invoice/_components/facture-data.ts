import { addDays, format } from "date-fns";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Invoice = {
  client_id: string | null
  conditions: string | null
  contenu: Json | null
  contrat_id: string | null
  created_at: string | null
  date_echeance: string | null
  date_emission: string | null
  date_paiement: string | null
  id: string
  montant_total: number | null
  notes: string | null
  numero: string
  priorite: string
  projet_id: string | null
  statut: string
  titre: string | null
  updated_at: string | null
}

export const fallbackFactures: Invoice[] = [
  {
    id: "FAC-001",
    numero: "FAC-2026-001",
    client_id: null,
    projet_id: null,
    contrat_id: null,
    titre: "Construction Immeuble Banto",
    statut: "Payée",
    priorite: "Haute",
    montant_total: 85000000,
    date_emission: "2026-02-15",
    date_echeance: "2026-03-15",
    date_paiement: "2026-03-10",
    contenu: [],
    conditions: "",
    notes: "",
    created_at: "",
    updated_at: "",
  },
  {
    id: "FAC-002",
    numero: "FAC-2026-002",
    client_id: null,
    projet_id: null,
    contrat_id: null,
    titre: "Rénovation Hôtel Royal",
    statut: "Impayée",
    priorite: "Haute",
    montant_total: 42500000,
    date_emission: "2026-05-01",
    date_echeance: "2026-06-01",
    date_paiement: null,
    contenu: [],
    conditions: "",
    notes: "",
    created_at: "",
    updated_at: "",
  },
  {
    id: "FAC-003",
    numero: "FAC-2026-003",
    client_id: null,
    projet_id: null,
    contrat_id: null,
    titre: "Extension Hôpital Central",
    statut: "Envoyée",
    priorite: "Haute",
    montant_total: 120000000,
    date_emission: "2026-04-15",
    date_echeance: "2026-05-15",
    date_paiement: null,
    contenu: [],
    conditions: "",
    notes: "",
    created_at: "",
    updated_at: "",
  },
  {
    id: "FAC-004",
    numero: "FAC-2026-004",
    client_id: null,
    projet_id: null,
    contrat_id: null,
    titre: "Complexe Sportif",
    statut: "Brouillon",
    priorite: "Haute",
    montant_total: 95000000,
    date_emission: "2026-06-01",
    date_echeance: "2026-07-01",
    date_paiement: null,
    contenu: [],
    conditions: "",
    notes: "",
    created_at: "",
    updated_at: "",
  },
  {
    id: "FAC-005",
    numero: "FAC-2026-005",
    client_id: null,
    projet_id: null,
    contrat_id: null,
    titre: "Rénovation SIEM",
    statut: "Annulée",
    priorite: "Basse",
    montant_total: 15000000,
    date_emission: "2026-01-15",
    date_echeance: "2026-02-15",
    date_paiement: null,
    contenu: [],
    conditions: "",
    notes: "",
    created_at: "",
    updated_at: "",
  },
];

export const statusColors: Record<string, string> = {
  Brouillon: "border-muted-foreground/20 bg-muted text-muted-foreground",
  Envoyée: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Payée:
    "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
  Impayée: "border-destructive/20 bg-destructive/10 text-destructive",
  Annulée: "border-muted-foreground/20 bg-muted text-muted-foreground",
};

export type FactureDiscountType = "fixed" | "percent";

export interface FactureLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface FactureTaxOption {
  id: string;
  name: string;
  rate: number;
}

export interface FactureFromDetails {
  name: string;
  email: string;
  phone: string;
  website: string;
  addressLines: string[];
  taxId: string;
  paymentAccountName: string;
  routingNumber: string;
  issuerName: string;
}

export interface FactureToDetails {
  id: string;
  name: string;
  email: string;
  addressLines: string[];
  taxId: string;
  telephone: string;
}

export interface FactureFormValues {
  id: string;
  numero: string;
  issuedDate: string;
  paymentDueDate: string;
  from: FactureFromDetails;
  to: FactureToDetails;
  taxId: string;
  discountType: FactureDiscountType;
  discountValue: number;
  items: FactureLineItem[];
  notes: string;
  conditions: string;
}

export const FACTURE_PAPER_WIDTH = 816;
export const FACTURE_PAPER_HEIGHT = 1056;
export const FACTURE_PAPER_SCALE = 0.6;

export const factureTaxOptions: FactureTaxOption[] = [
  { id: "tva", name: "TVA", rate: 19.25 },
  { id: "tva-reduite", name: "TVA reduite", rate: 5.5 },
  { id: "aucune", name: "Aucune taxe", rate: 0 },
];

export const factureClients: FactureToDetails[] = [
  {
    id: "groupe-banto",
    name: "Groupe Banto",
    email: "contact@groupebanto.cm",
    telephone: "+237 6XX XXX XXX",
    addressLines: ["BP 1234", "Douala", "Cameroun"],
    taxId: "RC-123456789",
  },
];

const today = new Date();

export const defaultFactureValues: FactureFormValues = {
  id: "",
  numero: `FAC-${format(today, "yyyy")}-001`,
  issuedDate: format(today, "yyyy-MM-dd"),
  paymentDueDate: format(addDays(today, 30), "yyyy-MM-dd"),
  from: {
    name: "Zoldick Entreprise",
    email: "contact@zoldick.cm",
    phone: "+237 6XX XXX XXX",
    website: "www.zoldick.cm",
    addressLines: ["BP 7890", "Douala", "Cameroun"],
    taxId: "RC-123456789",
    paymentAccountName: "Zoldick Entreprise",
    routingNumber: "084009519",
    issuerName: "Nanga Doumer",
  },
  to: factureClients[0],
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
  notes: "Merci de votre confiance.",
  conditions: "Paiement par virement bancaire.",
};

export function getLineAmount(item?: FactureLineItem) {
  if (!item) return 0;
  return (Number.isFinite(item.quantity) ? item.quantity : 0) *
    (Number.isFinite(item.unitPrice) ? item.unitPrice : 0);
}

export function getFactureItems(facture: FactureFormValues) {
  return facture.items;
}

export function getFactureSubtotal(facture: FactureFormValues) {
  return getFactureItems(facture).reduce(
    (subtotal, item) => subtotal + getLineAmount(item),
    0,
  );
}

export function getFactureDiscount(facture: FactureFormValues) {
  const subtotal = getFactureSubtotal(facture);
  const value = Number.isFinite(facture.discountValue)
    ? facture.discountValue
    : 0;
  const discount =
    facture.discountType === "percent" ? subtotal * (value / 100) : value;
  return Math.min(Math.max(discount, 0), subtotal);
}

export function getFactureTaxOption(facture: FactureFormValues) {
  return (
    factureTaxOptions.find((option) => option.id === facture.taxId) ??
    factureTaxOptions[0]
  );
}

export function getFactureTax(facture: FactureFormValues) {
  return (
    Math.max(getFactureSubtotal(facture) - getFactureDiscount(facture), 0) *
    (getFactureTaxOption(facture).rate / 100)
  );
}

export function getFactureTotal(facture: FactureFormValues) {
  return (
    getFactureSubtotal(facture) -
    getFactureDiscount(facture) +
    getFactureTax(facture)
  );
}
