import { formatCurrency } from "@/lib/utils";

import {
  CONTRAT_PAPER_HEIGHT,
  CONTRAT_PAPER_WIDTH,
  type ContratFormValues,
  getContratDiscount,
  getContratItems,
  getContratSubtotal,
  getContratTax,
  getContratTaxOption,
  getContratTotal,
  getLineAmount,
} from "./contrat-data";

export function ContratPaper({ contrat }: { contrat: ContratFormValues }) {
  const taxOption = getContratTaxOption(contrat);
  const discountValue = Number.isFinite(contrat.discountValue) ? contrat.discountValue : 0;
  const discountLabel = contrat.discountType === "percent" ? `Remise ${discountValue}%` : "Remise";

  return (
    <article
      style={{ width: CONTRAT_PAPER_WIDTH, height: CONTRAT_PAPER_HEIGHT }}
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
          <h2 className="text-3xl font-bold uppercase tracking-widest text-right text-zeno-secondary">Contrat</h2>
        </div>

        {/* Infos du contrat */}
        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed border-b border-zeno-primary/20 pb-4">
          <div>
            <p className="font-semibold">
              N° Contrat: <span className="font-normal">{contrat.numero}</span>
            </p>
            <p className="font-semibold">
              Date d'émission: <span className="font-normal">{contrat.issuedDate}</span>
            </p>
            <p className="font-semibold">
              Date de signature: <span className="font-normal">{contrat.signatureDate}</span>
            </p>
            <p className="font-semibold">
              Période:{" "}
              <span className="font-normal">
                {contrat.dateDebut} → {contrat.dateFin}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Émis par:</p>
            <p>{contrat.from.issuerName}</p>
            <p className="text-xs text-muted-foreground">{contrat.from.email}</p>
          </div>
        </section>

        {/* Adresses */}
        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p className="mb-2 font-semibold uppercase text-xs tracking-wider text-zeno-secondary">De</p>
            <p className="font-medium">{contrat.from.name}</p>
            {contrat.from.addressLines.map((line) => (
              <p key={line} className="text-muted-foreground">
                {line}
              </p>
            ))}
            <p className="text-xs text-muted-foreground">Tél: {contrat.from.phone}</p>
            <p className="text-xs text-muted-foreground">Email: {contrat.from.email}</p>
            <p className="text-xs text-muted-foreground">N° RC: {contrat.from.taxId}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold uppercase text-xs tracking-wider text-zeno-secondary">Pour</p>
            <p className="font-medium">{contrat.to.name}</p>
            {contrat.to.addressLines.map((line) => (
              <p key={line} className="text-muted-foreground">
                {line}
              </p>
            ))}
            <p className="text-xs text-muted-foreground">Tél: {contrat.to.telephone}</p>
            <p className="text-xs text-muted-foreground">Email: {contrat.to.email}</p>
            <p className="text-xs text-muted-foreground">N° RC: {contrat.to.taxId}</p>
          </div>
        </section>
      </header>

      {/* Tableau des prestations */}
      <div className="flex flex-col gap-5">
        <section className="text-sm">
          <div className="grid grid-cols-[1fr_74px_116px_116px] bg-zeno-primary/10 px-3 py-3 font-semibold uppercase text-zeno-secondary">
            <span>Description des prestations</span>
            <span className="text-right">Qté</span>
            <span className="text-right">Prix unitaire</span>
            <span className="text-right">Total</span>
          </div>
          {getContratItems(contrat).map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_74px_116px_116px] border-b border-border/50 px-3 py-4">
              <span>{item.description || "—"}</span>
              <span className="text-right">{item.quantity}</span>
              <span className="text-right">{formatContratCurrency(item.unitPrice)}</span>
              <span className="text-right font-medium">{formatContratCurrency(getLineAmount(item))}</span>
            </div>
          ))}
        </section>

        {/* Totaux */}
        <div className="grid grid-cols-2 gap-14 text-sm">
          <div>
            {contrat.clauses && (
              <div className="mb-4">
                <p className="font-semibold text-xs uppercase tracking-wider text-zeno-secondary">
                  Clauses particulières
                </p>
                <p className="text-muted-foreground text-sm">{contrat.clauses}</p>
              </div>
            )}
            {contrat.conditions && (
              <div className="mb-4">
                <p className="font-semibold text-xs uppercase tracking-wider text-zeno-secondary">
                  Conditions générales
                </p>
                <p className="text-muted-foreground text-sm">{contrat.conditions}</p>
              </div>
            )}
            {contrat.notes && (
              <div>
                <p className="font-semibold text-xs uppercase tracking-wider text-zeno-secondary">Notes</p>
                <p className="text-muted-foreground text-sm">{contrat.notes}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between gap-8 text-sm">
              <span>Sous-total</span>
              <span>{formatContratCurrency(getContratSubtotal(contrat))}</span>
            </div>
            {contrat.discountValue > 0 && (
              <div className="flex justify-between gap-8 text-sm">
                <span>{discountLabel}</span>
                <span className="text-destructive">-{formatContratCurrency(getContratDiscount(contrat))}</span>
              </div>
            )}
            <div className="flex justify-between gap-8 text-sm">
              <span>
                {taxOption.name} ({taxOption.rate}%)
              </span>
              <span>{formatContratCurrency(getContratTax(contrat))}</span>
            </div>
            <div className="border-t-2 border-zeno-primary pt-3">
              <div className="flex justify-between gap-8 text-base font-bold">
                <span className="uppercase text-zeno-secondary">Total TTC</span>
                <span className="text-zeno-primary">{formatContratCurrency(getContratTotal(contrat))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page avec signatures */}
      <footer className="absolute right-12.25 bottom-11 left-12.25">
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-14 text-xs text-muted-foreground">
            <div>
              <p className="font-semibold text-zeno-secondary">Pour {contrat.from.name}</p>
              <p className="mt-6">Signature: _________________</p>
              <p className="text-xs">{contrat.from.issuerName}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-zeno-secondary">Pour {contrat.to.name}</p>
              <p className="mt-6">Signature: _________________</p>
              <p className="text-xs">Cachet de l'entreprise</p>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}

function formatContratCurrency(value: number) {
  return formatCurrency(Number.isFinite(value) ? value : 0, {
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
