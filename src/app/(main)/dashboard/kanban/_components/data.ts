import type { BoardState, Column, TaskOwnerProfile, TaskTeam } from "./types";

// Colonnes adaptées aux statuts Notion
export const columns = [
  { id: "todo", title: "À faire" },
  { id: "in-progress", title: "En cours" },
  { id: "cancelled", title: "Annulé" },
  { id: "done", title: "Terminé" },
] as const satisfies readonly Column[];

export const columnIds = columns.map((column) => column.id);

// Couleurs par équipe
export const tagTones: Record<TaskTeam, string> = {
  Terrain: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Bureau: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Finance: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Commercial: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  Direction: "bg-red-500/10 text-red-700 dark:text-red-300",
  Rapport: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  Admin: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

// Profils des membres de l'équipe
const taskOwners = {
  nanga: {
    name: "Nanga Doumer",
    tone: "[&_[data-slot=avatar-fallback]]:bg-cyan-100 [&_[data-slot=avatar-fallback]]:text-cyan-700 after:border-cyan-200 dark:[&_[data-slot=avatar-fallback]]:bg-cyan-500/15 dark:[&_[data-slot=avatar-fallback]]:text-cyan-300 dark:after:border-cyan-500/20",
  },
  sarah: {
    name: "Sarah M.",
    tone: "[&_[data-slot=avatar-fallback]]:bg-emerald-100 [&_[data-slot=avatar-fallback]]:text-emerald-700 after:border-emerald-200 dark:[&_[data-slot=avatar-fallback]]:bg-emerald-500/15 dark:[&_[data-slot=avatar-fallback]]:text-emerald-300 dark:after:border-emerald-500/20",
  },
  jean: {
    name: "Jean K.",
    tone: "[&_[data-slot=avatar-fallback]]:bg-amber-100 [&_[data-slot=avatar-fallback]]:text-amber-700 after:border-amber-200 dark:[&_[data-slot=avatar-fallback]]:bg-amber-500/15 dark:[&_[data-slot=avatar-fallback]]:text-amber-300 dark:after:border-amber-500/20",
  },
  marie: {
    name: "Marie L.",
    tone: "[&_[data-slot=avatar-fallback]]:bg-purple-100 [&_[data-slot=avatar-fallback]]:text-purple-700 after:border-purple-200 dark:[&_[data-slot=avatar-fallback]]:bg-purple-500/15 dark:[&_[data-slot=avatar-fallback]]:text-purple-300 dark:after:border-purple-500/20",
  },
  paul: {
    name: "Paul B.",
    tone: "[&_[data-slot=avatar-fallback]]:bg-red-100 [&_[data-slot=avatar-fallback]]:text-red-700 after:border-red-200 dark:[&_[data-slot=avatar-fallback]]:bg-red-500/15 dark:[&_[data-slot=avatar-fallback]]:text-red-300 dark:after:border-red-500/20",
  },
  claire: {
    name: "Claire R.",
    tone: "[&_[data-slot=avatar-fallback]]:bg-blue-100 [&_[data-slot=avatar-fallback]]:text-blue-700 after:border-blue-200 dark:[&_[data-slot=avatar-fallback]]:bg-blue-500/15 dark:[&_[data-slot=avatar-fallback]]:text-blue-300 dark:after:border-blue-500/20",
  },
} satisfies Record<string, TaskOwnerProfile>;

// Données initiales du Kanban
export const initialBoard: BoardState = {
  // 📋 À FAIRE
  todo: [
    {
      id: "tache-001",
      title: "Finaliser rapport chantier Banto",
      description: "Rédiger le rapport d'avancement du chantier Banto pour la réunion de demain.",
      priority: "Haute",
      dueDate: "15 Juin",
      location: "Douala",
      reportDone: false,
      progress: 0,
      owner: taskOwners.sarah,
      team: "Rapport",
      insights: [
        { label: "Documents", count: 2 },
        { label: "Comments", count: 3 },
      ],
    },
    {
      id: "tache-002",
      title: "Préparer devis Hôpital Central",
      description: "Élaborer le devis pour l'extension de l'aile pédiatrique.",
      priority: "Haute",
      dueDate: "18 Juin",
      location: "Yaoundé",
      reportDone: false,
      progress: 0,
      owner: taskOwners.jean,
      team: "Commercial",
      insights: [
        { label: "Documents", count: 3 },
        { label: "Comments", count: 5 },
      ],
    },
    {
      id: "tache-003",
      title: "Réunion prospection client",
      description: "Rencontre avec le promoteur pour le projet de complexe sportif.",
      priority: "Moyenne",
      dueDate: "20 Juin",
      location: "Bafoussam",
      reportDone: false,
      progress: 0,
      owner: taskOwners.paul,
      team: "Commercial",
      insights: [{ label: "Comments", count: 2 }],
    },
    {
      id: "tache-004",
      title: "Mise à jour planning chantier",
      description: "Réviser le planning du chantier Hôtel Royal suite aux intempéries.",
      priority: "Moyenne",
      dueDate: "22 Juin",
      location: "Douala",
      reportDone: false,
      progress: 0,
      owner: taskOwners.marie,
      team: "Terrain",
      insights: [
        { label: "Documents", count: 1 },
        { label: "Comments", count: 4 },
      ],
    },
    {
      id: "tache-005",
      title: "Commander matériaux chantier",
      description: "Passer la commande de matériaux pour la phase 2 du projet.",
      priority: "Basse",
      dueDate: "25 Juin",
      location: "Douala",
      reportDone: false,
      progress: 0,
      owner: taskOwners.claire,
      team: "Admin",
      insights: [{ label: "Comments", count: 1 }],
    },
  ],

  // ⚡ EN COURS
  "in-progress": [
    {
      id: "tache-006",
      title: "Rédaction contrat Hôtel Royal",
      description: "Préparer le contrat de rénovation pour l'Hôtel Royal.",
      priority: "Haute",
      dueDate: "14 Juin",
      location: "Douala",
      reportDone: false,
      progress: 75,
      owner: taskOwners.nanga,
      team: "Direction",
      insights: [
        { label: "Documents", count: 5 },
        { label: "Comments", count: 8 },
        { label: "Attachments", count: 3 },
      ],
    },
    {
      id: "tache-007",
      title: "Suivi chantier Immeuble Banto",
      description: "Superviser l'avancement des travaux sur le chantier Banto.",
      priority: "Haute",
      dueDate: "16 Juin",
      location: "Douala",
      reportDone: false,
      progress: 65,
      owner: taskOwners.sarah,
      team: "Terrain",
      insights: [
        { label: "Documents", count: 4 },
        { label: "Comments", count: 6 },
        { label: "Attachments", count: 2 },
      ],
    },
    {
      id: "tache-008",
      title: "Rapport financier mensuel",
      description: "Préparer le rapport des dépenses et recettes du mois.",
      priority: "Haute",
      dueDate: "19 Juin",
      location: "Bureau",
      reportDone: false,
      progress: 45,
      owner: taskOwners.marie,
      team: "Finance",
      insights: [
        { label: "Documents", count: 3 },
        { label: "Comments", count: 4 },
      ],
    },
    {
      id: "tache-009",
      title: "Facturation client Banto",
      description: "Émettre la facture intermédiaire pour le projet Banto.",
      priority: "Moyenne",
      dueDate: "21 Juin",
      location: "Douala",
      reportDone: false,
      progress: 30,
      owner: taskOwners.jean,
      team: "Finance",
      insights: [
        { label: "Documents", count: 2 },
        { label: "Comments", count: 3 },
      ],
    },
  ],

  // ❌ ANNULÉ
  cancelled: [
    {
      id: "tache-010",
      title: "Projet école primaire",
      description: "Projet annulé suite à changement de budget du ministère.",
      priority: "Moyenne",
      dueDate: "10 Mai",
      location: "Yaoundé",
      reportDone: true,
      progress: 0,
      owner: taskOwners.paul,
      team: "Commercial",
      insights: [{ label: "Comments", count: 4 }],
    },
    {
      id: "tache-011",
      title: "Rénovation siège social",
      description: "Projet reporté à l'année prochaine.",
      priority: "Basse",
      dueDate: "15 Mai",
      location: "Douala",
      reportDone: true,
      progress: 0,
      owner: taskOwners.claire,
      team: "Admin",
      insights: [{ label: "Comments", count: 2 }],
    },
  ],

  // ✅ TERMINÉ
  done: [
    {
      id: "tache-012",
      title: "Devis Marché Municipal",
      description: "Devis final validé par le client.",
      priority: "Haute",
      dueDate: "5 Juin",
      location: "Douala",
      reportDone: true,
      progress: 100,
      owner: taskOwners.jean,
      team: "Commercial",
      insights: [
        { label: "Documents", count: 3 },
        { label: "Comments", count: 5 },
      ],
    },
    {
      id: "tache-013",
      title: "Rapport chantier Banto phase 1",
      description: "Rapport de la phase 1 du chantier Banto.",
      priority: "Haute",
      dueDate: "7 Juin",
      location: "Douala",
      reportDone: true,
      progress: 100,
      owner: taskOwners.sarah,
      team: "Rapport",
      insights: [
        { label: "Documents", count: 4 },
        { label: "Comments", count: 6 },
      ],
    },
    {
      id: "tache-014",
      title: "Contrat Hôtel Royal signé",
      description: "Contrat de rénovation signé par les deux parties.",
      priority: "Haute",
      dueDate: "10 Juin",
      location: "Douala",
      reportDone: true,
      progress: 100,
      owner: taskOwners.nanga,
      team: "Direction",
      insights: [
        { label: "Documents", count: 5 },
        { label: "Comments", count: 3 },
      ],
    },
    {
      id: "tache-015",
      title: "Facturation mensuelle",
      description: "Toutes les factures du mois émises.",
      priority: "Moyenne",
      dueDate: "12 Juin",
      location: "Bureau",
      reportDone: true,
      progress: 100,
      owner: taskOwners.marie,
      team: "Finance",
      insights: [
        { label: "Documents", count: 6 },
        { label: "Comments", count: 2 },
      ],
    },
  ],
};
