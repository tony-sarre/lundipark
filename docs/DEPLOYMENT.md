# Guide de déploiement complet — Lundipark Photography 🇨🇦

Ce guide vous accompagne pour déployer le site sur **Cloudflare** (optimisé pour le marché canadien).

⏱️ **Temps total : ~2 heures** (première fois)
💰 **Coût mensuel : ~1 €** (uniquement le domaine)

---

## Vue d'ensemble de la stack Cloudflare

```
GitHub (votre code)
    ↓ auto-deploy
Cloudflare Pages (hébergement gratuit, edge Canada)
    ↓ se connecte à
Supabase Canada Central (base de données + auth)
    ↓
Bookings → Web3Forms → Email Gmail
    ↓
Cloudflare Analytics (stats gratuites)
```

**Tout dans l'écosystème Cloudflare** : hébergement, DNS, domaine, analytics, sécurité — un seul compte, un seul dashboard.

---

## ÉTAPE 1 — GitHub (10 min)

### 1.1 Créer un compte GitHub

1. Allez sur **https://github.com/signup**
2. Créez un compte (gratuit)

### 1.2 Créer le repository

1. Cliquez **"+ New repository"** en haut à droite
2. Configurez :
   - **Name:** `lundipark-photography`
   - **Visibility:** **Private** (recommandé)
   - **Initialize:** ne cochez RIEN
3. Cliquez **"Create repository"**

### 1.3 Pousser le code

Téléchargez le ZIP, extrayez-le localement, puis dans un terminal :

```bash
cd lundipark-site

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/lundipark-photography.git
git push -u origin main
```

---

## ÉTAPE 2 — Supabase (Canada Central) (30 min)

### 2.1 Créer le projet en région Canada

1. Allez sur **https://supabase.com/sign-up**
2. Créez un compte (gratuit)
3. Cliquez **"New Project"**
4. Configurez :
   - **Name:** `lundipark`
   - **Database Password:** générez un mot de passe fort (**sauvegardez-le !**)
   - **Region:** ⚠️ **Canada (Central)** — important pour conformité Loi 25
   - **Pricing Plan:** Free
5. Cliquez **"Create new project"** — attendez 2 min ⏳

### 2.2 Exécuter le schéma SQL

1. Dans Supabase, cliquez **"SQL Editor"** (icône `</>`)
2. Cliquez **"New query"**
3. Ouvrez le fichier `supabase/schema.sql` du repo localement
4. Copiez **tout le contenu**
5. Collez dans l'éditeur SQL de Supabase
6. Cliquez **"Run"** (bouton en bas à droite)
7. Vérifiez : `Success. No rows returned.` ✅

Cela crée :
- 5 tables (testimonials, site_content, photos, admin_users, site_events)
- Politiques de sécurité Row Level Security (RLS)
- Contenu initial du site (textes EN + FR)

### 2.3 Récupérer les clés API

1. Cliquez **"Project Settings"** (engrenage en bas) → **"API"**
2. Notez :
   - **Project URL:** `https://xxxxx.supabase.co`
   - **Project API Keys → `anon / public`:** `eyJhbGc...` (longue chaîne)

⚠️ **Important :**
- Le `anon key` est **PUBLIC** — safe pour le navigateur, RLS protège les données
- Le `service_role` est **SECRET** — ne jamais l'utiliser dans le frontend

### 2.4 Créer le bucket Storage pour photos

1. Cliquez **"Storage"** (icône dossier)
2. Cliquez **"New bucket"**
3. Configurez :
   - **Name:** `photos`
   - **Public bucket:** ✅ activé
4. Cliquez **"Create"**

### 2.5 Créer le premier admin (Lundipark)

1. Cliquez **"Authentication"** → **"Users"**
2. Cliquez **"Add user"** → **"Create new user"**
3. Email: `lundiparkphotography@gmail.com`
4. Password: générez un mot de passe fort (à transmettre à Lundipark de manière sécurisée — Signal, mot de passe verbal, etc.)
5. ✅ Cochez **"Auto Confirm User"**
6. Cliquez **"Create user"**
7. **Copiez le UUID** (sous la colonne ID, format : `xxx-xxx-xxx`)

