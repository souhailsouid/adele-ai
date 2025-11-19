#!/bin/bash
# Script pour builder le package Lambda Python
# Utilise Docker pour garantir des binaires Linux compatibles avec Lambda

set -e

echo "📦 Building parser-13f Lambda package avec Docker (Linux)..."

# Aller dans le répertoire du parser
cd "$(dirname "$0")/.."

# Nettoyer les anciens fichiers
rm -rf ../parser-13f.zip
rm -rf index.py

# Copier index.py à la racine pour Lambda handler
cp src/index.py index.py

# Vérifier si Docker est disponible et fonctionne
USE_DOCKER=false
if [ "$USE_DOCKER" != "false" ] && command -v docker &> /dev/null; then
    # Tester si Docker fonctionne
    if docker info &> /dev/null; then
        echo "🐳 Utilisation de Docker pour builder (recommandé)..."
        # Utiliser l'image Lambda Python officielle
        if docker run --rm \
            -v "$(pwd):/var/task" \
            -w /var/task \
            public.ecr.aws/lambda/python:3.11 \
            bash -c "
                pip install -r requirements.txt -t . --no-cache-dir && \
                zip -r ../parser-13f.zip . \
                    -x '*.git*' \
                    -x '*.zip' \
                    -x 'venv/*' \
                    -x '__pycache__/*' \
                    -x '*.pyc' \
                    -x '*.pyo' \
                    -x '*.pyd' \
                    -x '.Python' \
                    -x 'pip/*' \
                    -x 'setuptools/*' \
                    -x 'wheel/*' \
                    -x 'scripts/*' \
                    -x 'src/*' \
                    -x 'package.json' \
                    -x '*.dist-info/*' \
                    -x 'bin/*'
            " 2>/dev/null; then
            USE_DOCKER=true
        fi
    fi
fi

if [ "$USE_DOCKER" != "true" ]; then
    echo "⚠️  Docker non disponible, utilisation de pip avec --platform..."
    # Fallback: utiliser pip avec --platform (peut ne pas fonctionner sur macOS)
    python3 -m venv venv
    source venv/bin/activate
    
    # Essayer d'installer avec --platform pour Linux
    pip install --platform manylinux2014_x86_64 --only-binary=:all: -r requirements.txt -t . --python-version 3.11 2>/dev/null || \
    pip install --platform linux_x86_64 --only-binary=:all: -r requirements.txt -t . --python-version 3.11 2>/dev/null || \
    pip install -r requirements.txt -t .
    
    # Créer le zip
    zip -r ../parser-13f.zip . \
        -x "*.git*" \
        -x "*.zip" \
        -x "venv/*" \
        -x "__pycache__/*" \
        -x "*.pyc" \
        -x "*.pyo" \
        -x "*.pyd" \
        -x ".Python" \
        -x "pip/*" \
        -x "setuptools/*" \
        -x "wheel/*" \
        -x "scripts/*" \
        -x "src/*" \
        -x "package.json"
    
    deactivate
    rm -rf venv
fi

echo "✅ Package créé: parser-13f.zip"
echo "📋 Taille: $(du -h ../parser-13f.zip | cut -f1)"

# Vérifier que index.py est dans le zip
echo "🔍 Vérification: index.py dans le zip"
unzip -l ../parser-13f.zip | grep -E "^.*index.py$" || echo "⚠️  index.py non trouvé dans le zip!"

# NE PAS supprimer index.py - il doit rester pour le zip

