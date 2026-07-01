import { formatCurrency } from "@/lib/utils";

import {
  FACTURE_PAPER_HEIGHT,
  FACTURE_PAPER_WIDTH,
  type FactureFormValues,
  getFactureDiscount,
  getFactureItems,
  getFactureSubtotal,
  getFactureTax,
  getFactureTaxOption,
  getFactureTotal,
  getLineAmount,
} from "./facture-data";

export function FacturePaper({ facture }: { facture: FactureFormValues }) {
  const taxOption = getFactureTaxOption(facture);
  const discountValue = Number.isFinite(facture.discountValue) ? facture.discountValue : 0;
  const discountLabel = facture.discountType === "percent" ? `Remise ${discountValue}%` : "Remise";

  return (
    <article
      style={{ width: FACTURE_PAPER_WIDTH, height: FACTURE_PAPER_HEIGHT }}
      data-print-paper
      className="relative flex flex-col gap-12 bg-white px-12.25 py-11 font-sans text-neutral-950"
    >
      {/* En-tête avec logo et titre */}
      <header className="flex flex-col gap-6">
        <div className="grid grid-cols-2 items-start gap-14">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zeno-primary text-white font-bold text-lg">
                Z
              </div>
              <span className="font-bold text-lg text-zeno-primary">Zoldick Entreprise</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">BTP - Construction - Rénovation</p>
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-widest text-right text-zeno-secondary">Facture</h2>
        </div>

        {/* Infos de la facture */}
        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed border-b border-zeno-primary/20 pb-4">
          <div>
            <p className="font-semibold">
              N° Facture: <span className="font-normal">{facture.numero}</span>
            </p>
            <p className="font-semibold">
              Date d'émission: <span className="font-normal">{facture.issuedDate}</span>
            </p>
            <p className="font-semibold">
              Date d'échéance: <span className="font-normal">{facture.paymentDueDate}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Émis par:</p>
            <p>{facture.from.issuerName}</p>
            <p className="text-xs text-muted-foreground">{facture.from.email}</p>
          </div>
        </section>

        {/* Adresses */}
        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p className="mb-2 font-semibold uppercase text-xs tracking-wider text-zeno-secondary">De</p>
            <p className="font-medium">{facture.from.name}</p>
            {facture.from.addressLines.map((line) => (
              <p key={line} className="text-muted-foreground">
                {line}
              </p>
            ))}
            <p className="text-xs text-muted-foreground">Tél: {facture.from.phone}</p>
            <p className="text-xs text-muted-foreground">Email: {facture.from.email}</p>
            <p className="text-xs text-muted-foreground">N° RC: {facture.from.taxId}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold uppercase text-xs tracking-wider text-zeno-secondary">Pour</p>
            <p className="font-medium">{facture.to.name}</p>
            {facture.to.addressLines.map((line) => (
              <p key={line} className="text-muted-foreground">
                {line}
              </p>
            ))}
            <p className="text-xs text-muted-foreground">Tél: {facture.to.telephone}</p>
            <p className="text-xs text-muted-foreground">Email: {facture.to.email}</p>
            <p className="text-xs text-muted-foreground">N° RC: {facture.to.taxId}</p>
          </div>
        </section>
      </header>

      {/* Tableau des lignes */}
      <div className="flex flex-col gap-5">
        <section className="text-sm">
          <div className="grid grid-cols-[1fr_74px_116px_116px] bg-zeno-primary/10 px-3 py-3 font-semibold uppercase text-zeno-secondary">
            <span>Description</span>
            <span className="text-right">Qté</span>
            <span className="text-right">Prix unitaire</span>
            <span className="text-right">Total</span>
          </div>
          {getFactureItems(facture).map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_74px_116px_116px] border-b border-border/50 px-3 py-4">
              <span>{item.description || "—"}</span>
              <span className="text-right">{item.quantity}</span>
              <span className="text-right">{formatFactureCurrency(item.unitPrice)}</span>
              <span className="text-right font-medium">{formatFactureCurrency(getLineAmount(item))}</span>
            </div>
          ))}
        </section>

        {/* Totaux */}
        <div className="grid grid-cols-2 gap-14 text-sm">
          <div>
            {facture.notes && (
              <div className="mb-4">
                <p className="font-semibold text-xs uppercase tracking-wider text-zeno-secondary">Notes</p>
                <p className="text-muted-foreground text-sm">{facture.notes}</p>
              </div>
            )}
            {facture.conditions && (
              <div>
                <p className="font-semibold text-xs uppercase tracking-wider text-zeno-secondary">Conditions</p>
                <p className="text-muted-foreground text-sm">{facture.conditions}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between gap-8 text-sm">
              <span>Sous-total</span>
              <span>{formatFactureCurrency(getFactureSubtotal(facture))}</span>
            </div>
            {facture.discountValue > 0 && (
              <div className="flex justify-between gap-8 text-sm">
                <span>{discountLabel}</span>
                <span className="text-destructive">-{formatFactureCurrency(getFactureDiscount(facture))}</span>
              </div>
            )}
            <div className="flex justify-between gap-8 text-sm">
              <span>
                {taxOption.name} ({taxOption.rate}%)
              </span>
              <span>{formatFactureCurrency(getFactureTax(facture))}</span>
            </div>
            <div className="border-t-2 border-zeno-primary pt-3">
              <div className="flex justify-between gap-8 text-base font-bold">
                <span className="uppercase text-zeno-secondary">Total TTC</span>
                <span className="text-zeno-primary">{formatFactureCurrency(getFactureTotal(facture))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <footer className="absolute right-12.25 bottom-11 left-12.25 border-t pt-4 text-xs text-muted-foreground">
        <div className="grid grid-cols-2 gap-14">
          <div>
            <p>{facture.from.name}</p>
            <p>{facture.from.email}</p>
            <p>{facture.from.phone}</p>
          </div>
          <div className="text-right">
            <p>Facture établie par {facture.from.issuerName}</p>
            <p>Compte bancaire: {facture.from.paymentAccountName}</p>
            <p>RIB: {facture.from.routingNumber}</p>
          </div>
        </div>
      </footer>
    </article>
  );
}

function formatFactureCurrency(value: number) {
  return formatCurrency(Number.isFinite(value) ? value : 0, {
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
