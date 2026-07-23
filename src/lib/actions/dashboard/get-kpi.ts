"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getKPISchema = z.object({
  period: z.enum(["day", "week", "month", "year"]).default("month"),
});

export type GetKPIOptions = z.infer<typeof getKPISchema>;

export async function getKPI(options?: GetKPIOptions) {
  const supabase = await createServerClient();

  // Récupérer les KPI depuis la vue dashboard_kpi
  let kpiData = null;
  try {
    const { data, error } = await supabase
      .from("dashboard_kpi")
      .select("*")
      .single();

    if (error) {
      console.error("Erreur dashboard_kpi:", error);
    } else {
      kpiData = data;
    }
  } catch (error) {
    console.error("Erreur:", error);
  }

  // Récupérer les transactions du mois en cours
  const startOfPeriod = new Date();
  startOfPeriod.setDate(1);
  startOfPeriod.setHours(0, 0, 0, 0);

  let transactions = [];
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("type, montant, statut")
      .eq("statut", "Réalisée")
      .gte("date_transaction", startOfPeriod.toISOString().split("T")[0]);

    if (error) {
      console.error("Erreur transactions:", error);
    } else {
      transactions = data || [];
    }
  } catch (error) {
    console.error("Erreur:", error);
  }

  // Calculer les entrées et sorties du mois
  const entries =
    transactions?.filter((t) => t.type === "Entrée Réalisée") || [];
  const expenses =
    transactions?.filter((t) => t.type === "Dépense Réalisé") || [];

  const totalEntries = entries.reduce((sum, t) => sum + t.montant, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.montant, 0);

  // Récupérer les tâches
  let tasks = [];
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("statut")
      .gte("created_at", startOfPeriod.toISOString());

    if (error) {
      console.error("Erreur tâches:", error);
    } else {
      tasks = data || [];
    }
  } catch (error) {
    console.error("Erreur:", error);
  }

  const tasksByStatus = tasks?.reduce(
    (acc, task) => {
      const statut = task.statut || "À faire";
      acc[statut] = (acc[statut] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Récupérer les devis
  let devis = [];
  try {
    const { data, error } = await supabase
      .from("devis")
      .select("statut, montant_total")
      .gte("created_at", startOfPeriod.toISOString());

    if (error) {
      console.error("Erreur devis:", error);
    } else {
      devis = data || [];
    }
  } catch (error) {
    console.error("Erreur:", error);
  }

  const totalDevis =
    devis?.reduce((sum, d) => sum + (d.montant_total || 0), 0) || 0;
  const devisAcceptes = devis?.filter((d) => d.statut === "Accepté") || [];

  // Construire l'objet retour avec les vraies données ou 0
  return {
    projetsActifs: kpiData?.projets_actifs || 0,
    projetsTermines: kpiData?.projets_termines || 0,
    tachesAFaire: kpiData?.taches_a_faire || 0,
    tachesEnCours: kpiData?.taches_en_cours || 0,
    tachesTerminees: kpiData?.taches_terminees || 0,
    tachesAnnulees: kpiData?.taches_annulees || 0,
    caMois: kpiData?.ca_mois || 0,
    depensesMois: kpiData?.depenses_mois || 0,
    beneficeMois: (kpiData?.ca_mois || 0) - (kpiData?.depenses_mois || 0),
    devisEnvoyes: kpiData?.devis_envoyes || 0,
    devisAcceptes: kpiData?.devis_acceptes || 0,
    facturesPayees: kpiData?.factures_payees || 0,
    facturesImpayees: kpiData?.factures_impayees || 0,

    details: {
      transactions: {
        entries: entries.length,
        expenses: expenses.length,
        totalEntries,
        totalExpenses,
      },
      tasks: {
        total: tasks?.length || 0,
        byStatus: tasksByStatus || {},
      },
      devis: {
        total: devis?.length || 0,
        totalAmount: totalDevis,
        accepted: devisAcceptes.length,
        acceptedAmount: devisAcceptes.reduce(
          (sum, d) => sum + (d.montant_total || 0),
          0,
        ),
      },
    },
  };
}

// Récupérer les KPI de la sidebar (version simplifiée)
export async function getQuickStats() {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("quick_stats")
      .select("*")
      .single();

    if (error) {
      console.error("Erreur quick_stats:", error);
      return {
        membres_actifs: 0,
        projets_actifs: 0,
        taches_terminees: 0,
        taches_a_faire: 0,
        total_clients: 0,
        total_entrees: 0,
        total_sorties: 0,
        devis_acceptes: 0,
        factures_payees: 0,
      };
    }

    return data;
  } catch (error) {
    console.error("Erreur:", error);
    return {
      membres_actifs: 0,
      projets_actifs: 0,
      taches_terminees: 0,
      taches_a_faire: 0,
      total_clients: 0,
      total_entrees: 0,
      total_sorties: 0,
      devis_acceptes: 0,
      factures_payees: 0,
    };
  }
}
