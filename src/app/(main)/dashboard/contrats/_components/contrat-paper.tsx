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
import type { ContratInput } from "@/lib/validations";

export function ContratPaper({ contrat }: { contrat: ContratInput }) {

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
              Date d'émission: <span className="font-normal">{contrat.date_emission}</span>
            </p>
            <p className="font-semibold">
              Date de signature: <span className="font-normal">{contrat.date_signature}</span>
            </p>
            <p className="font-semibold">
              Période:{" "}
              <span className="font-normal">
                {contrat.date_debut} → {contrat.date_fin}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Émis par:</p>
            <p>{contrat.from?.issuerName}</p>
            <p className="text-xs text-muted-foreground">{contrat.from?.email}</p>
          </div>
        </section>

        {/* Adresses */}
        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p className="mb-2 font-semibold uppercase text-xs tracking-wider text-zeno-secondary">De</p>
            <p className="font-medium">{contrat.from?.name}</p>
            {contrat.from?.addressLines.map((line, index) => (
              <p key={`from-address-${index}`} className="text-muted-foreground">
                {line}
              </p>
            ))}
            <p className="text-xs text-muted-foreground">Tél: {contrat.from?.phone}</p>
            <p className="text-xs text-muted-foreground">Email: {contrat.from?.email}</p>
            <p className="text-xs text-muted-foreground">N° RC: {contrat.from?.taxId}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold uppercase text-xs tracking-wider text-zeno-secondary">Pour</p>
            <p className="font-medium">{contrat.to?.name}</p>
            {contrat.to?.addressLines.map((line, index) => (
              <p key={`to-address-${index}`} className="text-muted-foreground">
                {line}
              </p>
            ))}
            <p className="text-xs text-muted-foreground">Tél: {contrat.to?.telephone}</p>
            <p className="text-xs text-muted-foreground">Email: {contrat.to?.email}</p>
            <p className="text-xs text-muted-foreground">N° RC: {contrat.to?.taxId}</p>
          </div>
        </section>
      </header>

      {/* Tableau des prestations */}
      <div>
        <div>
          <p>ARTICLE 1 -- OBJET DU CONTRAT</p>
          <p>
            Le présent contrat a pour objet de définir les conditions dans lesquelles <span className="text-bold">{contrat.from.name}</span> s'engage à concevoir, développer et livrer 
            <span className="text-bold">{contrat.project_id}</span> pour le compte de <span className="text-bold">{contrat.to.name}</span>, conformément au <span className="text-bold">{contrat.numero}</span>
            daté du <span className="text-bold">{contrat.date_emission}</span>, dûment validé par le client
          </p>
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
