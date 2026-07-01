import { addDays, format } from "date-fns";

// ============ TYPES ============
export type FactureStatus = "Brouillon" | "Envoyée" | "Payée" | "Impayée" | "Annulée";
export type FacturePriority = "Haute" | "Moyenne" | "Basse";

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

export type FactureDiscountType = "fixed" | "percent";

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

export interface Facture extends FactureFormValues {
  status: FactureStatus;
  priority: FacturePriority;
  projet: string;
  client: string;
  amount: string;
  dateEmission: string;
  dateEcheance: string;
}

// ============ CONSTANTES ============
export const FACTURE_PAPER_WIDTH = 816;
export const FACTURE_PAPER_HEIGHT = 1056;
export const FACTURE_PAPER_SCALE = 0.6;

const today = new Date();

export const factureTaxOptions: FactureTaxOption[] = [
  { id: "tva", name: "TVA", rate: 19.25 },
  { id: "tva-reduite", name: "TVA Réduite", rate: 5.5 },
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
  notes: "Merci de votre confiance. Paiement à 30 jours.",
  conditions: "Paiement par virement bancaire. Aucun escompte pour paiement anticipé.",
};

// ============ DONNÉES MOCKÉES ============
export const factureData: Facture[] = [
  {
    id: "FAC-001",
    numero: "FAC-2026-001",
    client: "Groupe Banto",
    projet: "Construction Immeuble Banto",
    status: "Payée",
    priority: "Haute",
    amount: "85 000 000",
    dateEmission: "15 Fév 2026",
    dateEcheance: "15 Mar 2026",
    issuedDate: "2026-02-15",
    paymentDueDate: "2026-03-15",
    from: defaultFactureValues.from,
    to: factureClients[0],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultFactureValues.items,
    notes: "",
    conditions: "",
  },
  {
    id: "FAC-002",
    numero: "FAC-2026-002",
    client: "Hôtel Royal",
    projet: "Rénovation Hôtel Royal",
    status: "Impayée",
    priority: "Haute",
    amount: "42 500 000",
    dateEmission: "01 Mai 2026",
    dateEcheance: "01 Juin 2026",
    issuedDate: "2026-05-01",
    paymentDueDate: "2026-06-01",
    from: defaultFactureValues.from,
    to: factureClients[1],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultFactureValues.items,
    notes: "",
    conditions: "",
  },
  {
    id: "FAC-003",
    numero: "FAC-2026-003",
    client: "Hôpital Central",
    projet: "Extension Hôpital Central",
    status: "Envoyée",
    priority: "Haute",
    amount: "120 000 000",
    dateEmission: "15 Avr 2026",
    dateEcheance: "15 Mai 2026",
    issuedDate: "2026-04-15",
    paymentDueDate: "2026-05-15",
    from: defaultFactureValues.from,
    to: factureClients[2],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultFactureValues.items,
    notes: "",
    conditions: "",
  },
  {
    id: "FAC-004",
    numero: "FAC-2026-004",
    client: "Ministère des Sports",
    projet: "Complexe Sportif",
    status: "Brouillon",
    priority: "Haute",
    amount: "95 000 000",
    dateEmission: "01 Juin 2026",
    dateEcheance: "01 Juil 2026",
    issuedDate: "2026-06-01",
    paymentDueDate: "2026-07-01",
    from: defaultFactureValues.from,
    to: factureClients[0],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultFactureValues.items,
    notes: "",
    conditions: "",
  },
  {
    id: "FAC-005",
    numero: "FAC-2026-005",
    client: "SIEM",
    projet: "Rénovation SIEM",
    status: "Annulée",
    priority: "Basse",
    amount: "15 000 000",
    dateEmission: "15 Jan 2026",
    dateEcheance: "15 Fév 2026",
    issuedDate: "2026-01-15",
    paymentDueDate: "2026-02-15",
    from: defaultFactureValues.from,
    to: factureClients[1],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultFactureValues.items,
    notes: "",
    conditions: "",
  },
];

// ============ FONCTIONS UTILES ============
export function getLineAmount(item?: FactureLineItem) {
  if (!item) return 0;
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;
  return quantity * unitPrice;
}

export function getFactureItems(facture: FactureFormValues) {
  return facture.items;
}

export function getFactureSubtotal(facture: FactureFormValues) {
  return getFactureItems(facture).reduce((subtotal, item) => subtotal + getLineAmount(item), 0);
}

export function getFactureTaxOption(facture: FactureFormValues) {
  return factureTaxOptions.find((taxOption) => taxOption.id === facture.taxId) ?? factureTaxOptions[0];
}

export function getFactureTax(facture: FactureFormValues) {
  const taxRate = getFactureTaxOption(facture).rate;
  return Math.max(getFactureSubtotal(facture) - getFactureDiscount(facture), 0) * (taxRate / 100);
}

export function getFactureDiscount(facture: FactureFormValues) {
  const subtotal = getFactureSubtotal(facture);
  const discountValue = Number.isFinite(facture.discountValue) ? facture.discountValue : 0;
  const discount = facture.discountType === "percent" ? subtotal * (discountValue / 100) : discountValue;
  return Math.min(Math.max(discount, 0), subtotal);
}

export function getFactureTotal(facture: FactureFormValues) {
  return Math.max(getFactureSubtotal(facture) - getFactureDiscount(facture), 0) + getFactureTax(facture);
}
