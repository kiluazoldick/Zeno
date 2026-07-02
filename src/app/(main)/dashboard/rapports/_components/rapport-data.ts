// ============ TYPES ============
export type RapportType = "Quotidien" | "Hebdomadaire" | "Mensuel" | "Réunion";
export type RapportStatus = "Brouillon" | "En cours" | "Validé" | "Archivé";

export type Rapport = {
  id: string;
  titre: string;
  type: RapportType;
  projet: string;
  auteur: string;
  periode: string;
  statut: RapportStatus;
  date: string;
  description: string;
  contenu: string;
  metriques: {
    tachesCompletees: number;
    budgetUtilise: number;
    budgetTotal: number;
    progression: number;
  };
  prochainesEtapes: string[];
  problemes: string[];
};

// ============ DONNÉES MOCKÉES ============
export const rapportsData: Rapport[] = [
  {
    id: "RPT-001",
    titre: "Rapport chantier Banto - Semaine 25",
    type: "Hebdomadaire",
    projet: "Construction Immeuble Banto",
    auteur: "Sarah M.",
    periode: "15-21 Juin 2026",
    statut: "Validé",
    date: "22 Juin 2026",
    description: "Synthèse hebdomadaire du chantier Banto",
    contenu:
      "Cette semaine, les travaux de fondation ont été achevés. Le coulage du béton est programmé pour la semaine prochaine. Tous les matériaux sont disponibles sur site.",
    metriques: {
      tachesCompletees: 12,
      budgetUtilise: 58_500_000,
      budgetTotal: 85_000_000,
      progression: 68,
    },
    prochainesEtapes: [
      "Coulage du béton - Semaine 26",
      "Installation des armatures - Semaine 27",
      "Contrôle qualité - Fin de semaine 27",
    ],
    problemes: [
      "Retard de livraison des ciments - Résolu",
      "Intempéries prévues mercredi - Plan B activé",
    ],
  },
  {
    id: "RPT-002",
    titre: "Synthèse financière juin 2026",
    type: "Mensuel",
    projet: "Tous les projets",
    auteur: "Marie L.",
    periode: "1-30 Juin 2026",
    statut: "En cours",
    date: "30 Juin 2026",
    description: "Bilan financier du mois de juin",
    contenu:
      "Le chiffre d'affaires du mois est de 18 450 000 FCFA, en hausse de 12% par rapport au mois dernier. Les dépenses totales s'élèvent à 12 234 000 FCFA.",
    metriques: {
      tachesCompletees: 28,
      budgetUtilise: 12_234_000,
      budgetTotal: 15_000_000,
      progression: 82,
    },
    prochainesEtapes: [
      "Finaliser le rapport pour la direction",
      "Préparer la réunion bilan",
    ],
    problemes: ["Factures en attente de paiement - 3 clients"],
  },
  {
    id: "RPT-003",
    titre: "Réunion de chantier Hôtel Royal",
    type: "Réunion",
    projet: "Rénovation Hôtel Royal",
    auteur: "Nanga D.",
    periode: "18 Juin 2026",
    statut: "Validé",
    date: "18 Juin 2026",
    description: "Compte rendu de la réunion de chantier",
    contenu:
      "Points abordés : avancement des travaux, planning des finitions, validation des matériaux. Le chantier est dans les temps.",
    metriques: {
      tachesCompletees: 8,
      budgetUtilise: 18_200_000,
      budgetTotal: 42_500_000,
      progression: 45,
    },
    prochainesEtapes: [
      "Début des finitions - Semaine 27",
      "Réception des matériaux - 25 Juin",
    ],
    problemes: [],
  },
  {
    id: "RPT-004",
    titre: "Rapport quotidien 24/06/2026",
    type: "Quotidien",
    projet: "Extension Hôpital Central",
    auteur: "Jean K.",
    periode: "24 Juin 2026",
    statut: "Brouillon",
    date: "24 Juin 2026",
    description: "Suivi journalier du chantier",
    contenu:
      "Aujourd'hui, les fondations de l'aile pédiatrique ont commencé. Le terrassement est en cours.",
    metriques: {
      tachesCompletees: 4,
      budgetUtilise: 45_000_000,
      budgetTotal: 120_000_000,
      progression: 35,
    },
    prochainesEtapes: ["Terrassement - En cours", "Début fondations - 25 Juin"],
    problemes: ["Découverte de roche - Demande d'étude complémentaire"],
  },
  {
    id: "RPT-005",
    titre: "Bilan projet Complexe Sportif",
    type: "Mensuel",
    projet: "Complexe Sportif",
    auteur: "Paul B.",
    periode: "1-15 Juin 2026",
    statut: "Archivé",
    date: "15 Juin 2026",
    description: "Bilan d'étape du projet",
    contenu:
      "Phase 1 du projet terminée avec succès. Les travaux de terrassement sont achevés.",
    metriques: {
      tachesCompletees: 15,
      budgetUtilise: 25_000_000,
      budgetTotal: 95_000_000,
      progression: 25,
    },
    prochainesEtapes: ["Début phase 2 - 1er Juillet"],
    problemes: [],
  },
];

// ============ STATUTS ============
export const statusColors: Record<RapportStatus, string> = {
  Brouillon: "border-muted-foreground/20 bg-muted text-muted-foreground",
  "En cours":
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Validé:
    "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
  Archivé:
    "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

export const typeIcons: Record<RapportType, string> = {
  Quotidien: "📅",
  Hebdomadaire: "📆",
  Mensuel: "📊",
  Réunion: "🤝",
};
