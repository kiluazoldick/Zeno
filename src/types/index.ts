// ============================================================
// ZOLDICK ENTREPRISE - TYPES INDEX
// Point d'entrée pour tous les types
// ============================================================


// Export spécifique pour les composants

// Énumérations

// Point d'entree type pour les tables et vues Supabase.

export * from "./database";

import type { Database, Tables, TablesInsert, TablesUpdate } from "./database";

type PublicTables = Database["public"]["Tables"];
type PublicViews = Database["public"]["Views"];

// Tables principales: lignes, insertions et mises a jour.
export type Annonce = Tables<"annonces">;
export type AnnonceInsert = TablesInsert<"annonces">;
export type AnnonceUpdate = TablesUpdate<"annonces">;

export type Client = Tables<"clients">;
export type ClientInsert = TablesInsert<"clients">;
export type ClientUpdate = TablesUpdate<"clients">;

export type Comment = Tables<"comments">;
export type CommentInsert = TablesInsert<"comments">;
export type CommentUpdate = TablesUpdate<"comments">;

export type Contrat = Tables<"contrats">;
export type ContratInsert = TablesInsert<"contrats">;
export type ContratUpdate = TablesUpdate<"contrats">;

export type Devis = Tables<"devis">;
export type DevisInsert = TablesInsert<"devis">;
export type DevisUpdate = TablesUpdate<"devis">;

export type Invoice = Tables<"invoices">;
export type InvoiceInsert = TablesInsert<"invoices">;
export type InvoiceUpdate = TablesUpdate<"invoices">;

export type Member = Tables<"members">;
export type MemberInsert = TablesInsert<"members">;
export type MemberUpdate = TablesUpdate<"members">;

export type Project = Tables<"projects">;
export type ProjectInsert = TablesInsert<"projects">;
export type ProjectUpdate = TablesUpdate<"projects">;

export type Report = Tables<"reports">;
export type ReportInsert = TablesInsert<"reports">;
export type ReportUpdate = TablesUpdate<"reports">;

export type Task = Tables<"tasks">;
export type TaskInsert = TablesInsert<"tasks">;
export type TaskUpdate = TablesUpdate<"tasks">;

export type Transaction = Tables<"transactions">;
export type TransactionInsert = TablesInsert<"transactions">;
export type TransactionUpdate = TablesUpdate<"transactions">;

// Vues Supabase.
export type DashboardKPI = PublicViews["dashboard_kpi"]["Row"];
export type MemberProductivity = PublicViews["member_productivity"]["Row"];
export type MonthlyFinances = PublicViews["monthly_finances"]["Row"];
export type ProjectProgress = PublicViews["project_progress"]["Row"];
export type QuickStats = PublicViews["quick_stats"]["Row"];

// Alias generique utile pour les composants qui manipulent une table publique.
export type PublicTableName = keyof PublicTables;
export type PublicViewName = keyof PublicViews;
