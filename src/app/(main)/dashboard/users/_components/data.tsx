// src/app/(main)/dashboard/users/_components/data.ts
// Ce fichier contient les types et les données de filtrage

export interface UserRow {
  id?: string;
  name: string;
  email: string;
  role: string;
  status:
    | "Actif"
    | "Invitation en attente"
    | "Désactivé"
    | "Verrouillé"
    | "Suspendu";
  team: string;
  workspace: string[];
  joinedDate: string;
  lastActive: number;
}

export const filters = {
  role: [
    "Tous",
    "Admin",
    "Direction",
    "Finance",
    "Commercial",
    "Terrain",
    "Bureau",
    "Membre",
  ],
  team: [
    "Tous",
    "Direction",
    "Terrain",
    "Bureau",
    "Finance",
    "Commercial",
    "Admin",
  ],
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
    "Marché Municipal",
  ],
};

export const statusMeta: Record<
  UserRow["status"],
  { badgeClass: string; dotClass: string }
> = {
  Actif: {
    badgeClass:
      "border-emerald-500/15 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  "Invitation en attente": {
    badgeClass:
      "border-amber-500/15 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  Désactivé: {
    badgeClass:
      "border-destructive/15 bg-destructive/10 text-destructive dark:bg-destructive/15",
    dotClass: "bg-destructive",
  },
  Verrouillé: {
    badgeClass:
      "border-rose-500/15 bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
    dotClass: "bg-rose-500",
  },
  Suspendu: {
    badgeClass:
      "border-orange-500/15 bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
    dotClass: "bg-orange-500",
  },
};
