export type UserStatus =
  | "Actif"
  | "Invitation en attente"
  | "Désactivé"
  | "Verrouillé"
  | "Suspendu";

const teamValues = [
  "Direction",
  "Terrain",
  "Bureau",
  "Finance",
  "Commercial",
  "Rapport",
  "Admin",
] as const;

export type UserTeam = (typeof teamValues)[number];

export type UserRow = {
  email: string;
  joinedDate: string;
  lastActive: number;
  name: string;
  role: string;
  status: UserStatus;
  team: UserTeam;
  workspace: string[];
};

// Données mockées de fallback (utilisées si la base est vide)
export const defaultUsers: UserRow[] = [
  {
    name: "Nanga Doumer",
    email: "nanga.doumer@zoldick.cm",
    role: "Directeur Général",
    status: "Actif",
    team: "Direction",
    workspace: ["Tous les projets"],
    joinedDate: "01 Jan 2020, 8:00 AM",
    lastActive: 0,
  },
  {
    name: "Sarah M.",
    email: "sarah.m@zoldick.cm",
    role: "Chef de chantier",
    status: "Actif",
    team: "Terrain",
    workspace: ["Banto", "Hôtel Royal"],
    joinedDate: "15 Mar 2022, 9:30 AM",
    lastActive: 5,
  },
  {
    name: "Jean K.",
    email: "jean.k@zoldick.cm",
    role: "Responsable Commercial",
    status: "Actif",
    team: "Commercial",
    workspace: ["Hôpital Central", "Marché Municipal"],
    joinedDate: "19 Mai 2022, 3:00 PM",
    lastActive: 20,
  },
  {
    name: "Marie L.",
    email: "marie.l@zoldick.cm",
    role: "Responsable Financier",
    status: "Actif",
    team: "Finance",
    workspace: ["Tous les projets"],
    joinedDate: "10 Avr 2022, 8:30 AM",
    lastActive: 15,
  },
  {
    name: "Paul B.",
    email: "paul.b@zoldick.cm",
    role: "Commercial",
    status: "Actif",
    team: "Commercial",
    workspace: ["Marché Municipal", "Complexe Sportif"],
    joinedDate: "28 Fév 2023, 10:20 AM",
    lastActive: 8,
  },
  {
    name: "Claire R.",
    email: "claire.r@zoldick.cm",
    role: "Assistante Administrative",
    status: "Actif",
    team: "Admin",
    workspace: ["Tous les projets"],
    joinedDate: "20 Mai 2021, 2:45 PM",
    lastActive: 12,
  },
];

export const filters = {
  role: [
    "Tous",
    "Directeur Général",
    "Responsable Financier",
    "Responsable Commercial",
    "Chef de chantier",
    "Chef de projet",
    "Ingénieur",
    "Architecte",
    "Dessinateur",
    "Technicien",
    "Comptable",
    "Chargé de projet",
    "Assistante Administrative",
    "Secrétaire",
    "Chargée de com",
    "Magasinier",
    "Chauffeur",
    "Conducteur",
    "Rapporteur",
    "Administrateur",
    "Assistant",
    "Responsable RH",
    "Stagiaire",
    "Consultant",
    "Ancien employé",
  ],
  team: ["Tous", ...teamValues],
  status: [
    "Tous",
    "Actif",
    "Invitation en attente",
    "Désactivé",
    "Verrouillé",
    "Suspendu",
  ],
  workspace: [
    "Tous",
    "Tous les projets",
    "Banto",
    "Hôtel Royal",
    "Hôpital Central",
    "Complexe Sportif",
    "Marché Municipal",
  ],
};

export const statusMeta: Record<
  UserStatus,
  { badgeClass: string; dotClass: string }
> = {
  Actif: {
    badgeClass:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  "Invitation en attente": {
    badgeClass:
      "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  Désactivé: {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  Verrouillé: {
    badgeClass: "border-destructive/20 bg-destructive/10 text-destructive",
    dotClass: "bg-destructive",
  },
  Suspendu: {
    badgeClass:
      "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400",
    dotClass: "bg-orange-500",
  },
};
