import {
  Banknote,
  Calendar,
  ChartBar,
  CheckSquare,
  FileText,
  FolderKanban,
  Gauge,
  Kanban,
  LayoutDashboard,
  ListTodo,
  type LucideIcon,
  Mail,
  Megaphone,
  MessageSquare,
  ReceiptText,
  ScrollText,
  Users,
  UserRound,
  Wallet,
  BarChart3,
  Briefcase,
  ClipboardList,
  CreditCard,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Tableau de bord",
    items: [
      {
        id: "dashboard",
        title: "Vue d'ensemble",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        id: "stats",
        title: "Statistiques",
        url: "/dashboard/analytics",
        icon: ChartBar,
      },
      {
        id: "productivity",
        title: "Productivité",
        url: "/dashboard/productivity",
        icon: Gauge,
      },
    ],
  },
  {
    id: 2,
    label: "Gestion d'équipe",
    items: [
      {
        id: "kanban",
        title: "Kanban",
        url: "/dashboard/kanban",
        icon: Kanban,
        badge: "new",
      },
      {
        id: "tasks",
        title: "Tâches",
        url: "/dashboard/tasks",
        icon: CheckSquare,
      },
      {
        id: "users",
        title: "Membres",
        url: "/dashboard/users",
        icon: Users,
      },
    ],
  },
  {
    id: 3,
    label: "Gestion de projet",
    items: [
      {
        id: "projects",
        title: "Projets",
        url: "/dashboard/projects",
        icon: Briefcase,
        badge: "new",
      },
      {
        id: "clients",
        title: "Clients",
        url: "/dashboard/crm",
        icon: UserRound,
      },
    ],
  },
  {
    id: 4,
    label: "Documents",
    items: [
      {
        id: "devis",
        title: "Devis",
        url: "/dashboard/devis",
        icon: FileText,
        badge: "new",
      },
      {
        id: "contrats",
        title: "Contrats",
        url: "/dashboard/contrats",
        icon: ScrollText,
        badge: "new",
      },
      {
        id: "factures",
        title: "Factures",
        url: "/dashboard/invoice",
        icon: ReceiptText,
      },
    ],
  },
  {
    id: 5,
    label: "Finances",
    items: [
      {
        id: "finance",
        title: "Tableau de bord",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        id: "transactions",
        title: "Transactions",
        url: "/dashboard/transactions",
        icon: CreditCard,
        badge: "new",
      },
    ],
  },
  {
    id: 6,
    label: "Reporting",
    items: [
      {
        id: "rapports",
        title: "Rapports",
        url: "/dashboard/rapports",
        icon: ClipboardList,
        badge: "new",
      },
      {
        id: "annonces",
        title: "Annonces",
        url: "/dashboard/annonces",
        icon: Megaphone,
        badge: "new",
      },
    ],
  },
  {
    id: 7,
    label: "Communication",
    items: [
      {
        id: "mail",
        title: "Email",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        id: "chat",
        title: "Chat",
        url: "/dashboard/chat",
        icon: MessageSquare,
      },
      {
        id: "calendar",
        title: "Calendrier",
        url: "/dashboard/calendar",
        icon: Calendar,
      },
    ],
  },
];
