import type { Annonce } from "@/types/database";

export const fallbackAnnonces: Annonce[] = [
  {
    id: "ANN-001",
    titre: "Réunion générale - Planning mensuel",
    contenu:
      "Réunion de planification pour le mois de juillet. Ordre du jour : bilan des projets en cours, allocation des ressources, et objectifs du mois.",
    auteur: null,
    importance: "Haute",
    statut: "Publiée",
    date_annonce: new Date().toISOString(),
    date_reunion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tags: ["Réunion", "Planning", "Équipe"],
    commentaires_count: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "ANN-002",
    titre: "Report chantier Banto - Intempéries",
    contenu:
      "Suite aux fortes pluies annoncées, les travaux sur le chantier Banto sont reportés à la semaine prochaine.",
    auteur: null,
    importance: "Haute",
    statut: "Publiée",
    date_annonce: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    date_reunion: null,
    tags: ["Chantier", "Banto", "Report"],
    commentaires_count: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "ANN-003",
    titre: "Nouveau processus de validation",
    contenu:
      "À partir de cette semaine, tous les rapports devront être validés par le responsable de projet.",
    auteur: null,
    importance: "Normale",
    statut: "Publiée",
    date_annonce: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    date_reunion: null,
    tags: ["Processus", "Validation", "Rapports"],
    commentaires_count: 8,
    created_at: "",
    updated_at: "",
  },
  {
    id: "ANN-004",
    titre: "État d'avancement Hôtel Royal",
    contenu:
      "Le chantier de rénovation de l'Hôtel Royal est dans les temps. Les finitions sont prévues pour la fin du mois.",
    auteur: null,
    importance: "Normale",
    statut: "Publiée",
    date_annonce: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    date_reunion: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tags: ["Hôtel Royal", "Chantier", "Avancement"],
    commentaires_count: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "ANN-005",
    titre: "Changement d'horaires - Période de chaleur",
    contenu:
      "En raison des fortes chaleurs, les horaires de travail sont modifiés. Les équipes terrain commenceront à 06h00.",
    auteur: null,
    importance: "Haute",
    statut: "Publiée",
    date_annonce: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    date_reunion: null,
    tags: ["Horaires", "Équipe", "Terrain"],
    commentaires_count: 12,
    created_at: "",
    updated_at: "",
  },
];

export const importanceColors: Record<string, string> = {
  Haute: "border-destructive/20 bg-destructive/10 text-destructive",
  Normale: "border-zeno-primary/20 bg-zeno-primary/10 text-zeno-primary",
  Basse: "border-muted/20 bg-muted/10 text-muted-foreground",
};

export const statusColors: Record<string, string> = {
  Brouillon: "border-muted-foreground/20 bg-muted text-muted-foreground",
  Publiée:
    "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
  Archivée:
    "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};
