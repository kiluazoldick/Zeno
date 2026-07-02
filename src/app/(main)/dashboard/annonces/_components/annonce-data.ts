// ============ TYPES ============
export type AnnonceImportance = "Haute" | "Normale" | "Basse";
export type AnnonceStatus = "Publiée" | "Archivée" | "Brouillon";

export type Annonce = {
  id: string;
  titre: string;
  contenu: string;
  auteur: string;
  importance: AnnonceImportance;
  status: AnnonceStatus;
  date: string;
  dateReunion?: string;
  tags: string[];
  commentaires: number;
};

// ============ DONNÉES MOCKÉES ============
export const annoncesData: Annonce[] = [
  {
    id: "ANN-001",
    titre: "📢 Réunion générale - Planning mensuel",
    contenu:
      "Réunion de planification pour le mois de juillet. Ordre du jour : bilan des projets en cours, allocation des ressources, et objectifs du mois.",
    auteur: "Nanga Doumer",
    importance: "Haute",
    status: "Publiée",
    date: "01 Juil 2026 à 08:00",
    dateReunion: "03 Juil 2026 à 09:00",
    tags: ["Réunion", "Planning", "Équipe"],
    commentaires: 5,
  },
  {
    id: "ANN-002",
    titre: "⚠️ Report chantier Banto - Intempéries",
    contenu:
      "Suite aux fortes pluies annoncées, les travaux sur le chantier Banto sont reportés à la semaine prochaine. Les équipes sont priées de rester en alerte.",
    auteur: "Sarah M.",
    importance: "Haute",
    status: "Publiée",
    date: "30 Juin 2026 à 14:30",
    dateReunion: undefined,
    tags: ["Chantier", "Banto", "Report"],
    commentaires: 3,
  },
  {
    id: "ANN-003",
    titre: "📋 Nouveau processus de validation",
    contenu:
      "À partir de cette semaine, tous les rapports devront être validés par le responsable de projet avant transmission à la direction. Merci de votre compréhension.",
    auteur: "Nanga Doumer",
    importance: "Normale",
    status: "Publiée",
    date: "28 Juin 2026 à 10:00",
    dateReunion: undefined,
    tags: ["Processus", "Validation", "Rapports"],
    commentaires: 8,
  },
  {
    id: "ANN-004",
    titre: "🏗️ État d'avancement Hôtel Royal",
    contenu:
      "Le chantier de rénovation de l'Hôtel Royal est dans les temps. Les finitions sont prévues pour la fin du mois. Un point est prévu vendredi.",
    auteur: "Nanga Doumer",
    importance: "Normale",
    status: "Publiée",
    date: "26 Juin 2026 à 16:00",
    dateReunion: "28 Juin 2026 à 10:00",
    tags: ["Hôtel Royal", "Chantier", "Avancement"],
    commentaires: 2,
  },
  {
    id: "ANN-005",
    titre: "🔄 Changement d'horaires - Période de chaleur",
    contenu:
      "En raison des fortes chaleurs, les horaires de travail sont modifiés. Les équipes terrain commenceront à 06h00 et termineront à 14h00. À partir du 1er juillet.",
    auteur: "Nanga Doumer",
    importance: "Haute",
    status: "Publiée",
    date: "24 Juin 2026 à 09:15",
    dateReunion: undefined,
    tags: ["Horaires", "Équipe", "Terrain"],
    commentaires: 12,
  },
  {
    id: "ANN-006",
    titre: "📊 Rapport financier juin - Disponible",
    contenu:
      "Le rapport financier du mois de juin est maintenant disponible. Veuillez le consulter et préparer vos questions pour la réunion de bilan.",
    auteur: "Marie L.",
    importance: "Normale",
    status: "Archivée",
    date: "20 Juin 2026 à 11:00",
    dateReunion: undefined,
    tags: ["Finances", "Rapport", "Juin"],
    commentaires: 4,
  },
  {
    id: "ANN-007",
    titre: "📝 Relevé des heures - Juillet",
    contenu:
      "Pensez à envoyer vos relevés d'heures pour le mois de juillet avant le 5 du mois. Merci de votre diligence.",
    auteur: "Claire R.",
    importance: "Basse",
    status: "Brouillon",
    date: "02 Juil 2026 à 07:30",
    dateReunion: undefined,
    tags: ["Administratif", "Heures"],
    commentaires: 0,
  },
];

// ============ COULEURS PAR IMPORTANCE ============
export const importanceColors: Record<AnnonceImportance, string> = {
  Haute: "border-destructive/20 bg-destructive/10 text-destructive",
  Normale: "border-zeno-primary/20 bg-zeno-primary/10 text-zeno-primary",
  Basse: "border-muted/20 bg-muted/10 text-muted-foreground",
};

export const importanceIcons: Record<AnnonceImportance, string> = {
  Haute: "🔴",
  Normale: "🟡",
  Basse: "🟢",
};
