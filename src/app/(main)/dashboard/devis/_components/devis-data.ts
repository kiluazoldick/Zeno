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

export interface Devis extends DevisFormValues {
  status: DevisStatus;
  priority: DevisPriority;
  projet: string;
  client: string;
  amount: string;
  dateEmission: string;
  dateValidite: string;
}

// ============ CONSTANTES ============
export const DEVIS_PAPER_WIDTH = 816;
export const DEVIS_PAPER_HEIGHT = 1056;
export const DEVIS_PAPER_SCALE = 0.6;

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
  notes: "Merci de nous faire part de votre décision dans les meilleurs délais.",
  conditions: "Devis valable 30 jours. Paiement à 30 jours fin de mois.",
};

// ============ DONNÉES MOCKÉES ============
export const devisData: Devis[] = [
  {
    id: "DEV-001",
    numero: "DEV-2026-001",
    client: "Groupe Banto",
    projet: "Construction Immeuble Banto",
    status: "Accepté",
    priority: "Haute",
    amount: "85 000 000",
    dateEmission: "10 Jan 2026",
    dateValidite: "10 Fév 2026",
    issuedDate: "2026-01-10",
    validiteDate: "2026-02-10",
    from: defaultDevisValues.from,
    to: devisClients[0],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultDevisValues.items,
    notes: "",
    conditions: "",
  },
  {
    id: "DEV-002",
    numero: "DEV-2026-002",
    client: "Hôtel Royal",
    projet: "Rénovation Hôtel Royal",
    status: "Accepté",
    priority: "Haute",
    amount: "42 500 000",
    dateEmission: "25 Fév 2026",
    dateValidite: "25 Mar 2026",
    issuedDate: "2026-02-25",
    validiteDate: "2026-03-25",
    from: defaultDevisValues.from,
    to: devisClients[1],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultDevisValues.items,
    notes: "",
    conditions: "",
  },
  {
    id: "DEV-003",
    numero: "DEV-2026-003",
    client: "Hôpital Central",
    projet: "Extension Hôpital Central",
    status: "Envoyé",
    priority: "Haute",
    amount: "120 000 000",
    dateEmission: "15 Mar 2026",
    dateValidite: "15 Avr 2026",
    issuedDate: "2026-03-15",
    validiteDate: "2026-04-15",
    from: defaultDevisValues.from,
    to: devisClients[2],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultDevisValues.items,
    notes: "",
    conditions: "",
  },
  {
    id: "DEV-004",
    numero: "DEV-2026-004",
    client: "Mairie Douala",
    projet: "Construction Marché Municipal",
    status: "Envoyé",
    priority: "Moyenne",
    amount: "65 000 000",
    dateEmission: "20 Mai 2026",
    dateValidite: "20 Juin 2026",
    issuedDate: "2026-05-20",
    validiteDate: "2026-06-20",
    from: defaultDevisValues.from,
    to: devisClients[3],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultDevisValues.items,
    notes: "",
    conditions: "",
  },
  {
    id: "DEV-005",
    numero: "DEV-2026-005",
    client: "Ministère des Sports",
    projet: "Complexe Sportif",
    status: "Brouillon",
    priority: "Haute",
    amount: "95 000 000",
    dateEmission: "01 Mai 2026",
    dateValidite: "01 Juin 2026",
    issuedDate: "2026-05-01",
    validiteDate: "2026-06-01",
    from: defaultDevisValues.from,
    to: devisClients[0],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultDevisValues.items,
    notes: "",
    conditions: "",
  },
  {
    id: "DEV-006",
    numero: "DEV-2026-006",
    client: "SIEM",
    projet: "Rénovation SIEM",
    status: "Refusé",
    priority: "Basse",
    amount: "15 000 000",
    dateEmission: "15 Jan 2026",
    dateValidite: "15 Fév 2026",
    issuedDate: "2026-01-15",
    validiteDate: "2026-02-15",
    from: defaultDevisValues.from,
    to: devisClients[1],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultDevisValues.items,
    notes: "",
    conditions: "",
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
  return getDevisItems(devis).reduce((subtotal, item) => subtotal + getLineAmount(item), 0);
}

export function getDevisTaxOption(devis: DevisFormValues) {
  return devisTaxOptions.find((taxOption) => taxOption.id === devis.taxId) ?? devisTaxOptions[0];
}

export function getDevisTax(devis: DevisFormValues) {
  const taxRate = getDevisTaxOption(devis).rate;
  return Math.max(getDevisSubtotal(devis) - getDevisDiscount(devis), 0) * (taxRate / 100);
}

export function getDevisDiscount(devis: DevisFormValues) {
  const subtotal = getDevisSubtotal(devis);
  const discountValue = Number.isFinite(devis.discountValue) ? devis.discountValue : 0;
  const discount = devis.discountType === "percent" ? subtotal * (discountValue / 100) : discountValue;
  return Math.min(Math.max(discount, 0), subtotal);
}

export function getDevisTotal(devis: DevisFormValues) {
  return Math.max(getDevisSubtotal(devis) - getDevisDiscount(devis), 0) + getDevisTax(devis);
}
