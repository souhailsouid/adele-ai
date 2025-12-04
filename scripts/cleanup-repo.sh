#!/bin/bash

# Script pour nettoyer le repo et préparer un nouveau commit propre
# Usage: ./scripts/cleanup-repo.sh

set -e

echo "⚠️  ATTENTION: Ce script va supprimer l'historique Git local"
echo "Assurez-vous d'avoir régénéré toutes les clés API exposées !"
echo ""
read -p "Avez-vous régénéré toutes les clés API ? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Annulé. Régénérez d'abord les clés API."
    exit 1
fi

echo "📦 Sauvegarde de l'état actuel..."
cd "$(dirname "$0")/.."
git stash
git branch backup-before-cleanup-$(date +%Y%m%d-%H%M%S)

echo "🧹 Nettoyage de l'historique Git..."
# Supprimer le dossier .git
rm -rf .git

echo "🔄 Réinitialisation Git..."
git init
git add .
git commit -m "chore: Initial commit (credentials removed from history)"

echo "✅ Nettoyage terminé !"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Créer un nouveau repo privé sur GitHub"
echo "2. Exécuter: git remote add origin https://github.com/VOTRE_USERNAME/NOUVEAU_REPO.git"
echo "3. Exécuter: git push -u origin main"
echo "4. Mettre à jour terraform.tfvars avec les nouvelles clés régénérées"
echo ""
echo "⚠️  N'oubliez pas de régénérer toutes les clés API !"

