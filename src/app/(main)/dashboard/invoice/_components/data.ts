import { addDays, format } from "date-fns";
import { InvoiceFormValues } from "@/lib/validations";

export type { InvoiceFormValues } from "@/lib/validations";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type InvoiceDiscountType = "fixed" | "percent";

export const INVOICE_PAPER_WIDTH = 816;
export const INVOICE_PAPER_HEIGHT = 1056;
export const INVOICE_PAPER_SCALE = 0.6;

const today = new Date();

export const defaultInvoiceValues: InvoiceFormValues = {

  client_id: "",

  projet_id: "",

  contrat_id: "",

  titre: "",

  statut: "Brouillon",

  priorite: "Moyenne",

  montant_total: 0,

  date_emission: format(today, "yyyy-MM-dd"),

  date_echeance: format(addDays(today, 30), "yyyy-MM-dd"),

  date_paiement: undefined,

  contenu: [],

  conditions: "",

  notes: "",

  from: {
    name: "Weblabs Studio",
    email: "hello@weblabs.studio",
    phone: "+1-512-555-0184",
    website: "weblabs.studio",
    addressLines: [
      "214 Pixel Avenue",
      "Austin, TX 78701",
    ],
    taxId: "WS-1029384756",
    paymentAccountName: "Mercury Business",
    routingNumber: "084009519",
    issuerName: "Arham Khan",
  },

  to: {
    id: "",
    nom: "",
    email: "",
  },
};

export function getLineAmount(item?: InvoiceLineItem) {
  if (!item) return 0;

  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;

  return quantity * unitPrice;
}

export function getInvoiceItems(invoice: InvoiceFormValues | any): any[] {
  if (!invoice) return [];

  let contenu = invoice.contenu;

  // Si c'est une string JSON → on la parse
  if (typeof contenu === "string") {
    try {
      contenu = JSON.parse(contenu);
    } catch (e) {
      console.error("Impossible de parser contenu :", e);
      return [];
    }
  }

  // Cas 1 : c'est déjà un tableau
  if (Array.isArray(contenu)) {
    return contenu;
  }

  // Cas 2 : c'est un objet qui contient items
  if (contenu && typeof contenu === "object" && Array.isArray(contenu.items)) {
    return contenu.items;
  }

  // Cas 3 : champ items directement
  if (Array.isArray(invoice.items)) {
    return invoice.items;
  }

  return [];
}

export function getInvoiceSubtotal(invoice: InvoiceFormValues) {
  return getInvoiceItems(invoice).reduce((subtotal, item) => subtotal + getLineAmount(item), 0);
}

// export function getInvoiceTaxOption(invoice: InvoiceFormValues) {
//   return invoiceTaxOptions.find((taxOption) => taxOption.id === invoice.taxId) ?? invoiceTaxOptions[0];
// }

// export function getInvoiceTax(invoice: InvoiceFormValues) {
//   const taxRate = getInvoiceTaxOption(invoice).rate;

//   return Math.max(getInvoiceSubtotal(invoice) - getInvoiceDiscount(invoice), 0) * (taxRate / 100);
// }

export function getInvoiceDiscount(invoice: InvoiceFormValues) {
  const subtotal = getInvoiceSubtotal(invoice);
  const montant_total = Number.isFinite(invoice.montant_total) ? invoice.montant_total : 0;

  return Math.min(Math.max(montant_total, 0), subtotal);
}

export function getInvoiceTotal(invoice: InvoiceFormValues) {
  return Math.max(getInvoiceSubtotal(invoice) - getInvoiceDiscount(invoice), 0);
}