### 2.6 Promouvoir cet utilisateur en admin

1. Retournez dans **"SQL Editor"** → New query
2. Exécutez (remplacez `UUID-COPIÉ-CI-DESSUS` par le vrai UUID) :

```sql
INSERT INTO admin_users (id, email, role, full_name)
VALUES (
  'UUID-COPIÉ-CI-DESSUS',
  'lundiparkphotography@gmail.com',
  'super_admin',
  'Lundipark'
);
```

3. Cliquez **"Run"** ✅

**Pour vous ajouter aussi comme admin**, répétez 2.5 et 2.6 avec votre propre email.

---

## ÉTAPE 3 — Web3Forms (5 min)

### 3.1 Créer le compte

1. Allez sur **https://web3forms.com**
2. Cliquez **"Create Access Key"**
3. Email: `lundiparkphotography@gmail.com`
4. Cliquez **"Create Access Key"**
5. **Confirmez votre email** dans Gmail
6. Connectez-vous au dashboard
7. **Copiez l'Access Key**

### 3.2 Activer l'auto-response (recommandé)

1. Dashboard → votre formulaire → **Settings → Auto Response**
2. Activez et configurez :
   ```
   Subject: Merci pour votre demande — Lundipark Photography
   From Name: Lundipark Photography
   Message: Hi,
   
   Thank you for contacting Lundipark Photography! 
   I've received your booking request and will reply within 48 hours.
   
   Best,
   Lundipark
   📷 @lundiparkphotography
   ```

---

## ÉTAPE 4 — Configurer les clés dans le code (10 min)

### 4.1 Mettre les clés Supabase

Ouvrez **`src/js/supabase-client.js`** et remplacez les 2 premières constantes :

```js
const SUPABASE_URL = 'https://xxxxx.supabase.co';      // ← Étape 2.3
const SUPABASE_ANON_KEY = 'eyJhbGc...';                 // ← Étape 2.3
```

### 4.2 Mettre la clé Web3Forms

Ouvrez **`public/index.html`**, cherchez `YOUR_ACCESS_KEY_HERE` (1 seule occurrence) et remplacez par votre clé Web3Forms.

### 4.3 Ajouter les scripts Supabase au site public

Le code dynamique est déjà en place. Vérifiez juste qu'à la fin de `public/index.html`, avant `</body>`, vous avez bien :

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../src/js/supabase-client.js"></script>
<script src="../src/js/testimonial-widget.js"></script>
```

### 4.4 Push les changements

```bash
git add .
git commit -m "Configure Supabase and Web3Forms keys"
git push
```

---

## ÉTAPE 5 — Cloudflare Pages (15 min)

### 5.1 Créer un compte Cloudflare

1. Allez sur **https://dash.cloudflare.com/sign-up**
2. Créez un compte (gratuit)
3. Confirmez votre email

### 5.2 Créer le projet Pages

1. Dans le dashboard Cloudflare, dans le menu de gauche :
   - **Workers & Pages → Overview**
2. Cliquez **"Create application"**
3. Choisissez l'onglet **"Pages"**
4. Cliquez **"Connect to Git"**

### 5.3 Connecter GitHub

1. Cliquez **"Connect GitHub"**
2. Autorisez Cloudflare à accéder à votre compte GitHub
3. Choisissez **"Only select repositories"** → sélectionnez `lundipark-photography`
4. Cliquez **"Install & Authorize"**

### 5.4 Configurer le projet

1. Sélectionnez le repo `lundipark-photography`
2. Cliquez **"Begin setup"**
3. Configurez :
   - **Project name:** `lundipark-photography`
   - **Production branch:** `main`
   - **Framework preset:** **None** (Static site)
   - **Build command:** _(laissez vide)_
   - **Build output directory:** `public`
   - **Root directory:** `/` (default)
4. Cliquez **"Save and Deploy"**

### 5.5 Premier déploiement

- Le premier build prend ~1 min ⏳
- Une fois terminé, votre site est en ligne sur :
  **`https://lundipark-photography.pages.dev`**
- Testez le site ! 🎉

### 5.6 Vérifier le déploiement

