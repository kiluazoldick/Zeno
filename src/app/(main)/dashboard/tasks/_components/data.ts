import { z } from "zod";

// Schéma pour les tâches
const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  assignee: z.string(),
  date: z.string(),
  location: z.string(),
  reportDone: z.boolean(),
});

export type Task = z.infer<typeof taskSchema>;

// Données mockées de fallback
export const fallbackTasks: Task[] = [
  {
    id: "TASK-001",
    title: "Finaliser rapport chantier Banto",
    status: "À faire",
    label: "Rapport",
    priority: "haute",
    assignee: "Sarah M.",
    date: "15 Juin 2026",
    location: "Douala",
    reportDone: false,
  },
  {
    id: "TASK-002",
    title: "Préparer devis Hôpital Central",
    status: "À faire",
    label: "Devis",
    priority: "haute",
    assignee: "Jean K.",
    date: "18 Juin 2026",
    location: "Yaoundé",
    reportDone: false,
  },
  {
    id: "TASK-003",
    title: "Réunion prospection complexe sportif",
    status: "À faire",
    label: "Réunion",
    priority: "moyenne",
    assignee: "Paul B.",
    date: "20 Juin 2026",
    location: "Bafoussam",
    reportDone: false,
  },
  {
    id: "TASK-004",
    title: "Mise à jour planning chantier Hôtel Royal",
    status: "À faire",
    label: "Chantier",
    priority: "moyenne",
    assignee: "Marie L.",
    date: "22 Juin 2026",
    location: "Douala",
    reportDone: false,
  },
  {
    id: "TASK-005",
    title: "Rédaction contrat Hôtel Royal",
    status: "En cours",
    label: "Contrat",
    priority: "haute",
    assignee: "Nanga D.",
    date: "14 Juin 2026",
    location: "Douala",
    reportDone: false,
  },
  {
    id: "TASK-006",
    title: "Suivi chantier Immeuble Banto",
    status: "En cours",
    label: "Chantier",
    priority: "haute",
    assignee: "Sarah M.",
    date: "16 Juin 2026",
    location: "Douala",
    reportDone: false,
  },
  {
    id: "TASK-007",
    title: "Rapport financier mensuel",
    status: "En cours",
    label: "Finance",
    priority: "haute",
    assignee: "Marie L.",
    date: "19 Juin 2026",
    location: "Bureau",
    reportDone: false,
  },
  {
    id: "TASK-008",
    title: "Devis Marché Municipal - Validé",
    status: "Terminé",
    label: "Devis",
    priority: "haute",
    assignee: "Jean K.",
    date: "5 Juin 2026",
    location: "Douala",
    reportDone: true,
  },
  {
    id: "TASK-009",
    title: "Rapport chantier Banto phase 1",
    status: "Terminé",
    label: "Rapport",
    priority: "haute",
    assignee: "Sarah M.",
    date: "7 Juin 2026",
    location: "Douala",
    reportDone: true,
  },
  {
    id: "TASK-010",
    title: "Contrat Hôtel Royal - Signé",
    status: "Terminé",
    label: "Contrat",
    priority: "haute",
    assignee: "Nanga D.",
    date: "10 Juin 2026",
    location: "Douala",
    reportDone: true,
  },
];

export const labels = [
  { value: "rapport", label: "Rapport" },
  { value: "devis", label: "Devis" },
  { value: "contrat", label: "Contrat" },
  { value: "facture", label: "Facture" },
  { value: "chantier", label: "Chantier" },
  { value: "réunion", label: "Réunion" },
  { value: "projet", label: "Projet" },
  { value: "finance", label: "Finance" },
];

export const statuses = [
  { value: "À faire", label: "À faire", icon: Circle },
  { value: "En cours", label: "En cours", icon: Timer },
  { value: "Annulé", label: "Annulé", icon: CircleOff },
  { value: "Terminé", label: "Terminé", icon: CheckCircle },
];

export const priorities = [
  { label: "Basse", value: "basse", icon: ArrowDown },
  { label: "Moyenne", value: "moyenne", icon: ArrowRight },
  { label: "Haute", value: "haute", icon: ArrowUp },
];

// Imports pour les icônes
import {
  Circle,
  Timer,
  CircleOff,
  CheckCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
