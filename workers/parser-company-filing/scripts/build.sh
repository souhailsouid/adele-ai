#!/bin/bash
# Script pour builder le package Lambda Python

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKER_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$(dirname "$WORKER_DIR")")"

echo "🔨 Building parser-company-filing Lambda package..."

cd "$WORKER_DIR"

# Créer un répertoire temporaire pour le package
rm -rf package
mkdir -p package

# Copier le code source
cp src/index.py package/

# Installer les dépendances (avec toutes les dépendances transitives)
pip install -r requirements.txt -t package/ --platform linux_x86_64 --only-binary=:all: 2>/dev/null || \
pip install -r requirements.txt -t package/ --platform manylinux2014_x86_64 --only-binary=:all: 2>/dev/null || \
pip install -r requirements.txt -t package/

# Créer le zip
cd package
zip -r ../parser-company-filing.zip . > /dev/null
cd ..

# Déplacer le zip au bon endroit
mv parser-company-filing.zip "$ROOT_DIR/workers/"

echo "✅ Package créé: $ROOT_DIR/workers/parser-company-filing.zip"

