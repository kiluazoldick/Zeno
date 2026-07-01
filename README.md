# 🏗️ Zeno - ERP de Gestion d'Entreprise

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-3.0-3ECF8E?style=flat&logo=supabase)

## 📋 Présentation

**Zeno** est une application web de gestion d'entreprise développée pour **Zoldick Entreprise** (BTP - Construction - Rénovation). Elle centralise l'ensemble des processus métier : gestion d'équipe, projets clients, devis, contrats, factures, finances et rapports.

### 🎯 Objectifs

- Remplacer la gestion Notion actuelle par une solution intégrée
- Centraliser tous les processus métier dans une seule interface
- Améliorer la productivité et le suivi des activités
- Fournir des rapports et statistiques en temps réel

## ✨ Fonctionnalités

### 📊 Tableau de bord

- Vue d'ensemble des indicateurs clés (KPI)
- Statistiques en temps réel
- Graphiques de performance
- Productivité de l'équipe

### 👥 Gestion d'équipe

- Kanban avec statuts Notion (À faire, En cours, Annulé, Terminé)
- Vue liste des tâches avec filtres avancés
- Gestion des membres de l'équipe
- Suivi des rapports d'activité

### 📁 Gestion de projet

- Suivi des projets clients
- Gestion des clients (CRM)
- Budget et suivi d'avancement

### 📄 Documents

- **Devis** : Création, envoi, suivi (Brouillon, Envoyé, Accepté, Refusé)
- **Contrats** : Rédaction, signature, suivi (Brouillon, En cours, Signé, Annulé)
- **Factures** : Émission, paiement, suivi (Brouillon, Envoyée, Payée, Impayée, Annulée)

### 💰 Finances

- Suivi des transactions (entrées/sorties)
- Budget prévisionnel vs réalisé
- Graphiques financiers
- Rapports mensuels

### 📋 Reporting

- Rapports quotidiens, hebdomadaires, mensuels
- Synthèses financières
- Export PDF/CSV

## 🛠️ Stack Technique

| Technologie     | Version | Utilisation                      |
| --------------- | ------- | -------------------------------- |
| Next.js         | 16      | Framework principal (App Router) |
| TypeScript      | 5.0     | Typage statique                  |
| Tailwind CSS    | 4.0     | Styling et design                |
| Shadcn UI       | -       | Composants UI                    |
| Supabase        | 3.0     | Base de données PostgreSQL       |
| React Hook Form | 7.0     | Gestion des formulaires          |
| Recharts        | 2.0     | Graphiques                       |
| TanStack Table  | 8.0     | Tableaux dynamiques              |
| Zustand         | 4.0     | State management                 |
| DnD Kit         | 6.0     | Drag & Drop (Kanban)             |
| Zod             | 3.0     | Validation des données           |

## 🎨 Identité Visuelle

Les couleurs de l'entreprise Zoldick :

| Couleur | Code      | Utilisation |
| ------- | --------- | ----------- |
| Cyan    | `#02B3C4` | Primaire    |
| Bleu    | `#1D3F92` | Secondaire  |
| Jaune   | `#FFD50F` | Accent      |

## 📁 Structure du Projet

```

📁 zeno/
├── 📁 src/
│ ├── 📁 app/
│ │ ├── 📁 (main)/ # Routes principales
│ │ │ ├── 📁 dashboard/ # Tableau de bord
│ │ │ ├── 📁 analytics/ # Statistiques
│ │ │ ├── 📁 kanban/ # Gestion d'équipe
│ │ │ ├── 📁 tasks/ # Liste des tâches
│ │ │ ├── 📁 users/ # Membres
│ │ │ ├── 📁 projects/ # Projets
│ │ │ ├── 📁 crm/ # Clients
│ │ │ ├── 📁 devis/ # Devis
│ │ │ ├── 📁 contrats/ # Contrats
│ │ │ ├── 📁 invoice/ # Factures
│ │ │ ├── 📁 finance/ # Finances
│ │ │ └── 📁 rapports/ # Rapports
│ │ └── 📁 (auth)/ # Authentification
│ ├── 📁 components/ # Composants réutilisables
│ ├── 📁 lib/ # Utilitaires
│ ├── 📁 types/ # Types TypeScript
│ └── 📁 styles/ # Styles globaux
├── 📁 public/ # Assets
├── 📄 package.json
└── 📄 README.md

```

