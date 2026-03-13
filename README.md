# CredFlow

Application web pour gérer vos cartes de crédit et suivre vos dépenses par période de facturation. Chaque utilisateur possède son propre profil sécurisé avec authentification Supabase.

---

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** avec variables CSS (dark/light mode)
- **Supabase** — base de données PostgreSQL + authentification
- **@supabase/ssr** — gestion des sessions côté serveur et client

---

## Prérequis

- [Node.js](https://nodejs.org) v18 ou plus récent
- Un projet [Supabase](https://supabase.com) (gratuit)

---

## Installation

### 1. Cloner et installer les dépendances

```bash
git clone https://github.com/mindofhokage/CredFlow.git
cd CredFlow
npm install
```

### 2. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com) et créer un projet
2. Dans **Settings → API**, copier :
   - `Project URL`
   - `anon public` key

### 3. Créer les tables et activer la sécurité

Dans **SQL Editor** de Supabase, exécuter l'intégralité du fichier :

```
supabase/schema.sql
```

Ce script crée les tables `cards` et `expenses`, ajoute la colonne `user_id`, active le **Row Level Security (RLS)** et configure les politiques d'accès — chaque utilisateur ne voit que ses propres données.

### 4. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
```

### 5. Lancer le serveur

```bash
node node_modules/next/dist/bin/next dev
```

Ouvrir **http://localhost:3000** — vous serez redirigé vers la page de connexion.

---

## Authentification

L'application utilise **Supabase Auth** avec protection des routes via un middleware Next.js.

| Route | Accès |
|---|---|
| `/auth` | Public — connexion / création de compte |
| `/` | Protégé — dashboard |
| `/cards/[id]` | Protégé — détail d'une carte |
| `/profile` | Protégé — paramètres du compte |

La page `/profile` permet de modifier son adresse courriel, changer son mot de passe et se déconnecter.

---

## Structure du projet

```
app/
├── page.tsx                # Dashboard — liste des cartes
├── auth/page.tsx           # Connexion / création de compte
├── profile/page.tsx        # Profil utilisateur
├── cards/[id]/page.tsx     # Détail d'une carte + dépenses
└── api/card-image/         # API route — logo via Clearbit

components/
├── CardWidget.tsx          # Widget visuel carte de crédit
├── AddCardModal.tsx        # Modal ajout de carte
├── EditCardModal.tsx       # Modal modification / suppression
├── AddExpenseModal.tsx     # Modal ajout de dépense
├── ExpenseList.tsx         # Liste des dépenses + filtres
├── CategoryBadge.tsx       # Badge de catégorie
├── Logo.tsx                # Wordmark CredFlow (variants sm/md/lg/xl)
├── GlowBg.tsx              # Effet de fond dégradé partagé
├── ThemeProvider.tsx       # Fournisseur dark/light mode
└── ThemeToggle.tsx         # Bouton bascule thème

lib/
├── types.ts                # Types TypeScript (Card, Expense, catégories…)
├── supabase.ts             # CRUD cartes et dépenses (Supabase)
├── auth.ts                 # Fonctions auth (signIn, signUp, signOut…)
├── cardProviders.ts        # Mapping fournisseurs → logos et dégradés
└── utils.ts                # Utilitaires (dates, devises, période…)

middleware.ts               # Protection des routes, refresh de session
supabase/
└── schema.sql              # Schema SQL complet + migrations + RLS
```

---

## Fonctionnalités

- **Authentification** — inscription, connexion, déconnexion, modification courriel/mot de passe
- **Multi-utilisateurs** — données isolées par utilisateur via RLS Supabase
- **Cartes de crédit** — ajout, modification, suppression avec logo automatique (Clearbit)
- **Réseau de carte** — sélection Visa / Mastercard / Amex avec détection automatique
- **Dépenses** — titre, montant, date, note, catégorie (10 catégories disponibles)
- **Période de facturation** — configurable par carte (ex. : du 13 au 12 du mois suivant)
- **Statistiques** — solde utilisé, taux d'utilisation, répartition par catégorie
- **Filtres** — par catégorie, par période (mois en cours ou tout l'historique)
- **Design premium** — Apple-inspired, dark/light mode, dégradés indigo/violet, responsive
