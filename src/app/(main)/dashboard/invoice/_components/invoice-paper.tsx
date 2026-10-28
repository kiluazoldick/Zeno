import { formatCurrency } from "@/lib/utils";

import {
  getInvoiceDiscount,
  getInvoiceItems,
  getInvoiceSubtotal,
  getInvoiceTotal,
  getLineAmount,
  INVOICE_PAPER_HEIGHT,
  INVOICE_PAPER_WIDTH,
} from "./data";
import { InvoiceFormValues } from "@/lib/validations";

export function InvoicePaper({ invoice }: { invoice: InvoiceFormValues }) {
  const montant_total = Number.isFinite(invoice.montant_total)
    ? invoice.montant_total
    : 0;

  console.log("Contenu brut :", invoice?.contenu);
  console.log("Type de contenu :", typeof invoice?.contenu);
  console.log("Est-ce un tableau ?", Array.isArray(invoice?.contenu));

  return (
    <article
      style={{ width: INVOICE_PAPER_WIDTH, height: INVOICE_PAPER_HEIGHT }}
      data-print-paper
      className="relative flex flex-col gap-24 bg-neutral-50 px-12.25 py-11 font-mono text-neutral-950"
    >
      <header className="flex flex-col gap-10">
        <div className="grid grid-cols-2 items-start gap-14">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zeno-primary font-bold text-lg text-white">
            Z
          </div>

          <h2 className="text-4xl uppercase tracking-widest">
            Facture
          </h2>
        </div>

        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p>Date d'émission : {invoice.date_emission}</p>
            <p>Date d'échéance : {invoice.date_paiement}</p>
          </div>

          <div>
            <p>Compte de paiement</p>
            <p>{invoice.from.paymentAccountName}</p>
            <p>Numéro de routage : {invoice.from.routingNumber}</p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p className="mb-4 font-semibold uppercase">Émetteur</p>
            <p>{invoice.from.name}</p>

            {invoice.from.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}

            <p>Identifiant fiscal : {invoice.from.taxId}</p>
          </div>

          <div>
            <p className="mb-4 font-semibold uppercase">Facturé à</p>
            <p>{invoice.to.nom}</p>
          </div>
        </section>
      </header>

      <div className="flex flex-col gap-5">
        <section className="text-sm">
          <div className="grid grid-cols-[1fr_74px_116px_116px] bg-stone-200 px-3 py-3 font-semibold uppercase">
            <span>Description</span>
            <span className="text-right">Quantité</span>
            <span className="text-right">Prix unitaire</span>
            <span className="text-right">Prix total</span>
          </div>

          {getInvoiceItems(invoice).map((item, index) => (
            <div
              key={item.id ?? `item-${index}`}
              className="grid grid-cols-[1fr_74px_116px_116px] border-b border-[oklch(0.86_0_0)] px-3 py-4"
            >
              <span>{item.description}</span>
              <span className="text-right">{item.quantity}</span>
              <span className="text-right">
                {formatInvoiceCurrency(item.unitPrice)}
              </span>
              <span className="text-right">
                {formatInvoiceCurrency(getLineAmount(item))}
              </span>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <section className="col-start-2 space-y-2">
            <div>
              <div className="flex justify-between gap-8">
                <span>Montant net</span>
                <span>
                  {formatInvoiceCurrency(getInvoiceSubtotal(invoice))}
                </span>
              </div>
            </div>

            <div className="border-y-2 border-current py-3">
              <div className="flex justify-between gap-8">
                <span className="font-semibold uppercase">
                  Montant total à payer
                </span>
                <span className="font-semibold">
                  {formatInvoiceCurrency(getInvoiceTotal(invoice))}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="absolute right-12.25 bottom-11 left-12.25 grid grid-cols-2 gap-14 text-sm leading-relaxed text-neutral-500">
        <div>
          <p>{invoice.from.email}</p>
          <p>{invoice.from.phone}</p>
          <p>{invoice.from.website}</p>
        </div>

        <div>
          <p>Préparé pour un traitement rapide.</p>
          <p>Émis par {invoice.from.issuerName}</p>
        </div>
      </footer>
    </article>
  );
}

function formatInvoiceCurrency(value: number) {
  return formatCurrency(Number.isFinite(value) ? value : 0, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}