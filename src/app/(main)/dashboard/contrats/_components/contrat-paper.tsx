import { formatCurrency } from "@/lib/utils";

import { CONTRAT_PAPER_HEIGHT, CONTRAT_PAPER_WIDTH } from "./contrat-data";
import type { ContratInput } from "@/lib/validations";

function formatContratCurrency(value: number | null | undefined) {
  return formatCurrency(Number.isFinite(Number(value)) ? Number(value) : 0, {
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatDisplayDate(date?: string | null) {
  if (!date) return "-";
  return date;
}

export function ContratPaper({ contrat }: { contrat: ContratInput }) {
  const from = contrat.from;
  const to = contrat.to;

  const prestations = contrat.prestations?.filter((prestation) => {
    if (!prestation) return false;
    const hasTitle = prestation.title && prestation.title.trim() !== "";
    const hasItems =
      prestation.items?.some((item) => item && item.trim() !== "") ?? false;
    return hasTitle || hasItems;
  });

  const livrables = contrat.livrables?.filter(
    (livrable) => livrable?.name && livrable.name.trim() !== "",
  );

  const paiements = contrat.paiements?.filter(
    (paiement) =>
      paiement &&
      ((paiement.label && paiement.label.trim() !== "") ||
        (paiement.percentage !== undefined && paiement.percentage !== null) ||
        (paiement.montant !== undefined && paiement.montant !== null)),
  );

  const fromAddressLines =
    from?.addressLines?.filter((line) => line && line.trim() !== "") ?? [];
  const toAddressLines =
    to?.addressLines?.filter((line) => line && line.trim() !== "") ?? [];

  return (
    <article
      style={{ width: CONTRAT_PAPER_WIDTH, minHeight: CONTRAT_PAPER_HEIGHT }}
      data-print-paper
      className="relative flex flex-col gap-10 bg-white px-12.25 py-11 font-sans text-neutral-950"
    >
      {/* En-tête avec logo et titre */}
      <header className="flex flex-col gap-6">
        <div className="grid grid-cols-2 items-start gap-14">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zeno-primary text-white font-bold text-lg">
                Z
              </div>
              <span className="font-bold text-lg text-zeno-primary">
                {from?.name || "Zoldick Entreprise"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">BTP - Construction - Rénovation</p>
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-widest text-right text-zeno-secondary">Contrat</h2>
        </div>

        {/* Infos du contrat */}
        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed border-b border-zeno-primary/20 pb-4">
          <div className="space-y-1">
            <p className="font-semibold">
              N° Contrat : <span className="font-normal">{contrat.numero || "-"}</span>
            </p>
            <p className="font-semibold">
              Titre : <span className="font-normal">{contrat.titre || "-"}</span>
            </p>
            <p className="font-semibold">
              Date d'émission : <span className="font-normal">{formatDisplayDate(contrat.date_emission)}</span>
            </p>
            <p className="font-semibold">
              Date de signature : <span className="font-normal">{formatDisplayDate(contrat.date_signature)}</span>
            </p>
            <p className="font-semibold">
              Période :{" "}
              <span className="font-normal">
                {formatDisplayDate(contrat.date_debut)} → {formatDisplayDate(contrat.date_fin)}
              </span>
            </p>
            <p className="font-semibold">
              Statut : <span className="font-normal">{contrat.statut || "Brouillon"}</span> | Priorité :{" "}
              <span className="font-normal">{contrat.priorite || "Moyenne"}</span>
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="font-semibold">Émis par :</p>
            <p>{from?.issuerName || from?.name || "-"}</p>
            {from?.email ? <p className="text-xs text-muted-foreground">{from.email}</p> : null}
            {from?.phone ? <p className="text-xs text-muted-foreground">Tél : {from.phone}</p> : null}
          </div>
        </section>

        {/* Adresses */}
        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p className="mb-2 font-semibold uppercase text-xs tracking-wider text-zeno-secondary">De</p>
            <p className="font-medium">{from?.name || "-"}</p>
            {fromAddressLines.map((line, index) => (
              <p key={`from-address-${index}`} className="text-muted-foreground">
                {line}
              </p>
            ))}
            {from?.phone ? <p className="text-xs text-muted-foreground">Tél : {from.phone}</p> : null}
            {from?.email ? <p className="text-xs text-muted-foreground">Email : {from.email}</p> : null}
            {from?.taxId ? <p className="text-xs text-muted-foreground">N° RC : {from.taxId}</p> : null}
            {from?.website ? <p className="text-xs text-muted-foreground">Site web : {from.website}</p> : null}
          </div>
          <div>
            <p className="mb-2 font-semibold uppercase text-xs tracking-wider text-zeno-secondary">Pour</p>
            <p className="font-medium">{to?.name || "-"}</p>
            {toAddressLines.map((line, index) => (
              <p key={`to-address-${index}`} className="text-muted-foreground">
                {line}
              </p>
            ))}
            {to?.telephone ? <p className="text-xs text-muted-foreground">Tél : {to.telephone}</p> : null}
            {to?.email ? <p className="text-xs text-muted-foreground">Email : {to.email}</p> : null}
            {to?.taxId ? <p className="text-xs text-muted-foreground">N° RC : {to.taxId}</p> : null}
          </div>
        </section>
      </header>

      {/* Corps du contrat */}
      <main className="flex flex-col gap-8 text-sm leading-relaxed">
        {/* Article 1 - Objet */}
        <section className="flex flex-col gap-2">
          <p className="font-semibold uppercase tracking-wide text-zeno-secondary">Article 1 – Objet du contrat</p>
          <p>
            Le présent contrat a pour objet de définir les conditions dans lesquelles{" "}
            <span className="font-semibold">{from?.name || "le Prestataire"}</span> s'engage à réaliser les prestations
            définies ci-après, au profit de <span className="font-semibold">{to?.name || "le Client"}</span>
            {contrat.titre ? (
              <>
                , dans le cadre du projet <span className="font-semibold">{contrat.titre}</span>
              </>
            ) : null}
            {contrat.numero ? (
              <>
                {" "}
                (Réf. : <span className="font-semibold">{contrat.numero}</span>)
              </>
            ) : null}
            .
          </p>
        </section>

        {/* Article 2 - Prestations */}
        {prestations && prestations.length > 0 ? (
          <section className="flex flex-col gap-3">
            <p className="font-semibold uppercase tracking-wide text-zeno-secondary">Article 2 – Prestations</p>
            <div className="flex flex-col gap-4">
              {prestations.map((prestation, pIndex) => {
                const items =
                  prestation.items?.filter((item) => item && item.trim() !== "") ?? [];
                if (!prestation.title && items.length === 0) return null;
                return (
                  <div key={`prestation-${pIndex}`} className="flex flex-col gap-2">
                    {prestation.title ? (
                      <p className="font-medium">{prestation.title}</p>
                    ) : null}
                    {items.length > 0 ? (
                      <ul className="ml-6 flex list-disc flex-col gap-1">
                        {items.map((item, iIndex) => (
                          <li key={`prestation-${pIndex}-item-${iIndex}`}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Article 3 - Livrables */}
        {livrables && livrables.length > 0 ? (
          <section className="flex flex-col gap-3">
            <p className="font-semibold uppercase tracking-wide text-zeno-secondary">Article 3 – Livrables</p>
            <ul className="ml-6 flex list-disc flex-col gap-1">
              {livrables.map((livrable, lIndex) => (
                <li key={`livrable-${lIndex}`}>{livrable.name}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Article 4 - Modalités de paiement */}
        {paiements && paiements.length > 0 ? (
          <section className="flex flex-col gap-3">
            <p className="font-semibold uppercase tracking-wide text-zeno-secondary">Article 4 – Modalités de paiement</p>
            <div className="flex flex-col gap-2">
              {paiements.map((paiement, payIndex) => (
                <div key={`paiement-${payIndex}`} className="flex items-center justify-between border-b border-neutral-200 pb-1">
                  <p>{paiement.label || `Tranche ${payIndex + 1}`}</p>
                  <p className="font-medium">
                    {paiement.percentage !== undefined && paiement.percentage !== null
                      ? `${paiement.percentage} %`
                      : paiement.montant !== undefined && paiement.montant !== null
                        ? formatContratCurrency(paiement.montant)
                        : "-"}
                  </p>
                </div>
              ))}
            </div>
            {contrat.montant_total !== undefined && contrat.montant_total !== null ? (
              <div className="mt-2 flex items-center justify-between border-t border-zeno-primary/30 pt-2">
                <p className="font-semibold">Montant total TTC / HT selon accord</p>
                <p className="font-semibold text-zeno-secondary">
                  {formatContratCurrency(contrat.montant_total)}
                </p>
              </div>
            ) : null}
          </section>
        ) : contrat.montant_total !== undefined && contrat.montant_total !== null ? (
          <section className="flex flex-col gap-2">
            <p className="font-semibold uppercase tracking-wide text-zeno-secondary">Article 4 – Montant du contrat</p>
            <div className="flex items-center justify-between border-t border-b border-zeno-primary/30 py-2">
              <p className="font-semibold">Montant total</p>
              <p className="font-semibold text-lg text-zeno-secondary">
                {formatContratCurrency(contrat.montant_total)}
              </p>
            </div>
          </section>
        ) : null}

        {/* Article 5 - Exécution */}
        {(contrat.date_debut || contrat.date_fin) ? (
          <section className="flex flex-col gap-2">
            <p className="font-semibold uppercase tracking-wide text-zeno-secondary">Article 5 – Exécution et durée</p>
            <p>
              Le présent contrat prend effet à compter du{" "}
              <span className="font-semibold">{formatDisplayDate(contrat.date_debut)}</span> et s'achèvera au{" "}
              <span className="font-semibold">{formatDisplayDate(contrat.date_fin)}</span>, sauf résiliation anticipée dans les
              conditions prévues par les parties.
            </p>
          </section>
        ) : null}
      </main>

      {/* Pied de page avec signatures */}
      <footer className="mt-12 border-t border-zeno-primary/30 pt-6">
        <div className="grid grid-cols-2 gap-14 text-xs">
          <div className="flex flex-col gap-4">
            <p className="font-semibold text-zeno-secondary">Pour le Prestataire</p>
            <p className="font-medium">{from?.name || "-"}</p>
            <p className="mt-8">Signature : __________________________</p>
            <p className="font-medium">{from?.issuerName || from?.name || "-"}</p>
            {from?.email ? <p className="text-muted-foreground">{from.email}</p> : null}
            {from?.taxId ? <p className="text-muted-foreground">N° RC : {from.taxId}</p> : null}
          </div>
          <div className="flex flex-col gap-4 text-right">
            <p className="font-semibold text-zeno-secondary">Pour le Client</p>
            <p className="font-medium">{to?.name || "-"}</p>
            <p className="mt-8">Signature et cachet : __________________________</p>
            <p className="text-muted-foreground">Date : {formatDisplayDate(contrat.date_signature) || "____/____/________"}</p>
          </div>
        </div>
        <p className="mt-8 text-center text-[10px] text-muted-foreground">
          Fait en deux exemplaires originaux, chacun des parties reconnaissant avoir reçu le sien.
        </p>
      </footer>
    </article>
  );
}
