import { addDays, format } from "date-fns";

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
  issuedDate: string;
  signatureDate: string;
  dateDebut: string;
  dateFin: string;
  from: ContratFromDetails;
  to: ContratToDetails;
  taxId: string;
  discountType: ContratDiscountType;
  discountValue: number;
  items: ContratLineItem[];
  notes: string;
  conditions: string;
  clauses: string;
}

export interface Contrat extends ContratFormValues {
  status: ContratStatus;
  priority: ContratPriority;
  projet: string;
  client: string;
  amount: string;
  dateEmission: string;
  dateSignature: string;
}

// ============ CONSTANTES ============
export const CONTRAT_PAPER_WIDTH = 816;
export const CONTRAT_PAPER_HEIGHT = 1056;
export const CONTRAT_PAPER_SCALE = 0.6;

const today = new Date();

export const contratTaxOptions: ContratTaxOption[] = [
  { id: "tva", name: "TVA", rate: 19.25 },
  { id: "tva-reduite", name: "TVA Réduite", rate: 5.5 },
  { id: "aucune", name: "Aucune taxe", rate: 0 },
];

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

export const defaultContratValues: ContratFormValues = {
  id: "",
  numero: `CTR-${format(today, "yyyy")}-001`,
  issuedDate: format(today, "yyyy-MM-dd"),
  signatureDate: format(addDays(today, 15), "yyyy-MM-dd"),
  dateDebut: format(addDays(today, 30), "yyyy-MM-dd"),
  dateFin: format(addDays(today, 365), "yyyy-MM-dd"),
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
  to: contratClients[0],
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
  conditions: "Contrat valable 1 an. Renouvelable par tacite reconduction.",
  clauses: "Clause de confidentialité et de non-concurrence applicables.",
};

// ============ DONNÉES MOCKÉES ============
export const contratData: Contrat[] = [
  {
    id: "CTR-001",
    numero: "CTR-2026-001",
    client: "Groupe Banto",
    projet: "Construction Immeuble Banto",
    status: "En cours",
    priority: "Haute",
    amount: "85 000 000",
    dateEmission: "15 Fév 2026",
    dateSignature: "15 Mar 2026",
    issuedDate: "2026-02-15",
    signatureDate: "2026-03-15",
    dateDebut: "2026-03-15",
    dateFin: "2027-03-15",
    from: defaultContratValues.from,
    to: contratClients[0],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultContratValues.items,
    notes: "",
    conditions: "",
    clauses: "",
  },
  {
    id: "CTR-002",
    numero: "CTR-2026-002",
    client: "Hôtel Royal",
    projet: "Rénovation Hôtel Royal",
    status: "Signé",
    priority: "Haute",
    amount: "42 500 000",
    dateEmission: "01 Avr 2026",
    dateSignature: "15 Avr 2026",
    issuedDate: "2026-04-01",
    signatureDate: "2026-04-15",
    dateDebut: "2026-04-15",
    dateFin: "2026-10-15",
    from: defaultContratValues.from,
    to: contratClients[1],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultContratValues.items,
    notes: "",
    conditions: "",
    clauses: "",
  },
  {
    id: "CTR-003",
    numero: "CTR-2026-003",
    client: "Hôpital Central",
    projet: "Extension Hôpital Central",
    status: "Brouillon",
    priority: "Haute",
    amount: "120 000 000",
    dateEmission: "15 Avr 2026",
    dateSignature: "15 Mai 2026",
    issuedDate: "2026-04-15",
    signatureDate: "2026-05-15",
    dateDebut: "2026-06-01",
    dateFin: "2027-06-01",
    from: defaultContratValues.from,
    to: contratClients[2],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultContratValues.items,
    notes: "",
    conditions: "",
    clauses: "",
  },
  {
    id: "CTR-004",
    numero: "CTR-2026-004",
    client: "Ministère des Sports",
    projet: "Complexe Sportif",
    status: "En cours",
    priority: "Haute",
    amount: "95 000 000",
    dateEmission: "01 Juin 2026",
    dateSignature: "15 Juin 2026",
    issuedDate: "2026-06-01",
    signatureDate: "2026-06-15",
    dateDebut: "2026-06-15",
    dateFin: "2027-06-15",
    from: defaultContratValues.from,
    to: contratClients[0],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultContratValues.items,
    notes: "",
    conditions: "",
    clauses: "",
  },
  {
    id: "CTR-005",
    numero: "CTR-2026-005",
    client: "SIEM",
    projet: "Rénovation SIEM",
    status: "Annulé",
    priority: "Basse",
    amount: "15 000 000",
    dateEmission: "15 Jan 2026",
    dateSignature: "30 Jan 2026",
    issuedDate: "2026-01-15",
    signatureDate: "2026-01-30",
    dateDebut: "2026-02-01",
    dateFin: "2026-08-01",
    from: defaultContratValues.from,
    to: contratClients[1],
    taxId: "tva",
    discountType: "fixed",
    discountValue: 0,
    items: defaultContratValues.items,
    notes: "",
    conditions: "",
    clauses: "",
  },
];

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
  return getContratItems(contrat).reduce((subtotal, item) => subtotal + getLineAmount(item), 0);
}

export function getContratTaxOption(contrat: ContratFormValues) {
  return contratTaxOptions.find((taxOption) => taxOption.id === contrat.taxId) ?? contratTaxOptions[0];
}

export function getContratTax(contrat: ContratFormValues) {
  const taxRate = getContratTaxOption(contrat).rate;
  return Math.max(getContratSubtotal(contrat) - getContratDiscount(contrat), 0) * (taxRate / 100);
}

export function getContratDiscount(contrat: ContratFormValues) {
  const subtotal = getContratSubtotal(contrat);
  const discountValue = Number.isFinite(contrat.discountValue) ? contrat.discountValue : 0;
  const discount = contrat.discountType === "percent" ? subtotal * (discountValue / 100) : discountValue;
  return Math.min(Math.max(discount, 0), subtotal);
}

export function getContratTotal(contrat: ContratFormValues) {
  return Math.max(getContratSubtotal(contrat) - getContratDiscount(contrat), 0) + getContratTax(contrat);
}
