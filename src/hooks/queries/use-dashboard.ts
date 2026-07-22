import { useQuery } from "@tanstack/react-query";
import {
  getKPI,
  getQuickStats,
  getChartData,
  getProductivity,
  getStats,
} from "@/lib/actions/dashboard";

// Clés de cache
export const dashboardKeys = {
  all: ["dashboard"] as const,
  kpi: () => [...dashboardKeys.all, "kpi"] as const,
  quickStats: () => [...dashboardKeys.all, "quick-stats"] as const,
  charts: () => [...dashboardKeys.all, "charts"] as const,
  productivity: () => [...dashboardKeys.all, "productivity"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

// Hook pour les KPI
export function useDashboardKPI(period?: "day" | "week" | "month" | "year") {
  return useQuery({
    queryKey: dashboardKeys.kpi(),
    queryFn: () => getKPI({ period }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour les statistiques rapides
export function useQuickStats() {
  return useQuery({
    queryKey: dashboardKeys.quickStats(),
    queryFn: () => getQuickStats(),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour les données des graphiques
export function useChartData() {
  return useQuery({
    queryKey: dashboardKeys.charts(),
    queryFn: () => getChartData(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook pour la productivité
export function useProductivity(
  period?: "week" | "month" | "quarter" | "year",
) {
  return useQuery({
    queryKey: dashboardKeys.productivity(),
    queryFn: () => getProductivity({ period }),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour les statistiques (nouveau)
export function useStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => getStats(),
    staleTime: 5 * 60 * 1000,
  });
}
