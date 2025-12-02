#!/bin/bash

# Script de déploiement automatisé pour Hostinger
# Usage: ./deploy-hostinger.sh <username> <domain> <port>

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifiez les paramètres
if [ $# -lt 2 ]; then
    echo -e "${RED}Usage: ./deploy-hostinger.sh <username> <domain> [port]${NC}"
    echo "Example: ./deploy-hostinger.sh user123 example.com 5000"
    exit 1
fi

USERNAME=$1
DOMAIN=$2
PORT=${3:-5000}
REMOTE_PATH="public_html"

echo -e "${YELLOW}🚀 Déploiement ANAROS Spa sur Hostinger${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Utilisateur: $USERNAME"
echo "Domaine: $DOMAIN"
echo "Port: $PORT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Étape 1 : Build local
echo -e "\n${YELLOW}📦 Étape 1 : Build de l'application...${NC}"
npm run build
echo -e "${GREEN}✓ Build terminé${NC}"

# Étape 2 : Créez un archive
echo -e "\n${YELLOW}📦 Étape 2 : Création de l'archive...${NC}"
tar -czf anaros-deploy.tar.gz dist/ package.json package-lock.json
echo -e "${GREEN}✓ Archive créée : anaros-deploy.tar.gz${NC}"

# Étape 3 : Upload via SCP
echo -e "\n${YELLOW}📤 Étape 3 : Upload vers Hostinger...${NC}"
scp anaros-deploy.tar.gz ${USERNAME}@${DOMAIN}:~/${REMOTE_PATH}/
echo -e "${GREEN}✓ Upload terminé${NC}"

# Étape 4 : Extraction et installation
echo -e "\n${YELLOW}⚙️  Étape 4 : Extraction et installation...${NC}"
ssh ${USERNAME}@${DOMAIN} << 'EOF'
    cd ~/public_html
    tar -xzf anaros-deploy.tar.gz
    npm install --production
    rm anaros-deploy.tar.gz
    echo "✓ Installation terminée"
EOF
echo -e "${GREEN}✓ Installation complétée${NC}"

# Étape 5 : Nettoyage local
echo -e "\n${YELLOW}🧹 Étape 5 : Nettoyage...${NC}"
rm anaros-deploy.tar.gz
echo -e "${GREEN}✓ Nettoyage terminé${NC}"

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Déploiement réussi !${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Prochaines étapes :"
echo "1. Connectez-vous à Hostinger"
echo "2. Allez dans Hébergement → Gérer → Node.js"
echo "3. Créez une nouvelle application Node.js :"
echo "   - Fichier d'entrée : dist/index.cjs"
echo "   - Port : $PORT"
echo "   - Répertoire racine : public_html"
echo "4. Configurez les variables d'environnement"
echo "5. Redémarrez l'application"
echo ""
echo "Votre application sera disponible à : https://${DOMAIN}"
