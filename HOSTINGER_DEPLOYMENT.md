# 🚀 Guide de Déploiement sur Hostinger

## 📋 Prérequis

- Compte Hostinger actif avec accès Node.js
- Accès FTP/SFTP ou File Manager Hostinger
- Accès SSH (optionnel mais recommandé)

## 📦 Fichiers à Déployer

Après le build, vous avez généré :
```
dist/
├── index.cjs          (924.9 KB - serveur Express compilé)
└── public/
    ├── favicon.png
    ├── index.html
    └── assets/
        ├── index-DaG4Oy28.css
        ├── index-Dfy6RBHH.js
        └── IMG-20251201-WA0024_1764618421640-Dg9Ra90g.jpg
```

## 🔧 Étapes de Déploiement

### Option 1 : Via File Manager Hostinger (Recommandé pour débutants)

1. **Accédez au File Manager Hostinger**
   - Connectez-vous à votre compte Hostinger
   - Allez dans : Hébergement → Gérer → File Manager

2. **Créez la structure de dossiers**
   ```
   public_html/
   ├── dist/
   │   ├── index.cjs
   │   └── public/
   ├── node_modules/
   ├── package.json
   └── package-lock.json
   ```

3. **Uploadez les fichiers**
   - Uploadez le contenu du dossier `dist/` vers `public_html/dist/`
   - Uploadez `package.json` et `package-lock.json` vers `public_html/`

4. **Installez les dépendances**
   - Via SSH ou Terminal Hostinger :
   ```bash
   cd public_html
   npm install --production
   ```

### Option 2 : Via SSH (Plus rapide)

1. **Connectez-vous via SSH**
   ```bash
   ssh username@your-hostinger-domain.com
   ```

2. **Naviguez vers le répertoire public_html**
   ```bash
   cd public_html
   ```

3. **Uploadez les fichiers (via SCP ou Git)**
   
   **Via Git (recommandé):**
   ```bash
   git clone https://github.com/YOUR_USERNAME/anaros-erp.git .
   npm install --production
   ```

   **Via SCP (depuis votre machine locale):**
   ```bash
   scp -r dist/* username@your-hostinger-domain.com:~/public_html/dist/
   scp package.json package-lock.json username@your-hostinger-domain.com:~/public_html/
   ```

4. **Installez les dépendances**
   ```bash
   npm install --production
   ```

## 🌍 Configuration du Domaine

### 1. Configurez Node.js dans Hostinger

1. Allez dans : Hébergement → Gérer → Node.js
2. Créez une nouvelle application Node.js :
   - **Nom** : anaros-spa
   - **Domaine** : votre-domaine.com
   - **Port** : 5000 (ou un port disponible)
   - **Répertoire racine** : public_html
   - **Fichier d'entrée** : dist/index.cjs
   - **Environnement** : Production

### 2. Configurez les Variables d'Environnement

Dans Hostinger (Node.js App Settings) :

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=votre-clé-secrète-très-longue-et-aléatoire
```

**Important** : Remplacez les valeurs par vos vraies données de base de données.

### 3. Configurez le Proxy Reverse

Hostinger configure automatiquement le proxy reverse pour rediriger le trafic vers votre application Node.js.

## 🗄️ Configuration de la Base de Données

### Option 1 : Supabase (Recommandé)

1. Créez un compte Supabase : https://supabase.com
2. Créez un nouveau projet
3. Récupérez la chaîne de connexion PostgreSQL
4. Ajoutez-la à `DATABASE_URL` dans les variables d'environnement Hostinger

### Option 2 : Base de données Hostinger

1. Créez une base de données MySQL/PostgreSQL dans Hostinger
2. Créez un utilisateur avec les permissions nécessaires
3. Utilisez la chaîne de connexion dans `DATABASE_URL`

## ✅ Vérification du Déploiement

1. **Vérifiez que l'application est en cours d'exécution**
   ```bash
   curl http://votre-domaine.com
   ```

2. **Vérifiez les logs**
   - Hostinger → Hébergement → Gérer → Node.js → Logs

3. **Testez les endpoints API**
   ```bash
   curl http://votre-domaine.com/api/health
   ```

## 🔒 Sécurité

- ✅ Utilisez HTTPS (Hostinger fournit un certificat SSL gratuit)
- ✅ Configurez les variables d'environnement sensibles
- ✅ Mettez à jour les dépendances régulièrement
- ✅ Activez les pare-feu et les protections DDoS

## 🐛 Dépannage

### Erreur : "Cannot find module"
```bash
npm install --production
npm rebuild
```

### Erreur : "Port already in use"
- Changez le port dans les variables d'environnement
- Vérifiez que le port n'est pas utilisé par une autre application

### Erreur : "Database connection failed"
- Vérifiez la chaîne `DATABASE_URL`
- Vérifiez que la base de données est accessible
- Vérifiez les pare-feu et les règles de sécurité

### Application lente
- Vérifiez les logs pour les erreurs
- Vérifiez l'utilisation CPU/RAM
- Optimisez les requêtes de base de données

## 📊 Monitoring

Configurez le monitoring dans Hostinger :
- Allez dans : Hébergement → Gérer → Node.js
- Activez les alertes pour CPU, RAM, et erreurs

## 🔄 Mises à Jour

Pour déployer une nouvelle version :

1. **Localement** : Faites les modifications et buildez
   ```bash
   npm run build
   ```

2. **Uploadez les nouveaux fichiers**
   ```bash
   scp -r dist/* username@your-hostinger-domain.com:~/public_html/dist/
   ```

3. **Redémarrez l'application**
   - Hostinger → Hébergement → Gérer → Node.js → Redémarrer

## 📞 Support

- **Hostinger Support** : https://support.hostinger.com
- **Documentation Node.js Hostinger** : https://www.hostinger.com/help/article/how-to-deploy-nodejs-application

---

**Application prête pour la production ! 🎉**
