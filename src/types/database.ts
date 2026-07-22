// ============================================================
// ZOLDICK ENTREPRISE - TYPES DATABASE
// Basé sur le schéma Supabase
// ============================================================

// ============================================================
// 1. TYPES DE BASE (Énumérations)
// ============================================================

export type MemberRole =
  | "direction"
  | "finance"
  | "commercial"
  | "terrain"
  | "bureau"
  | "admin";
export type MemberStatus =
  | "Actif"
  | "Invitation en attente"
  | "Désactivé"
  | "Verrouillé"
  | "Suspendu";
export type MemberEquipe =
  | "Direction"
  | "Terrain"
  | "Bureau"
  | "Finance"
  | "Commercial"
  | "Rapport"
  | "Admin";

export type ProjectStatut = "En cours" | "En attente" | "Terminé" | "Annulé";
export type ProjectPriorite = "Haute" | "Moyenne" | "Basse";

export type TaskStatut = "À faire" | "En cours" | "Annulé" | "Terminé";
export type TaskPriorite = "Haute" | "Moyenne" | "Basse";

export type DevisStatut = "Brouillon" | "Envoyé" | "Accepté" | "Refusé";
export type DevisPriorite = "Haute" | "Moyenne" | "Basse";

export type ContratStatut = "Brouillon" | "En cours" | "Signé" | "Annulé";
export type ContratPriorite = "Haute" | "Moyenne" | "Basse";

export type InvoiceStatut =
  | "Brouillon"
  | "Envoyée"
  | "Payée"
  | "Impayée"
  | "Annulée";
export type InvoicePriorite = "Haute" | "Moyenne" | "Basse";

export type TransactionType =
  | "Entrée Réalisée"
  | "Dépense Réalisé"
  | "Entrée Prévue"
  | "Dépense Prévue";
export type TransactionStatut = "Prévue" | "Réalisée" | "Annulée";

export type ReportType = "Quotidien" | "Hebdomadaire" | "Mensuel" | "Réunion";
export type ReportStatut = "Brouillon" | "En cours" | "Validé" | "Archivé";

export type AnnonceImportance = "Haute" | "Normale" | "Basse";
export type AnnonceStatut = "Brouillon" | "Publiée" | "Archivée";

export type CommentEntityType = "task" | "annonce" | "report";

// ============================================================
// 2. INTERFACES PRINCIPALES
// ============================================================

// 2.1 MEMBERS
export interface Member {
  id: string;
  email: string;
  nom: string;
  prenom: string | null;
  role: MemberRole;
  equipe: MemberEquipe | null;
  avatar_url: string | null;
  status: MemberStatus;
  last_active: string | null;
  joined_date: string;
  created_at: string;
  updated_at: string;
}

export interface MemberInsert {
  email: string;
  nom: string;
  prenom?: string | null;
  role: MemberRole;
  equipe?: MemberEquipe | null;
  avatar_url?: string | null;
  status?: MemberStatus;
  last_active?: string | null;
}

export interface MemberUpdate {
  email?: string;
  nom?: string;
  prenom?: string | null;
  role?: MemberRole;
  equipe?: MemberEquipe | null;
  avatar_url?: string | null;
  status?: MemberStatus;
  last_active?: string | null;
}

