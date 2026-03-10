# Sandbox AI

Simulateur d’API pour agents IA : testez paiements (Stripe), logs et mode Chaos sans toucher à la production.

## Stack

- **Next.js 16** (App Router)
- **Clerk** (auth)
- **Supabase** (logs, clés API, contact)
- **Stripe** (checkout Pro, optionnel)
- **Tailwind CSS**

## Prérequis

- Node.js 18+
- Compte [Clerk](https://clerk.com), [Supabase](https://supabase.com), optionnel [Stripe](https://stripe.com)

## Installation

```bash
git clone <repo>
cd mon-saas-ia
npm install
```

## Variables d’environnement

Créez `.env.local` à la racine :

```env
# Clerk (obligatoire)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Supabase (obligatoire)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optionnel – Stripe (plan Pro)
STRIPE_SECRET_KEY=sk_...
STRIPE_PRO_PRICE_ID=price_...

# Optionnel – URL publique (sitemap, Stripe redirects)
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

## Migrations Supabase

Exécutez le SQL des fichiers dans `supabase/migrations/` via le **SQL Editor** Supabase (Dashboard → SQL Editor) :

1. **api_keys** – table des clés API (pour la page Clés API)
2. **api_logs** – table des logs (déjà utilisée par l’app)
3. **contact_requests** – table des messages Contact

Voir `supabase/README.md` pour la liste des fichiers.

## Lancer le projet

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande        | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Serveur de développement |
| `npm run build` | Build production         |
| `npm run start` | Serveur production       |
| `npm run lint`  | ESLint                   |
| `npm run test`  | Vitest (watch)           |
| `npm run test:run` | Vitest (une fois)     |

## Structure utile

- `app/` – pages et routes (dashboard, contact, API)
- `app/api/` – routes API (stripe, logs, keys, usage, contact)
- `lib/` – auth-api (clé API + Clerk), supabase
- `supabase/migrations/` – SQL à exécuter dans Supabase

## Déploiement

- **Vercel** : connectez le repo, ajoutez les variables d’env, déployez.
- Définir `NEXT_PUBLIC_APP_URL` sur l’URL de production pour le sitemap et Stripe.

## Utilisation rapide (côté produit)

1. **Se connecter**  
   - Rendez-vous sur l’URL de production, créez un compte via Clerk.

2. **Créer une clé API**  
   - Dans le dashboard, ouvrez `Clés API` et générez une clé pour vos appels d’agent / scripts.

3. **Choisir un scénario**  
   - Dans la vue d’ensemble, utilisez le select `Scénario` pour choisir le comportement de l’API : succès, erreur 500, latence 5s, rate limit 429, carte refusée, etc.

4. **Simuler un paiement Stripe ou Crypto**  
   - Cliquez sur `Simuler un paiement` (Stripe) ou `Simuler Paiement Crypto (USDC)`.  
   - Le statut et la table de logs se mettent à jour pour refléter le scénario choisi.

5. **Brancher votre agent IA**  
   - Depuis votre agent ou un script, appelez `POST /api/stripe` ou `POST /api/crypto` avec la clé API et le champ `scenario`.  
   - Utilisez `GET /api/logs` pour analyser le comportement de l’agent et ajuster vos prompts avant la mise en production.

---

Sandbox AI · Simulateur d’API pour agents IA
