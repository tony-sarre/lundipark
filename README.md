# Lundipark Photography 🇨🇦

Site web fine-art photography avec admin panel pour la gestion de contenu.

🌐 **Live site:** _(à configurer après déploiement Cloudflare)_
🛠 **Admin panel:** `/admin`
📷 **Instagram:** [@lundiparkphotography](https://www.instagram.com/lundiparkphotography)
📧 **Email:** lundiparkphotography@gmail.com
📍 **Based in:** Edmonton, Alberta, Canada

---

## 🇨🇦 Pourquoi Cloudflare pour le Canada ?

Cloudflare a des serveurs edge dans **4 villes canadiennes** : Toronto, Montréal, **Calgary (proche d'Edmonton)** et Vancouver. Les visiteurs canadiens chargent le site en 10-30 ms au lieu de 50-80 ms via d'autres CDN. Bande passante **illimitée** et analytics gratuits inclus.

---

## Stack Technique

- **Frontend:** HTML + CSS + JS statique (pas de framework)
- **Hébergement:** [Cloudflare Pages](https://pages.cloudflare.com) — gratuit, CDN canadien
- **Base de données:** [Supabase](https://supabase.com) (région Canada Central — Toronto)
- **Auth admin:** Supabase Auth
- **Stockage photos:** Supabase Storage
- **Formulaire bookings:** [Web3Forms](https://web3forms.com) → email
- **Stats visiteurs:** [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) — gratuit, RGPD/Loi 25 compatible
- **Domaine:** [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (prix coûtant)

---

## Structure du Projet

```
lundipark-site/
├── public/                       # Fichiers servis par Cloudflare Pages
│   ├── index.html                # Site public
│   ├── admin/
│   │   └── index.html            # Panneau admin (login requis)
│   ├── _headers                  # Cloudflare: en-têtes HTTP & cache
│   └── _redirects                # Cloudflare: redirections URL
├── src/
│   └── js/
│       ├── supabase-client.js    # Connexion DB + helpers
│       └── testimonial-widget.js # Modal "Leave a review"
├── supabase/
│   └── schema.sql                # Schéma DB complet (à exécuter dans Supabase)
├── docs/
│   ├── DEPLOYMENT.md             # Guide de déploiement complet (FR)
│   ├── ADMIN-GUIDE.md            # Guide pour Lundipark (FR)
│   └── DEVELOPMENT.md            # Guide développement
├── package.json
├── wrangler.toml                 # Config Cloudflare Wrangler
├── .gitignore
└── README.md
```

---

## ✨ Fonctionnalités

### 🌐 Site Public (`/`)
- Portfolio fine art photography
- Bilingue EN / FR avec switcher
- Diaporama hero (4 images)
- Sections services (Mariages, Couples, Portraits, Famille)
- Parallax "For The Couples"
- Album scrapbook
- **Soumission de témoignages publique** avec note ⭐⭐⭐⭐⭐
- Formulaire de booking (email vers lundiparkphotography@gmail.com)
- Grille Instagram cliquable
- Mobile responsive

### 🔐 Panel Admin (`/admin`)
Connexion requise (Lundipark + dev).

- **Dashboard:** stats (avis en attente, approuvés, photos, bookings)
- **Témoignages:** approuver / refuser / mettre en avant / supprimer
- **Site Content:** modifier tous les textes (EN + FR) en direct
- **Photos:** upload, remplacement (Phase 3)
- **Bookings:** redirection vers Web3Forms

---

## 🚀 Démarrage Rapide

### Développement local

```bash
# Cloner le repo
git clone https://github.com/VOTRE-USERNAME/lundipark-photography.git
cd lundipark-photography

# Installer les dépendances dev
npm install

# Lancer le serveur local (simple)
npm run dev
# Visitez http://localhost:3000

# OU lancer avec Wrangler (simule Cloudflare Pages localement)
npm run preview
```

### Déploiement

```bash
# Push sur GitHub = déploiement automatique via Cloudflare Pages
git add .
git commit -m "Update"
git push

# OU déploiement manuel via CLI Wrangler
npm run deploy
```

---

## 📖 Guide Complet de Déploiement

Voir **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** pour le guide pas-à-pas :

1. ⚙️ Créer projet Supabase (région Canada Central)
2. 🗄️ Exécuter `supabase/schema.sql`
3. 📧 Créer compte Web3Forms
4. 🔧 Configurer les clés API dans le code
5. 📤 Push sur GitHub
6. ☁️ Connecter à Cloudflare Pages
7. 🌐 Acheter domaine `.ca` ou `.com`
8. 📊 Activer Cloudflare Analytics
9. 👤 Créer les comptes admin

---

## 🔑 Clés / Configuration

À configurer **dans le code** :
- `src/js/supabase-client.js` → `SUPABASE_URL` + `SUPABASE_ANON_KEY` (publics, safe)
- `public/index.html` → `WEB3FORMS_ACCESS_KEY` (public)

**Ne JAMAIS committer** :
- Service role keys de Supabase
- Mots de passe DB
- Tokens privés

Le `.gitignore` est déjà configuré pour exclure les fichiers sensibles.

---

## 💰 Coûts Mensuels

| Service | Prix |
|---|---|
| GitHub (privé, illimité) | **0 €** |
| Cloudflare Pages (illimité) | **0 €** |
| Cloudflare Web Analytics | **0 €** |
| Supabase Free (500MB DB) | **0 €** |
| Web3Forms (250 bookings/mois) | **0 €** |
| Domaine `.ca` (Cloudflare) | ~12 CAD/an = ~1 €/mois |
| **TOTAL** | **~1 €/mois** |

---

## 🛠️ Maintenance

- **Ajouter un témoignage** : automatique via formulaire public, requiert approbation admin
- **Modifier un texte** : admin panel → Site Content (instantané)
- **Ajouter un admin** : voir [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Mettre à jour les photos** : _Phase 3 à venir_ — pour l'instant, modifier `public/index.html`

---

## 📋 Conformité

- ✅ **PIPEDA** (loi fédérale canadienne sur la vie privée)
- ✅ **Loi 25 du Québec** (DB hébergée au Canada)
- ✅ **CASL** (Canadian Anti-Spam Law) — pas de marketing automatique
- ✅ **RGPD-friendly** : Cloudflare Analytics sans cookies

---

## 📜 Licence

© 2026 Lundipark Photography. Tous droits réservés.
