import type { Report } from "@/types/database";

export const fallbackRapports: Report[] = [
  {
    id: "RPT-001",
    titre: "Rapport chantier Banto - Semaine 25",
    type: "Hebdomadaire",
    projet_id: null,
    task_id: null,
    auteur: null,
    periode: "15-21 Juin 2026",
    date_rapport: "2026-06-22",
    statut: "Validé",
    description: "Synthèse hebdomadaire du chantier Banto",
    contenu: "Cette semaine, les travaux de fondation ont été achevés.",
    metriques: {
      tachesCompletees: 12,
      budgetUtilise: 58500000,
      budgetTotal: 85000000,
      progression: 68,
    },
    prochaines_etapes: [
      "Coulage du béton - Semaine 26",
      "Installation des armatures - Semaine 27",
    ],
    problemes: ["Retard de livraison des ciments - Résolu"],
    created_at: "",
    updated_at: "",
  },
  {
    id: "RPT-002",
    titre: "Synthèse financière juin 2026",
    type: "Mensuel",
    projet_id: null,
    task_id: null,
    auteur: null,
    periode: "1-30 Juin 2026",
    date_rapport: "2026-06-30",
    statut: "En cours",
    description: "Bilan financier du mois de juin",
    contenu: "Le chiffre d'affaires du mois est de 18 450 000 FCFA.",
    metriques: {
      tachesCompletees: 28,
      budgetUtilise: 12234000,
      budgetTotal: 15000000,
      progression: 82,
    },
    prochaines_etapes: ["Finaliser le rapport pour la direction"],
    problemes: ["Factures en attente de paiement - 3 clients"],
    created_at: "",
    updated_at: "",
  },
  {
    id: "RPT-003",
    titre: "Réunion de chantier Hôtel Royal",
    type: "Réunion",
    projet_id: null,
    task_id: null,
    auteur: null,
    periode: "18 Juin 2026",
    date_rapport: "2026-06-18",
    statut: "Validé",
    description: "Compte rendu de la réunion de chantier",
    contenu: "Points abordés : avancement des travaux, planning des finitions.",
    metriques: {
      tachesCompletees: 8,
      budgetUtilise: 18200000,
      budgetTotal: 42500000,
      progression: 45,
    },
    prochaines_etapes: ["Début des finitions - Semaine 27"],
    problemes: [],
    created_at: "",
    updated_at: "",
  },
];

export const statusColors: Record<string, string> = {
  Brouillon: "border-muted-foreground/20 bg-muted text-muted-foreground",
  "En cours":
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Validé:
    "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
  Archivé:
    "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};
