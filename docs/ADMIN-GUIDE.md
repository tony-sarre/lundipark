# Guide d'utilisation de l'Admin — Lundipark

Bienvenue dans votre panneau d'administration ! Ce guide vous explique comment gérer votre site web.

🔐 **URL admin :** `https://lundiparkphotography.com/admin`

---

## 1. Se connecter

1. Ouvrez l'URL ci-dessus
2. Entrez votre email : `lundiparkphotography@gmail.com`
3. Entrez votre mot de passe (celui qui vous a été transmis)
4. Cliquez **"Sign In"**

💡 Cochez "Souvenir de moi" dans votre navigateur pour ne pas avoir à vous reconnecter à chaque visite.

---

## 2. Dashboard (Tableau de bord)

Vue d'ensemble de votre activité :

- **Pending Reviews** : témoignages en attente d'approbation
- **Approved Reviews** : témoignages publiés
- **Active Photos** : photos affichées sur le site
- **Total Bookings** : nombre total de réservations reçues

⭐ Si un chiffre apparaît à côté de "Testimonials" dans le menu, c'est qu'il y a des avis à approuver.

---

## 3. Gérer les Témoignages

Les visiteurs peuvent **laisser un avis** depuis votre site (bouton "Leave a Testimonial" dans la section Kind Words). Tous les avis arrivent en **attente d'approbation** — vous décidez de ce qui est publié.

### Filtres en haut :
- **All** : tous les avis
- **Pending** : à approuver (nouveaux)
- **Approved** : publiés sur le site
- **Rejected** : refusés (pas visibles)

### Pour chaque avis :

- **Approve** ✅ : publie l'avis sur le site
- **Reject** ❌ : marque comme refusé (l'avis ne s'affiche pas)
- **Feature** ⭐ : met l'avis dans la rotation principale "Kind Words"
- **Delete** 🗑️ : supprime définitivement

### Conseils :
- Approuvez les avis sincères et bien écrits
- Mettez en **Feature** vos 3 meilleurs avis pour qu'ils s'affichent dans la rotation principale
- Vous pouvez avoir plusieurs avis "Approved" non featured — ils sont conservés mais pas affichés dans la rotation

---

## 4. Modifier les Textes du Site

Onglet **"Site Content"** : tous les textes du site (en français et anglais) sont éditables.

### Comment ça marche :

1. Trouvez la ligne avec le texte à modifier (recherchez par mot-clé)
2. Modifiez le texte en **English** (gauche) et **Français** (droite)
3. Cliquez **"Save Changes"**
4. Le site est mis à jour **instantanément** — pas besoin de re-déployer

### Quelques clés importantes :

| Clé | Ce qu'elle contrôle |
|---|---|
| `hero_h1` | Le grand titre du hero (haut du site) |
| `hero_h2` | Le slogan ("Capturing moments") |
| `hey_h2` | "Hey, I'm Lundipark" |
| `svc1_p1` | Premier paragraphe Micro-Weddings |
| `album_h2` | Titre du Scrapbook |
| `ns_h2` | "Next step..." dans la section contact |

⚠️ **Attention** :
- Si une ligne a `(HTML allowed)` sous le label, vous pouvez utiliser `<em>texte</em>` pour mettre en italique
- Sinon, écrivez du texte normal
- Toujours remplir les DEUX langues (EN et FR)

---

## 5. Recevoir les Réservations

Toutes les **demandes de booking** arrivent par email à `lundiparkphotography@gmail.com`.

### Quand quelqu'un remplit le formulaire :

1. Vous recevez immédiatement un email avec :
   - Nom du client
   - Email + téléphone
   - Date de l'événement
   - Type de séance
   - Message du client
2. Cliquez **"Répondre"** dans Gmail → la réponse part directement au client
3. Le client reçoit aussi un **email de confirmation automatique**

### Historique des bookings

Pour voir tous les bookings reçus :
- Allez sur **https://web3forms.com/dashboard**
- Connectez-vous avec `lundiparkphotography@gmail.com`
- Vous voyez tout l'historique avec filtres par date

---

## 6. Statistiques de Visite

Pour voir le trafic du site :
- Allez sur **https://dash.cloudflare.com**
- Connectez-vous
- **Analytics & Logs → Web Analytics**

Vous verrez :
- 📊 Visiteurs uniques par jour/semaine/mois
- 🌍 Pays d'origine
- 📄 Pages les plus consultées
- 🔗 Sources de trafic (Instagram, Google, etc.)
- 📱 Appareils (mobile, ordinateur)
- ⏱️ Temps moyen sur le site

---

## 7. Bonnes Pratiques

### Quand approuver un témoignage :
- ✅ Le client est identifiable (nom complet ou prénom + initiale)
- ✅ Le texte est cohérent et sincère
- ✅ La note correspond à l'expérience

### Quand rejeter un témoignage :
- ❌ Spam évident
- ❌ Contenu inapproprié ou offensant
- ❌ Concurrence déguisée

### Fréquence recommandée :
- Vérifiez les bookings **plusieurs fois par jour** (par email Gmail)
- Approuvez les témoignages **1-2 fois par semaine**
- Mettez à jour les textes **selon vos campagnes / saisons**

---

## 8. Aide & Support

Si quelque chose ne fonctionne pas :

1. Essayez de **rafraîchir la page** (F5)
2. Essayez de vous **déconnecter et reconnecter**
3. Vérifiez votre **connexion internet**
4. Contactez votre développeur

### En cas d'oubli du mot de passe :

Contactez votre développeur pour réinitialiser via Supabase.

---

## 9. Sécurité

- ❌ **Ne partagez JAMAIS** vos identifiants admin
- ✅ Déconnectez-vous toujours sur les ordinateurs partagés
- ✅ Utilisez un mot de passe **fort et unique** pour l'admin
- ✅ Activez l'authentification à 2 facteurs sur votre Gmail

---

Bon usage ! 🎨📷