✅ Vérifiez :
- [ ] Le site s'affiche
- [ ] Le slideshow hero fonctionne
- [ ] Le switch EN ↔ FR fonctionne
- [ ] Vous pouvez accéder à `/admin`
- [ ] Login admin avec le compte de l'étape 2.5 fonctionne

---

## ÉTAPE 6 — Domaine personnalisé `.ca` (20 min)

### 6.1 Acheter le domaine via Cloudflare Registrar

⭐ **Recommandé pour le Canada** : Cloudflare vend les domaines **au prix coûtant** (le moins cher du marché).

1. Dans Cloudflare → **"Domain Registration"** dans le menu → **"Register Domains"**
2. Cherchez :
   - `lundiparkphotography.ca` (~12 CAD/an) — recommandé pour Canada
   - `lundiparkphotography.com` (~10 USD/an) — alternative internationale
3. Achetez (paiement par carte)

⚠️ **Pour acheter un `.ca`** : Cloudflare demande une CIRA Registrant Information :
- Type : "Personal" pour individu (CCT: Canadian Citizen/Permanent Resident)
- Lundipark devra fournir son nom + adresse canadienne
- Pas de frais supplémentaire

### 6.2 Connecter le domaine à Cloudflare Pages

1. Dans Cloudflare → **Workers & Pages** → votre projet `lundipark-photography`
2. Onglet **"Custom domains"**
3. Cliquez **"Set up a custom domain"**
4. Entrez : `lundiparkphotography.ca` (ou votre domaine)
5. Cliquez **"Continue"**
6. Cloudflare détecte que le domaine est chez eux et configure tout automatiquement ✅

Si vous voulez aussi `www.lundiparkphotography.ca`, répétez l'étape pour `www.`

### 6.3 Vérifier HTTPS

- Attendez 2-5 min
- Visitez `https://lundiparkphotography.ca`
- ✅ Cadenas vert dans la barre d'adresse = HTTPS actif

---

## ÉTAPE 7 — Cloudflare Web Analytics (5 min)

### 7.1 Activer (automatique avec custom domain Cloudflare)

Si votre domaine est sur Cloudflare, l'analytics est **automatiquement activé** :

1. Cloudflare → votre domaine → **Analytics & Logs → Web Analytics**
2. Activez **"Free Web Analytics"** si pas déjà fait
3. Pas de script à ajouter ! Cloudflare injecte automatiquement le tracker.

### 7.2 Vérifier que ça fonctionne

1. Visitez votre site quelques fois
2. Attendez 5-10 min
3. Retournez sur **Web Analytics**
4. Vous devriez voir : visites, pages vues, pays, sources

✅ **Avantages** :
- Gratuit illimité
- **100% RGPD/Loi 25 friendly** (pas de cookies, pas de pop-up)
- Mesure les Web Vitals (performance)
- Compatible mobile

---

## ÉTAPE 8 — Tests finaux (15 min)

### Checklist complète

**Site public :**
- [ ] Site accessible sur `https://lundiparkphotography.ca`
- [ ] HTTPS fonctionne (cadenas vert)
- [ ] Slideshow hero (4 images en rotation)
- [ ] Toutes les sections s'affichent
- [ ] Switch EN ↔ FR fonctionne
- [ ] Parallax "For The Couples" fonctionne
- [ ] Scrapbook responsive

**Formulaire de booking :**
- [ ] Remplir le formulaire → "Message sent ✓"
- [ ] Email reçu dans `lundiparkphotography@gmail.com`
- [ ] Réponse à l'email arrive bien au client
- [ ] Auto-response reçue par le client (si activée)

**Témoignages :**
- [ ] Bouton "Leave a Testimonial" visible dans Kind Words
- [ ] Modal s'ouvre au clic
- [ ] Sélection 1-5 étoiles fonctionne
- [ ] Soumission → "Thank you!" affiché
- [ ] Vérifier dans Supabase → table `testimonials` → status `pending`

**Admin panel :**
- [ ] `/admin` accessible
- [ ] Login fonctionne
- [ ] Dashboard affiche les stats
- [ ] Onglet Testimonials affiche le test soumis
- [ ] Bouton "Approve" fonctionne (status → `approved`)
- [ ] L'avis approuvé apparaît maintenant dans Kind Words du site public
- [ ] Onglet "Site Content" affiche les textes
- [ ] Modification d'un texte → "Saved ✓" → texte change sur le site

