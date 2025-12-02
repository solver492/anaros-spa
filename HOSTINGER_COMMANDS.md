# 🔧 Commandes Essentielles pour Hostinger

## 📝 Commandes SSH

### Connexion SSH
```bash
ssh username@your-domain.com
```

### Navigation
```bash
cd public_html                    # Aller au répertoire racine
ls -la                           # Lister les fichiers
pwd                              # Afficher le répertoire courant
```

### Installation des Dépendances
```bash
npm install --production         # Installer uniquement les dépendances de production
npm install                      # Installer toutes les dépendances (dev + prod)
npm rebuild                      # Reconstruire les modules natifs
```

### Gestion de l'Application
```bash
node dist/index.cjs              # Lancer l'application manuellement
npm start                        # Lancer via script npm
```

### Vérification
```bash
node --version                   # Vérifier la version de Node.js
npm --version                    # Vérifier la version de npm
which node                       # Localiser Node.js
```

### Logs et Débogage
```bash
tail -f logs/error.log           # Afficher les logs d'erreur en temps réel
cat logs/error.log               # Afficher le contenu du fichier log
pm2 logs                         # Afficher les logs PM2 (si utilisé)
```

### Nettoyage
```bash
rm -rf node_modules              # Supprimer les dépendances
rm package-lock.json             # Supprimer le lock file
npm cache clean --force          # Nettoyer le cache npm
```

---

## 📤 Commandes SCP (Upload depuis votre PC)

### Upload d'un fichier
```bash
scp file.txt username@domain.com:~/public_html/
```

### Upload d'un dossier
```bash
scp -r dist/ username@domain.com:~/public_html/
```

### Upload multiple
```bash
scp package.json package-lock.json username@domain.com:~/public_html/
```

### Download depuis Hostinger
```bash
scp username@domain.com:~/public_html/file.txt ./
```

---

## 🔄 Déploiement Complet (Copier-Coller)

### Depuis votre machine locale

```bash
# 1. Build l'application
npm run build

# 2. Upload les fichiers
scp -r dist/ username@domain.com:~/public_html/
scp package.json package-lock.json username@domain.com:~/public_html/

# 3. Connectez-vous via SSH
ssh username@domain.com

# 4. Installez les dépendances (exécuté sur Hostinger)
cd public_html
npm install --production

# 5. Redémarrez l'application (via Hostinger Dashboard)
# Hébergement → Gérer → Node.js → Redémarrer
```

---

## 🐛 Dépannage

### Vérifier que Node.js est installé
```bash
node -v
npm -v
```

### Vérifier que le port est disponible
```bash
netstat -tuln | grep 5000
lsof -i :5000
```

### Vérifier la connexion à la base de données
```bash
psql -U user -h host -d database -c "SELECT 1;"
```

### Vérifier l'espace disque
```bash
df -h                            # Espace disque
du -sh public_html               # Taille du répertoire
```

### Vérifier les permissions
```bash
ls -la dist/                     # Afficher les permissions
chmod +x dist/index.cjs          # Rendre exécutable
```

---

## 🚀 Déploiement Automatisé avec Git

### Initialiser Git (première fois)
```bash
cd public_html
git init
git remote add origin https://github.com/YOUR_USERNAME/anaros-erp.git
git pull origin main
npm install --production
```

### Mettre à jour depuis GitHub
```bash
cd public_html
git pull origin main
npm install --production
# Redémarrer l'application via Hostinger Dashboard
```

---

## 📊 Monitoring

### Vérifier l'utilisation des ressources
```bash
top                              # Afficher les processus
free -h                          # Afficher la mémoire disponible
ps aux | grep node               # Afficher les processus Node.js
```

### Vérifier les logs d'erreur
```bash
tail -100 /var/log/syslog        # Logs système
tail -100 ~/.pm2/logs/app-error.log  # Logs PM2
```

---

## 🔐 Configuration de Sécurité

### Générer une clé SESSION_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Vérifier les variables d'environnement
```bash
env | grep NODE_ENV
env | grep DATABASE_URL
env | grep SESSION_SECRET
```

### Configurer les permissions
```bash
chmod 600 .env                   # Rendre le fichier .env lisible uniquement par le propriétaire
chmod 755 dist/                  # Permissions pour le dossier dist
```

---

## 📋 Checklist de Déploiement

```bash
# 1. Préparer les fichiers
npm run build

# 2. Uploader
scp -r dist/ package.json package-lock.json username@domain.com:~/public_html/

# 3. Installer
ssh username@domain.com
cd public_html
npm install --production

# 4. Vérifier
node dist/index.cjs &
curl http://localhost:5000

# 5. Configurer dans Hostinger Dashboard
# - Node.js App Settings
# - Variables d'environnement
# - Redémarrer

# 6. Tester
curl https://votre-domaine.com
```

---

## 🆘 Problèmes Courants

### "Permission denied"
```bash
chmod +x dist/index.cjs
chmod -R 755 dist/
```

### "Module not found"
```bash
npm install --production
npm rebuild
```

### "Port already in use"
```bash
# Trouver le processus
lsof -i :5000
# Tuer le processus
kill -9 PID
```

### "Out of memory"
```bash
# Augmenter la limite de mémoire
node --max-old-space-size=4096 dist/index.cjs
```

---

## 📞 Support Hostinger

**Terminal Hostinger** : Hébergement → Gérer → Terminal
**File Manager** : Hébergement → Gérer → File Manager
**Logs** : Hébergement → Gérer → Node.js → Logs

---

**Besoin d'aide ? Consultez HOSTINGER_QUICK_START.md ou HOSTINGER_DEPLOYMENT.md**
