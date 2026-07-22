// ============================================================
// ZOLDICK ENTREPRISE - TYPES INDEX
// Point d'entrée pour tous les types
// ============================================================

export * from "./database";

// Export spécifique pour les composants
export type {
  // Entités principales
  Member,
  Client,
  Project,
  Task,
  Devis,
  Contrat,
  Invoice,
  Transaction,
  Report,
  Annonce,
  Comment,

  // Formulaires
  FormMember,
  FormClient,
  FormProject,
  FormTask,
  FormDevis,
  FormContrat,
  FormInvoice,
  FormTransaction,
  FormReport,
  FormAnnonce,
  FormComment,

  // Vues
  DashboardKPI,
  MemberProductivity,
  MonthlyFinances,
  ProjectProgress,
  QuickStats,

  // Graphiques
  ChartDataPoint,
  RevenueChartData,
  TaskStatusData,
  ProjectStatusData,
  MemberProductivityData,
} from "./database";

// Énumérations
export type {
  MemberRole,
  MemberStatus,
  MemberEquipe,
  ProjectStatut,
  ProjectPriorite,
  TaskStatut,
  TaskPriorite,
  DevisStatut,
  DevisPriorite,
  ContratStatut,
  ContratPriorite,
  InvoiceStatut,
  InvoicePriorite,
  TransactionType,
  TransactionStatut,
  ReportType,
  ReportStatut,
  AnnonceImportance,
  AnnonceStatut,
  CommentEntityType,
} from "./database";