**Analytics :**
- [ ] Cloudflare Web Analytics enregistre les visites (après 5-10 min)

---

## 📋 Récap des URLs et accès

| Service | URL | Notes |
|---|---|---|
| **Site public** | https://lundiparkphotography.ca | _(ou votre domaine)_ |
| **Admin panel** | https://lundiparkphotography.ca/admin | Login: lundipark email + pwd |
| **GitHub repo** | https://github.com/USERNAME/lundipark-photography | Code source |
| **Cloudflare dashboard** | https://dash.cloudflare.com | Pages, DNS, Analytics, Domaine |
| **Supabase** | https://supabase.com/dashboard | DB + Auth + Storage (Canada Central) |
| **Web3Forms** | https://web3forms.com/dashboard | Historique des bookings |
| **Gmail** | lundiparkphotography@gmail.com | Reçoit les bookings |

---

## 💰 Coûts mensuels (Canada)

| Service | Prix CAD/an | Prix CAD/mois |
|---|---|---|
| GitHub (privé illimité) | 0 | 0 |
| Cloudflare Pages (illimité) | 0 | 0 |
| Cloudflare Web Analytics | 0 | 0 |
| Supabase Free (500MB) | 0 | 0 |
| Web3Forms (250/mois) | 0 | 0 |
| Domaine `.ca` Cloudflare | ~12 CAD | ~1 CAD |
| **TOTAL** | **~12 CAD/an** | **~1 CAD/mois** |

---

## 🔄 Mises à jour futures

### Modifier le code (vous, développeur)

```bash
# Modifier les fichiers localement
git add .
git commit -m "Update X"
git push
```

→ Cloudflare Pages re-déploie **automatiquement** en ~30 secondes après chaque push.

### Modifier les textes ou témoignages (Lundipark)

Utiliser le **panel admin** (`/admin`) :
- Modifications **instantanées**
- Aucun déploiement nécessaire
- Aucune intervention dev requise

---

## 🛟 Support et dépannage

### Si le déploiement échoue
- Allez sur **Cloudflare Pages → projet → Deployments**
- Cliquez sur le dernier déploiement échoué
- Lisez les logs pour identifier l'erreur

### Si le domaine ne fonctionne pas
- Cloudflare → **DNS → Records** → vérifiez les entrées
- Cloudflare → **SSL/TLS** → vérifiez que c'est en "Full"

### Si le formulaire ne marche pas
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs JavaScript
- Vérifiez que la clé Web3Forms est correcte

### Si l'admin ne se connecte pas
- Vérifiez l'email/mdp dans Supabase → Authentication → Users
- Vérifiez que l'utilisateur est dans la table `admin_users`

### Si les témoignages ne s'affichent pas
- Ouvrez Supabase → table `testimonials`
- Vérifiez que les avis sont en status `approved`
- Vérifiez les politiques RLS (déjà configurées)

---

## 📚 Documentation officielle

- **Cloudflare Pages:** https://developers.cloudflare.com/pages
- **Cloudflare Analytics:** https://developers.cloudflare.com/web-analytics
- **Supabase:** https://supabase.com/docs
- **Web3Forms:** https://docs.web3forms.com

---

## 🇨🇦 Conformité légale canadienne

Le site respecte les lois canadiennes :

- ✅ **PIPEDA** (Personal Information Protection and Electronic Documents Act)
- ✅ **Loi 25 du Québec** (DB hébergée au Canada Central — Toronto)
- ✅ **CASL** (Canadian Anti-Spam Law) — pas de marketing automatique
- ✅ **Analytics RGPD-friendly** — pas de cookies, pas de pop-up requis
- ✅ **Données hébergées au Canada** : code (Cloudflare Toronto), DB (Supabase Canada Central)

---

## ✅ Et voilà !

Le site est en ligne, sécurisé, rapide pour les visiteurs canadiens, conforme aux lois locales, et entièrement gérable depuis l'admin panel.

**Bon lancement ! 🚀📷🇨🇦**
