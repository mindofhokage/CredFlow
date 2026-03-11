# CredFlow

Application web minimaliste pour gérer vos cartes de crédit et suivre vos dépenses par période de facturation.

---

## Prérequis

- [Node.js](https://nodejs.org) v18 ou plus récent
- npm (inclus avec Node.js)

---

## Lancer en mode démo (localStorage)

Aucune configuration requise. Les données sont stockées dans le navigateur.

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
node node_modules/next/dist/bin/next dev
```

Ouvrir **http://localhost:3000** dans le navigateur.

---

## Lancer avec Supabase (données persistantes)

### 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com) et créer un compte
2. Créer un nouveau projet
3. Dans **Settings → API**, copier :
   - `Project URL`
   - `anon public` key

### 2. Créer les tables

Dans **SQL Editor** de Supabase, exécuter le contenu du fichier :

```
supabase/schema.sql
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
```

### 4. Activer Supabase dans le code

Dans `lib/supabase.ts`, remplacer le contenu par celui de `lib/supabase.example.ts` *(à venir)*, ou remplacer le stockage localStorage par le client Supabase fourni.

### 5. Lancer le serveur

```bash
npm install
node node_modules/next/dist/bin/next dev
```

Ouvrir **http://localhost:3000**.

---

## Structure du projet

```
app/
├── page.tsx              # Dashboard — liste des cartes
├── cards/[id]/page.tsx   # Détail d'une carte + dépenses
└── api/card-image/       # API route — logo via Clearbit

components/
├── CardWidget.tsx         # Widget visuel carte de crédit
├── AddCardModal.tsx       # Modal ajout de carte
├── EditCardModal.tsx      # Modal modification / suppression
├── AddExpenseModal.tsx    # Modal ajout de dépense
├── ExpenseList.tsx        # Liste des dépenses + filtres
└── CategoryBadge.tsx      # Badge de catégorie

lib/
├── types.ts              # Types TypeScript (Card, Expense…)
├── supabase.ts           # Couche de données (localStorage ou Supabase)
├── cardProviders.ts      # Mapping fournisseurs → logos et couleurs
└── utils.ts              # Utilitaires (dates, devises, période…)

supabase/
└── schema.sql            # Schema SQL à exécuter dans Supabase
```

---

## Fonctionnalités

- Ajout et gestion de plusieurs cartes de crédit
- Logo automatique via l'API Clearbit selon le fournisseur
- Suivi du solde et du taux d'utilisation par carte
- Période de facturation configurable (ex. : du 13 au 13)
- Ajout de dépenses avec titre, montant, date, note et catégorie
- Regroupement des dépenses par date
- Filtres par catégorie
- Statistiques par catégorie pour la période en cours
- Design Apple-inspired — épuré, blanc/noir, responsive
