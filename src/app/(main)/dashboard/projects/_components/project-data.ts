export type ProjectStatus = "En cours" | "En attente" | "Terminé" | "Annulé";
export type ProjectPriority = "Haute" | "Moyenne" | "Basse";

export type Project = {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  amount: string;
  progress: number;
  startDate: string;
  endDate: string;
  priority: ProjectPriority;
  description: string;
  location: string;
};

export const projects: Project[] = [
  {
    id: "PRJ-001",
    name: "Construction Immeuble Banto",
    client: "Groupe Banto",
    status: "En cours",
    amount: "85 000 000",
    progress: 68,
    startDate: "15 Jan 2026",
    endDate: "15 Déc 2026",
    priority: "Haute",
    description: "Construction d'un immeuble commercial R+5 à Douala",
    location: "Douala",
  },
  {
    id: "PRJ-002",
    name: "Rénovation Hôtel Royal",
    client: "Hôtel Royal",
    status: "En cours",
    amount: "42 500 000",
    progress: 45,
    startDate: "01 Mar 2026",
    endDate: "30 Sep 2026",
    priority: "Haute",
    description: "Rénovation complète de l'Hôtel Royal",
    location: "Douala",
  },
  {
    id: "PRJ-003",
    name: "Extension Hôpital Central",
    client: "Hôpital Central",
    status: "En cours",
    amount: "120 000 000",
    progress: 35,
    startDate: "01 Avr 2026",
    endDate: "31 Mar 2027",
    priority: "Haute",
    description: "Construction de l'aile pédiatrique",
    location: "Yaoundé",
  },
  {
    id: "PRJ-004",
    name: "Construction Marché Municipal",
    client: "Mairie Douala",
    status: "En attente",
    amount: "65 000 000",
    progress: 0,
    startDate: "01 Juin 2026",
    endDate: "01 Juin 2027",
    priority: "Moyenne",
    description: "Construction du nouveau marché municipal",
    location: "Douala",
  },
  {
    id: "PRJ-005",
    name: "Complexe Sportif",
    client: "Ministère des Sports",
    status: "En cours",
    amount: "95 000 000",
    progress: 25,
    startDate: "15 Mai 2026",
    endDate: "15 Mai 2027",
    priority: "Haute",
    description: "Construction d'un complexe sportif multifonctionnel",
    location: "Bafoussam",
  },
  {
    id: "PRJ-006",
    name: "Rénovation SIEM",
    client: "SIEM",
    status: "Annulé",
    amount: "15 000 000",
    progress: 0,
    startDate: "01 Fév 2026",
    endDate: "01 Août 2026",
    priority: "Basse",
    description: "Rénovation des bureaux SIEM",
    location: "Douala",
  },
  {
    id: "PRJ-007",
    name: "Villas Résidentielles",
    client: "Promoteur Bonapriso",
    status: "Terminé",
    amount: "38 000 000",
    progress: 100,
    startDate: "01 Déc 2025",
    endDate: "30 Mai 2026",
    priority: "Moyenne",
    description: "Construction de 5 villas résidentielles",
    location: "Douala",
  },
  {
    id: "PRJ-008",
    name: "Aéroport International",
    client: "Aéroport Douala",
    status: "En cours",
    amount: "150 000 000",
    progress: 15,
    startDate: "01 Juin 2026",
    endDate: "01 Déc 2027",
    priority: "Haute",
    description: "Extension et rénovation de l'aéroport",
    location: "Douala",
  },
];