// 2.2 CLIENTS
export interface Client {
  id: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  secteur: string | null;
  code_postal: string | null;
  ville: string | null;
  pays: string | null;
  tax_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientInsert {
  nom: string;
  email?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  secteur?: string | null;
  code_postal?: string | null;
  ville?: string | null;
  pays?: string | null;
  tax_id?: string | null;
}

export interface ClientUpdate {
  nom?: string;
  email?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  secteur?: string | null;
  code_postal?: string | null;
  ville?: string | null;
  pays?: string | null;
  tax_id?: string | null;
}

// 2.3 PROJECTS
export interface Project {
  id: string;
  nom: string;
  client_id: string | null;
  description: string | null;
  statut: ProjectStatut;
  priorite: ProjectPriorite;
  budget_total: number | null;
  date_debut: string | null;
  date_fin: string | null;
  progression: number;
  location: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  client?: Client | null;
  tasks?: Task[];
  devis?: Devis[];
  contrats?: Contrat[];
  invoices?: Invoice[];
  reports?: Report[];
}

export interface ProjectInsert {
  nom: string;
  client_id?: string | null;
  description?: string | null;
  statut?: ProjectStatut;
  priorite?: ProjectPriorite;
  budget_total?: number | null;
  date_debut?: string | null;
  date_fin?: string | null;
  progression?: number;
  location?: string | null;
}

export interface ProjectUpdate {
  nom?: string;
  client_id?: string | null;
  description?: string | null;
  statut?: ProjectStatut;
  priorite?: ProjectPriorite;
  budget_total?: number | null;
  date_debut?: string | null;
  date_fin?: string | null;
  progression?: number;
  location?: string | null;
}

// 2.4 TASKS
export interface Task {
  id: string;
  titre: string;
  description: string | null;
  projet_id: string | null;
  assigne_a: string | null;
  statut: TaskStatut;
  priorite: TaskPriorite;
  date_execution: string | null;
  lieu: string | null;
  rapport_effectue: boolean;
  taux: number;
  tags: string[] | null;
  position: number;
  created_at: string;
  updated_at: string;
  // Relations
  projet?: Project | null;
  assigne?: Member | null;
  reports?: Report[];
}

export interface TaskInsert {
  titre: string;
  description?: string | null;
  projet_id?: string | null;
  assigne_a?: string | null;
  statut?: TaskStatut;
  priorite?: TaskPriorite;
  date_execution?: string | null;
  lieu?: string | null;
  rapport_effectue?: boolean;
  taux?: number;
  tags?: string[] | null;
  position?: number;
}

export interface TaskUpdate {
  titre?: string;
  description?: string | null;
  projet_id?: string | null;
  assigne_a?: string | null;
  statut?: TaskStatut;
  priorite?: TaskPriorite;
  date_execution?: string | null;
  lieu?: string | null;
  rapport_effectue?: boolean;
  taux?: number;
  tags?: string[] | null;
  position?: number;
}

// 2.5 DEVIS
export interface DevisLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Devis {
  id: string;
  numero: string;
  client_id: string | null;
  projet_id: string | null;
  titre: string | null;
  statut: DevisStatut;
  priorite: DevisPriorite;
  montant_total: number | null;
  date_emission: string | null;
  date_validite: string | null;
  contenu: DevisLineItem[] | null;
  conditions: string | null;
  notes: string | null;
  taxe_id: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  client?: Client | null;
  projet?: Project | null;
  contrat?: Contrat | null;
}

export interface DevisInsert {
  numero?: string;
  client_id?: string | null;
  projet_id?: string | null;
  titre?: string | null;
  statut?: DevisStatut;
  priorite?: DevisPriorite;
  montant_total?: number | null;
  date_emission?: string | null;
  date_validite?: string | null;
  contenu?: DevisLineItem[] | null;
  conditions?: string | null;
  notes?: string | null;
  taxe_id?: string | null;
}

export interface DevisUpdate {
  numero?: string;
  client_id?: string | null;
  projet_id?: string | null;
  titre?: string | null;
  statut?: DevisStatut;
  priorite?: DevisPriorite;
  montant_total?: number | null;
  date_emission?: string | null;
  date_validite?: string | null;
  contenu?: DevisLineItem[] | null;
  conditions?: string | null;
  notes?: string | null;
  taxe_id?: string | null;
}

// 2.6 CONTRATS
export interface Contrat {
  id: string;
  numero: string;
  client_id: string | null;
  projet_id: string | null;
  devis_id: string | null;
  titre: string | null;
  statut: ContratStatut;
  priorite: ContratPriorite;
  montant_total: number | null;
  date_emission: string | null;
  date_signature: string | null;
  date_debut: string | null;
  date_fin: string | null;
  contenu: DevisLineItem[] | null;
  conditions: string | null;
  clauses: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  client?: Client | null;
  projet?: Project | null;
  devis?: Devis | null;
  invoices?: Invoice[];
}

export interface ContratInsert {
  numero?: string;
  client_id?: string | null;
  projet_id?: string | null;
  devis_id?: string | null;
  titre?: string | null;
  statut?: ContratStatut;
  priorite?: ContratPriorite;
  montant_total?: number | null;
  date_emission?: string | null;
  date_signature?: string | null;
  date_debut?: string | null;
  date_fin?: string | null;
  contenu?: DevisLineItem[] | null;
  conditions?: string | null;
  clauses?: string | null;
  notes?: string | null;
}

export interface ContratUpdate {
  numero?: string;
  client_id?: string | null;
  projet_id?: string | null;
  devis_id?: string | null;
  titre?: string | null;
  statut?: ContratStatut;
  priorite?: ContratPriorite;
  montant_total?: number | null;
  date_emission?: string | null;
  date_signature?: string | null;
  date_debut?: string | null;
  date_fin?: string | null;
  contenu?: DevisLineItem[] | null;
  conditions?: string | null;
  clauses?: string | null;
  notes?: string | null;
}

// 2.7 INVOICES (Factures)
export interface Invoice {
  id: string;
  numero: string;
  client_id: string | null;
  projet_id: string | null;
  contrat_id: string | null;
  titre: string | null;
  statut: InvoiceStatut;
  priorite: InvoicePriorite;
  montant_total: number | null;
  date_emission: string | null;
  date_echeance: string | null;
  date_paiement: string | null;
  contenu: DevisLineItem[] | null;
  conditions: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  client?: Client | null;
  projet?: Project | null;
  contrat?: Contrat | null;
  transactions?: Transaction[];
}

export interface InvoiceInsert {
  numero?: string;
  client_id?: string | null;
  projet_id?: string | null;
  contrat_id?: string | null;
  titre?: string | null;
  statut?: InvoiceStatut;
  priorite?: InvoicePriorite;
  montant_total?: number | null;
  date_emission?: string | null;
  date_echeance?: string | null;
  date_paiement?: string | null;
  contenu?: DevisLineItem[] | null;
  conditions?: string | null;
  notes?: string | null;
}

export interface InvoiceUpdate {
  numero?: string;
  client_id?: string | null;
  projet_id?: string | null;
  contrat_id?: string | null;
  titre?: string | null;
  statut?: InvoiceStatut;
  priorite?: InvoicePriorite;
  montant_total?: number | null;
  date_emission?: string | null;
  date_echeance?: string | null;
  date_paiement?: string | null;
  contenu?: DevisLineItem[] | null;
  conditions?: string | null;
  notes?: string | null;
}

// 2.8 TRANSACTIONS
export interface Transaction {
  id: string;
  description: string;
  type: TransactionType;
  montant: number;
  date_transaction: string;
  responsable: string | null;
  projet_id: string | null;
  invoice_id: string | null;
  categorie: string | null;
  statut: TransactionStatut;
  reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  responsable_member?: Member | null;
  projet?: Project | null;
  invoice?: Invoice | null;
}

export interface TransactionInsert {
  description: string;
  type: TransactionType;
  montant: number;
  date_transaction: string;
  responsable?: string | null;
  projet_id?: string | null;
  invoice_id?: string | null;
  categorie?: string | null;
  statut?: TransactionStatut;
  reference?: string | null;
  notes?: string | null;
}

export interface TransactionUpdate {
  description?: string;
  type?: TransactionType;
  montant?: number;
  date_transaction?: string;
  responsable?: string | null;
  projet_id?: string | null;
  invoice_id?: string | null;
  categorie?: string | null;
  statut?: TransactionStatut;
  reference?: string | null;
  notes?: string | null;
}

// 2.9 REPORTS (Rapports)
export interface Report {
  id: string;
  titre: string;
  type: ReportType;
  projet_id: string | null;
  task_id: string | null;
  auteur: string | null;
  periode: string | null;
  date_rapport: string;
  statut: ReportStatut;
  description: string | null;
  contenu: string | null;
  metriques: ReportMetrics | null;
  prochaines_etapes: string[] | null;
  problemes: string[] | null;
  created_at: string;
  updated_at: string;
  // Relations
  projet?: Project | null;
  task?: Task | null;
  auteur_member?: Member | null;
}

export interface ReportMetrics {
  tachesCompletees: number;
  budgetUtilise: number;
  budgetTotal: number;
  progression: number;
}

export interface ReportInsert {
  titre: string;
  type: ReportType;
  projet_id?: string | null;
  task_id?: string | null;
  auteur?: string | null;
  periode?: string | null;
  date_rapport: string;
  statut?: ReportStatut;
  description?: string | null;
  contenu?: string | null;
  metriques?: ReportMetrics | null;
  prochaines_etapes?: string[] | null;
  problemes?: string[] | null;
}

export interface ReportUpdate {
  titre?: string;
  type?: ReportType;
  projet_id?: string | null;
  task_id?: string | null;
  auteur?: string | null;
  periode?: string | null;
  date_rapport?: string;
  statut?: ReportStatut;
  description?: string | null;
  contenu?: string | null;
  metriques?: ReportMetrics | null;
  prochaines_etapes?: string[] | null;
  problemes?: string[] | null;
}

// 2.10 ANNONCES
export interface Annonce {
  id: string;
  titre: string;
  contenu: string;
  auteur: string | null;
  importance: AnnonceImportance;
  statut: AnnonceStatut;
  date_annonce: string;
  date_reunion: string | null;
  tags: string[] | null;
  commentaires_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  auteur_member?: Member | null;
  comments?: Comment[];
}

export interface AnnonceInsert {
  titre: string;
  contenu: string;
  auteur?: string | null;
  importance?: AnnonceImportance;
  statut?: AnnonceStatut;
  date_annonce?: string;
  date_reunion?: string | null;
  tags?: string[] | null;
  commentaires_count?: number;
}

export interface AnnonceUpdate {
  titre?: string;
  contenu?: string;
  auteur?: string | null;
  importance?: AnnonceImportance;
  statut?: AnnonceStatut;
  date_annonce?: string;
  date_reunion?: string | null;
  tags?: string[] | null;
  commentaires_count?: number;
}

// 2.11 COMMENTS
export interface Comment {
  id: string;
  content: string;
  auteur: string | null;
  entity_type: CommentEntityType;
  entity_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  auteur_member?: Member | null;
  replies?: Comment[];
}

export interface CommentInsert {
  content: string;
  auteur?: string | null;
  entity_type: CommentEntityType;
  entity_id: string;
  parent_id?: string | null;
}

export interface CommentUpdate {
  content?: string;
  auteur?: string | null;
}

// ============================================================
// 3. VUES (Views)
// ============================================================

// 3.1 Dashboard KPI
export interface DashboardKPI {
  projets_actifs: number;
  projets_termines: number;
  taches_a_faire: number;
  taches_en_cours: number;
  taches_terminees: number;
  taches_annulees: number;
  ca_mois: number;
  depenses_mois: number;
  devis_envoyes: number;
  devis_acceptes: number;
  factures_payees: number;
  factures_impayees: number;
}

// 3.2 Member Productivity
export interface MemberProductivity {
  id: string;
  nom: string;
  prenom: string | null;
  role: MemberRole;
  total_taches: number;
  taches_terminees: number;
  taux_productivite: number;
}

// 3.3 Monthly Finances
export interface MonthlyFinances {
  mois: string;
  entrees: number;
  sorties: number;
  solde: number;
}

// 3.4 Project Progress
export interface ProjectProgress {
  id: string;
  nom: string;
  statut: ProjectStatut;
  progression: number;
  date_debut: string | null;
  date_fin: string | null;
  client: string | null;
  total_taches: number;
  taches_terminees: number;
  avancement_taches: number;
}

// 3.5 Quick Stats
export interface QuickStats {
  membres_actifs: number;
  projets_actifs: number;
  taches_terminees: number;
  taches_a_faire: number;
  total_clients: number;
  total_entrees: number;
  total_sorties: number;
  devis_acceptes: number;
  factures_payees: number;
}

// ============================================================
// 4. SUPABASE CLIENT TYPES
// ============================================================

export interface Database {
  public: {
    Tables: {
      members: {
        Row: Member;
        Insert: MemberInsert;
        Update: MemberUpdate;
      };
      clients: {
        Row: Client;
        Insert: ClientInsert;
        Update: ClientUpdate;
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
      tasks: {
        Row: Task;
        Insert: TaskInsert;
        Update: TaskUpdate;
      };
      devis: {
        Row: Devis;
        Insert: DevisInsert;
        Update: DevisUpdate;
      };
      contrats: {
        Row: Contrat;
        Insert: ContratInsert;
        Update: ContratUpdate;
      };
      invoices: {
        Row: Invoice;
        Insert: InvoiceInsert;
        Update: InvoiceUpdate;
      };
      transactions: {
        Row: Transaction;
        Insert: TransactionInsert;
        Update: TransactionUpdate;
      };
      reports: {
        Row: Report;
        Insert: ReportInsert;
        Update: ReportUpdate;
      };
      annonces: {
        Row: Annonce;
        Insert: AnnonceInsert;
        Update: AnnonceUpdate;
      };
      comments: {
        Row: Comment;
        Insert: CommentInsert;
        Update: CommentUpdate;
      };
    };
    Views: {
      dashboard_kpi: DashboardKPI;
      member_productivity: MemberProductivity;
      monthly_finances: MonthlyFinances;
      project_progress: ProjectProgress;
      quick_stats: QuickStats;
    };
  };
}

// ============================================================
// 5. TYPES POUR LES FORMULAIRES (Zod)
// ============================================================

// Ces types seront utilisés avec Zod pour la validation des formulaires
export type FormMember = Omit<Member, "id" | "created_at" | "updated_at">;
export type FormClient = Omit<Client, "id" | "created_at" | "updated_at">;
export type FormProject = Omit<
  Project,
  "id" | "created_at" | "updated_at" | "progression"
>;
export type FormTask = Omit<Task, "id" | "created_at" | "updated_at" | "taux">;
export type FormDevis = Omit<
  Devis,
  "id" | "created_at" | "updated_at" | "numero"
>;
export type FormContrat = Omit<
  Contrat,
  "id" | "created_at" | "updated_at" | "numero"
>;
export type FormInvoice = Omit<
  Invoice,
  "id" | "created_at" | "updated_at" | "numero"
>;
export type FormTransaction = Omit<
  Transaction,
  "id" | "created_at" | "updated_at"
>;
export type FormReport = Omit<Report, "id" | "created_at" | "updated_at">;
export type FormAnnonce = Omit<
  Annonce,
  "id" | "created_at" | "updated_at" | "commentaires_count"
>;
export type FormComment = Omit<Comment, "id" | "created_at" | "updated_at">;

// ============================================================
// 6. TYPES POUR LES STATISTIQUES ET GRAPHIQUES
// ============================================================

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface TaskStatusData {
  status: TaskStatut;
  count: number;
  color: string;
}

export interface ProjectStatusData {
  status: ProjectStatut;
  count: number;
  color: string;
}

export interface MemberProductivityData {
  name: string;
  productivity: number;
  tasks: number;
}
