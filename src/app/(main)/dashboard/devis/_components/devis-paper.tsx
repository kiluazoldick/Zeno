import { formatCurrency } from "@/lib/utils";

import {
  DEVIS_PAPER_HEIGHT,
  DEVIS_PAPER_WIDTH,
  type DevisFormValues,
  getDevisDiscount,
  getDevisItems,
  getDevisSubtotal,
  getDevisTax,
  getDevisTaxOption,
  getDevisTotal,
  getLineAmount,
} from "./devis-data";

export function DevisPaper({ devis }: { devis: DevisFormValues }) {
  const taxOption = getDevisTaxOption(devis);
  const discountValue = Number.isFinite(devis.discountValue) ? devis.discountValue : 0;
  const discountLabel = devis.discountType === "percent" ? `Remise ${discountValue}%` : "Remise";

  return (
    <article
      style={{ width: DEVIS_PAPER_WIDTH, height: DEVIS_PAPER_HEIGHT }}
      data-print-paper
      className="relative flex flex-col gap-16 bg-white px-12.25 py-11 font-sans text-neutral-950"
    >
      {/* En-tête avec logo et titre */}
      <header className="flex flex-col gap-8">
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
          <h2 className="text-3xl font-bold uppercase tracking-widest text-right text-zeno-secondary">Devis</h2>
        </div>

        {/* Infos du devis */}
        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed border-b pb-4">
          <div>
            <p className="font-semibold">
              N° Devis: <span className="font-normal">{devis.numero}</span>
            </p>
            <p className="font-semibold">
              Date d'émission: <span className="font-normal">{devis.issuedDate}</span>
            </p>
            <p className="font-semibold">
              Date de validité: <span className="font-normal">{devis.validiteDate}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Émis par:</p>
            <p>{devis.from.issuerName}</p>
            <p className="text-xs text-muted-foreground">{devis.from.email}</p>
          </div>
        </section>

        {/* Adresses */}
        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p className="mb-2 font-semibold uppercase text-xs tracking-wider text-zeno-secondary">De</p>
            <p className="font-medium">{devis.from.name}</p>
            {devis.from.addressLines.map((line) => (
              <p key={line} className="text-muted-foreground">
                {line}
              </p>
            ))}
            <p className="text-xs text-muted-foreground">Tél: {devis.from.phone}</p>
            <p className="text-xs text-muted-foreground">Email: {devis.from.email}</p>
            <p className="text-xs text-muted-foreground">N° RC: {devis.from.taxId}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold uppercase text-xs tracking-wider text-zeno-secondary">Pour</p>
            <p className="font-medium">{devis.to.name}</p>
            {devis.to.addressLines.map((line) => (
              <p key={line} className="text-muted-foreground">
                {line}
              </p>
            ))}
            <p className="text-xs text-muted-foreground">Tél: {devis.to.telephone}</p>
            <p className="text-xs text-muted-foreground">Email: {devis.to.email}</p>
            <p className="text-xs text-muted-foreground">N° RC: {devis.to.taxId}</p>
          </div>
        </section>
      </header>

      {/* Tableau des lignes */}
      <div className="flex flex-col gap-6">
        <section className="text-sm">
          <div className="grid grid-cols-[1fr_74px_116px_116px] bg-zeno-primary/10 px-3 py-3 font-semibold uppercase text-zeno-secondary">
            <span>Description</span>
            <span className="text-right">Qté</span>
            <span className="text-right">Prix unitaire</span>
            <span className="text-right">Total</span>
          </div>
          {getDevisItems(devis).map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_74px_116px_116px] border-b border-border/50 px-3 py-4">
              <span>{item.description || "—"}</span>
              <span className="text-right">{item.quantity}</span>
              <span className="text-right">{formatDevisCurrency(item.unitPrice)}</span>
              <span className="text-right font-medium">{formatDevisCurrency(getLineAmount(item))}</span>
            </div>
          ))}
        </section>

        {/* Totaux */}
        <div className="grid grid-cols-2 gap-14 text-sm">
          <div>
            {devis.notes && (
              <div className="mb-4">
                <p className="font-semibold text-xs uppercase tracking-wider text-zeno-secondary">Notes</p>
                <p className="text-muted-foreground text-sm">{devis.notes}</p>
              </div>
            )}
            {devis.conditions && (
              <div>
                <p className="font-semibold text-xs uppercase tracking-wider text-zeno-secondary">Conditions</p>
                <p className="text-muted-foreground text-sm">{devis.conditions}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between gap-8 text-sm">
              <span>Sous-total</span>
              <span>{formatDevisCurrency(getDevisSubtotal(devis))}</span>
            </div>
            {devis.discountValue > 0 && (
              <div className="flex justify-between gap-8 text-sm">
                <span>{discountLabel}</span>
                <span className="text-destructive">-{formatDevisCurrency(getDevisDiscount(devis))}</span>
              </div>
            )}
            <div className="flex justify-between gap-8 text-sm">
              <span>
                {taxOption.name} ({taxOption.rate}%)
              </span>
              <span>{formatDevisCurrency(getDevisTax(devis))}</span>
            </div>
            <div className="border-t-2 border-zeno-primary pt-3">
              <div className="flex justify-between gap-8 text-base font-bold">
                <span className="uppercase text-zeno-secondary">Total TTC</span>
                <span className="text-zeno-primary">{formatDevisCurrency(getDevisTotal(devis))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <footer className="absolute right-12.25 bottom-11 left-12.25 grid grid-cols-2 gap-14 border-t pt-4 text-xs text-muted-foreground">
        <div>
          <p>{devis.from.name}</p>
          <p>{devis.from.email}</p>
          <p>{devis.from.phone}</p>
        </div>
        <div className="text-right">
          <p>Devis établi par {devis.from.issuerName}</p>
          <p>Signature: _________________</p>
        </div>
      </footer>
    </article>
  );
}

function formatDevisCurrency(value: number) {
  return formatCurrency(Number.isFinite(value) ? value : 0, {
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
