// src/app/(main)/dashboard/devis/_components/devis-paper.tsx
"use client";

import {
  DEVIS_PAPER_HEIGHT,
  DEVIS_PAPER_WIDTH,
  type DevisFormValues,
  getDevisItems,
  getDevisTotal,
  getLineAmount,
  formatDevisCurrency,
} from "./devis-data";

export function DevisPaper({
  devis,
}: {
  devis: DevisFormValues | null | undefined;
}) {
  if (!devis) {
    return (
      <div
        style={{ width: DEVIS_PAPER_WIDTH, height: DEVIS_PAPER_HEIGHT }}
        className="flex items-center justify-center bg-white text-muted-foreground"
      >
        Aucun devis à afficher
      </div>
    );
  }

  const items = getDevisItems(devis);
  const total = getDevisTotal(devis);

  return (
    <article
      style={{ width: DEVIS_PAPER_WIDTH, height: DEVIS_PAPER_HEIGHT }}
      data-print-paper
      className="relative flex flex-col gap-4 bg-white px-12 py-10 font-sans text-neutral-950 overflow-y-auto"
    >
      {/* En-tête */}
      <header className="flex flex-col gap-3">
        <div className="flex justify-between items-start border-b-2 border-zeno-primary pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zeno-primary text-white font-bold text-lg">
                Z
              </div>
              <span className="font-bold text-xl text-zeno-primary">
                Zoldick Entreprise
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ndobong Ecole Royale, Douala
            </p>
            <p className="text-xs text-muted-foreground">(237) 6 51 63 25 52</p>
            <p className="text-xs text-muted-foreground">
              zoldickentreprisecontact@gmail.com
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-zeno-primary">
              Offre de service + Devis
            </p>
            <p className="text-sm font-medium">{devis.numero || "Devis"}</p>
            <p className="text-xs text-muted-foreground">
              Date:{" "}
              {devis.date_emission
                ? new Date(devis.date_emission).toLocaleDateString("fr-FR")
                : "-"}
            </p>
            <p className="text-xs text-muted-foreground">
              Validité:{" "}
              {devis.date_validite
                ? new Date(devis.date_validite).toLocaleDateString("fr-FR")
                : "15 jours"}
            </p>
          </div>
        </div>

        {/* Client */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-sm">
              Client: {devis.client_nom || "Non spécifié"}
            </p>
            <p className="text-xs text-muted-foreground">
              Projet: {devis.projet_nom || "Non spécifié"}
            </p>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-zeno-primary/10 text-zeno-primary">
            {devis.statut}
          </span>
        </div>
      </header>

      {/* Corps */}
      <div className="flex-1 space-y-3 text-sm">
        {/* Contexte */}
        {devis.contexte && (
          <div>
            <h3 className="font-semibold text-zeno-secondary text-sm border-b border-zeno-secondary/20 pb-1 mb-2">
              1. Contexte du projet
            </h3>
            <p className="whitespace-pre-wrap text-muted-foreground text-xs leading-relaxed">
              {devis.contexte}
            </p>
          </div>
        )}

        {/* Objectifs */}
        {devis.objectifs && (
          <div>
            <h3 className="font-semibold text-zeno-secondary text-sm border-b border-zeno-secondary/20 pb-1 mb-2">
              2. Objectifs du projet
            </h3>
            <p className="whitespace-pre-wrap text-muted-foreground text-xs leading-relaxed">
              {devis.objectifs}
            </p>
          </div>
        )}

        {/* Architecture */}
        {devis.architecture && (
          <div>
            <h3 className="font-semibold text-zeno-secondary text-sm border-b border-zeno-secondary/20 pb-1 mb-2">
              3. Architecture & Technologies
            </h3>
            <p className="whitespace-pre-wrap text-muted-foreground text-xs leading-relaxed">
              {devis.architecture}
            </p>
          </div>
        )}

        {/* Prestations */}
        {devis.prestations && devis.prestations.length > 0 && (
          <div>
            <h3 className="font-semibold text-zeno-secondary text-sm border-b border-zeno-secondary/20 pb-1 mb-2">
              4. Description des prestations
            </h3>
            {devis.prestations.map((p, i) => (
              <div key={i} className="ml-2 mb-2">
                <p className="font-medium text-xs">{p.titre}</p>
                <p className="text-muted-foreground text-xs">{p.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Planning */}
        {devis.planning && devis.planning.length > 0 && (
          <div>
            <h3 className="font-semibold text-zeno-secondary text-sm border-b border-zeno-secondary/20 pb-1 mb-2">
              5. Planning
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-2 py-1 text-left">Semaine</th>
                    <th className="px-2 py-1 text-left">Tâches</th>
                  </tr>
                </thead>
                <tbody>
                  {devis.planning.map((p, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-2 py-1">{p.semaine}</td>
                      <td className="px-2 py-1">{p.taches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Détail du devis */}
        <div>
          <h3 className="font-semibold text-zeno-secondary text-sm border-b border-zeno-secondary/20 pb-1 mb-2">
            6. Détail du devis
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr>
                  <th className="px-2 py-1 text-left">Description</th>
                  <th className="px-2 py-1 text-right">Qté</th>
                  <th className="px-2 py-1 text-right">Prix unitaire</th>
                  <th className="px-2 py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-2 py-1">{item.description}</td>
                      <td className="px-2 py-1 text-right">{item.quantite}</td>
                      <td className="px-2 py-1 text-right">
                        {formatDevisCurrency(item.prix_unitaire || 0)}
                      </td>
                      <td className="px-2 py-1 text-right font-medium">
                        {formatDevisCurrency(getLineAmount(item))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-2 py-2 text-center text-muted-foreground"
                    >
                      Aucune ligne
                    </td>
                  </tr>
                )}
                <tr className="border-t font-bold bg-muted/30">
                  <td colSpan={3} className="px-2 py-1 text-right">
                    TOTAL
                  </td>
                  <td className="px-2 py-1 text-right text-zeno-primary">
                    {formatDevisCurrency(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modalités de paiement */}
        {devis.modalites_paiement && (
          <div>
            <h3 className="font-semibold text-zeno-secondary text-sm border-b border-zeno-secondary/20 pb-1 mb-2">
              7. Modalités de paiement
            </h3>
            <p className="whitespace-pre-wrap text-muted-foreground text-xs leading-relaxed">
              {devis.modalites_paiement}
            </p>
          </div>
        )}

        {/* Conditions */}
        {devis.conditions && (
          <div>
            <h3 className="font-semibold text-zeno-secondary text-sm border-b border-zeno-secondary/20 pb-1 mb-2">
              8. Conditions
            </h3>
            <p className="whitespace-pre-wrap text-muted-foreground text-xs leading-relaxed">
              {devis.conditions}
            </p>
          </div>
        )}
      </div>

      {/* Signature */}
      <footer className="border-t pt-2 text-xs text-muted-foreground mt-auto">
        <div className="flex justify-between">
          <div>
            <p className="font-medium text-sm">Validation</p>
            <p className="text-xs">Nom et signature du client</p>
            <div className="mt-2 h-8 border-b w-48"></div>
            <p className="text-xs mt-1">Date: _________________</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Zoldick Entreprise</p>
            <p>📍 Douala – Cameroun</p>
            <p>🌐 www.zoldickentreprise.com</p>
            <p>📧 zoldickentreprisecontact@gmail.com</p>
            <p>📞 +237 6 51 63 25 52</p>
          </div>
        </div>
      </footer>
    </article>
  );
}
