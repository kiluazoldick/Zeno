import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Zeno",
  version: packageJson.version,
  copyright: `© ${currentYear}, Zeno Admin.`,
  meta: {
    title: "Zeno Admin - Zoldick",
    description:
      "Zeno Admin - Systeme de gestion interne pour Zoldick. Une application web moderne et réactive pour gérer les opérations internes de l'entreprise.  Optimisée pour la performance et l'expérience utilisateur, Zeno Admin offre une interface intuitive pour la gestion des données, la surveillance des activités et la prise de décisions éclairées.  Avec Zeno Admin, les équipes peuvent collaborer efficacement, suivre les performances en temps réel et accéder à des analyses approfondies pour améliorer la productivité et la rentabilité. Que vous soyez un administrateur, un gestionnaire ou un membre de l'équipe, Zeno Admin est l'outil idéal pour rationaliser vos processus internes et atteindre nos objectifs commerciaux.  ",
  },
};