## 🚀 Installation

### Prérequis

- Node.js 20.x ou supérieur
- npm ou yarn
- Compte Supabase (ou PostgreSQL local)

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/kiluazoldick/Zeno.git
cd zeno

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.local.example .env.local
# Éditer .env.local avec vos identifiants Supabase

# 4. Démarrer le serveur de développement
npm run dev
```

## 📦 Variables d'Environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase

# Autres
NEXT_PUBLIC_APP_NAME=Zeno
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Construire l'application
npm run start        # Démarrer en production
npm run lint         # Linter
npm run format       # Formatter le code
```

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à tous les écrans :

- 📱 Mobile
- 💻 Tablet
- 🖥️ Desktop

## 🗄️ Base de Données

### Schéma Principal

```sql
-- Membres de l'équipe
CREATE TABLE members (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  nom TEXT,
  role TEXT,
  avatar_url TEXT
);

-- Projets
CREATE TABLE projets (
  id UUID PRIMARY KEY,
  nom TEXT,
  client_id UUID,
  statut TEXT,
  budget_total DECIMAL
);

-- Tâches
CREATE TABLE taches (
  id UUID PRIMARY KEY,
  titre TEXT,
  assigne_a UUID,
  statut TEXT,
  date_execution DATE,
  rapport_effectue BOOLEAN
);

-- Devis, Contrats, Factures, Transactions, Rapports, Annonces...
```

## 🤝 Contribution

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est développé pour Zoldick Entreprise. Tous droits réservés.

## 👤 Auteur

**Zoldick Entreprise**

- Site: [www.zoldick.cm](https://www.zoldick.cm)
- Email: contact@zoldick.cm

---

**Fait avec ❤️ pour Zoldick Entreprise**

````

## 2. Commandes Git pour Pousser sur GitHub

```bash
# 1. Initialiser le repository Git (si ce n'est pas déjà fait)
git init

# 2. Ajouter le remote GitHub
git remote add origin https://github.com/kiluazoldick/Zeno.git

# 3. Vérifier le remote
git remote -v

# 4. Ajouter tous les fichiers
git add .

# 5. Créer le premier commit
git commit -m "🚀 Initialisation du projet Zeno

- Structure complète avec Next.js 16 + TypeScript
- Pages : Dashboard, Statistiques, Kanban, Tasks, Users
- Modules : Devis, Contrats, Factures
- Design system avec Shadcn UI
- Couleurs Zoldick Entreprise (#02B3C4, #1D3F92, #FFD50F)
- Formulaire avec aperçu en direct
- Templates PDF imprimables"

# 6. Pousser sur GitHub
git push -u origin main

# Si vous êtes sur la branche master
git branch -M main
git push -u origin main
````

### En cas d'erreur "remote already exists"

```bash
# Supprimer le remote existant
git remote remove origin

# Réajouter le bon remote
git remote add origin https://github.com/kiluazoldick/Zeno.git
```

### Pour un push force (si nécessaire)

```bash
git push -u origin main --force
```

### Vérifier l'état du repo

```bash
# Voir les fichiers modifiés
git status

# Voir l'historique des commits
git log --oneline

# Voir les branches
git branch -a
```

## 3. Fichier `.gitignore` (à vérifier)

Assurez-vous que ce fichier existe à la racine :

```gitignore
# Dependencies
/node_modules
/.pnp
.pnp.js

# Next.js
/.next/
/out/
/build
/dist

# Environment variables
.env
.env.local
.env.production

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build outputs
*.tsbuildinfo
.next-build

# Coverage
coverage/
.nyc_output/

# Misc
*.pem
*.p8
*.key
*.crt
*.cer
```

---
