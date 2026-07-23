// Ce fichier n'est plus utilisé - les données viennent de Supabase
import type { BoardState, Column, TaskOwnerProfile, TaskTeam } from "./types";

export const columns = [
  { id: "todo", title: "À faire" },
  { id: "in-progress", title: "En cours" },
  { id: "cancelled", title: "Annulé" },
  { id: "done", title: "Terminé" },
] as const satisfies readonly Column[];

export const columnIds = columns.map((column) => column.id);

// Tags pour l'affichage des badges
export const tagTones: Record<string, string> = {
  Terrain: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Bureau: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Finance: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Commercial: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  Direction: "bg-red-500/10 text-red-700 dark:text-red-300",
  Rapport: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  Admin: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  "Sans projet": "bg-gray-500/10 text-gray-700 dark:text-gray-300",
};

// Ceci n'est plus utilisé - les données viennent de la base
export const initialBoard: BoardState = {
  todo: [],
  "in-progress": [],
  cancelled: [],
  done: [],
};
