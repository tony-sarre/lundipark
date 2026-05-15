#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║   LUNDIPARK — Quick deploy to GitHub                        ║
# ║   Cloudflare Pages auto-deploys from GitHub push            ║
# ╚══════════════════════════════════════════════════════════════╝

set -e

echo "🚀 Lundipark Photography — Deploy"
echo ""

# Check git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Installez-le depuis https://git-scm.com"
    exit 1
fi

# First-time setup
if [ ! -d ".git" ]; then
    echo "🆕 Premier déploiement détecté"
    echo ""
    read -p "📝 Votre nom d'utilisateur GitHub : " GH_USER
    read -p "📝 Nom du repo (défaut: lundipark-photography) : " GH_REPO
    GH_REPO=${GH_REPO:-lundipark-photography}

    REMOTE_URL="https://github.com/${GH_USER}/${GH_REPO}.git"

    echo ""
    echo "📦 Configuration Git..."
    git init
    git branch -M main
    git add .
    git commit -m "Initial commit — Lundipark Photography"
    git remote add origin "$REMOTE_URL"

    echo ""
    echo "🔼 Push vers GitHub..."
    git push -u origin main

    echo ""
    echo "✅ Code poussé sur GitHub !"
    echo ""
    echo "📌 Prochaines étapes :"
    echo "   1. Allez sur https://dash.cloudflare.com"
    echo "   2. Workers & Pages → Create application → Pages"
    echo "   3. Connect to Git → sélectionnez le repo"
    echo "   4. Settings :"
    echo "      - Build command: (laissez vide)"
    echo "      - Build output directory: public"
    echo "   5. Cliquez Save and Deploy"
    echo ""
    echo "📖 Guide complet : docs/DEPLOYMENT.md"
    exit 0
fi

# Subsequent deploys
echo "🔄 Mise à jour du repo existant"
echo ""

# Show what will be committed
echo "📊 Modifications :"
git status -s
echo ""

read -p "💬 Message de commit (défaut: 'Update site'): " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-Update site}

git add .

if git diff --cached --quiet; then
    echo "ℹ️  Aucune modification à commiter"
    exit 0
fi

git commit -m "$COMMIT_MSG"
git push

echo ""
echo "✅ Push effectué !"
echo "⏳ Cloudflare Pages va re-déployer automatiquement en ~30 secondes"
echo ""
echo "🔗 Voir le déploiement : https://dash.cloudflare.com → Workers & Pages"
