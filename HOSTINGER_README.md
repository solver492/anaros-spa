# 🚀 ANAROS Spa - Guide de Déploiement Hostinger

## 📌 Vue d'ensemble

Votre application **ANAROS Beauty Lounge** a été buildée et est prête pour le déploiement sur **Hostinger**.

### ✅ Ce qui a été fait

- ✓ Application React + Express buildée
- ✓ Favicon ANAROS configuré
- ✓ Fichiers optimisés pour la production
- ✓ Documentation complète créée
- ✓ Scripts de déploiement préparés

### 📦 Fichiers à Déployer

```
dist/
├── index.cjs (924.9 KB)           ← Serveur Express
└── public/
    ├── favicon.png                ← Logo ANAROS
    ├── index.html
    └── assets/
        ├── index-DaG4Oy28.css
        ├── index-Dfy6RBHH.js
        └── IMG-20251201-WA0024_1764618421640-Dg9Ra90g.jpg

package.json                        ← Dépendances
package-lock.json                   ← Lock file
```

## 🎯 Démarrage Rapide (5 minutes)

### 1️⃣ Préparez Hostinger

1. Créez un compte sur [Hostinger](https://hostinger.com)
2. Configurez votre domaine
3. Créez une base de données PostgreSQL ou MySQL

### 2️⃣ Uploadez les Fichiers

**Option A : File Manager (Facile)**
1. Connectez-vous à Hostinger Dashboard
2. Allez dans : Hébergement → Gérer → File Manager
3. Naviguez vers `public_html`
4. Uploadez : `dist/`, `package.json`, `package-lock.json`

**Option B : SCP (Rapide)**
```bash
scp -r dist/ package.json package-lock.json username@domain.com:~/public_html/
```

### 3️⃣ Installez les Dépendances

Via Terminal Hostinger :
```bash
cd public_html
npm install --production
```

### 4️⃣ Configurez Node.js

1. Allez dans : Hébergement → Gérer → Node.js
2. Créez une application :
   - **Nom** : anaros-spa
   - **Domaine** : votre-domaine.com
   - **Port** : 5000
   - **Répertoire racine** : public_html
   - **Fichier d'entrée** : dist/index.cjs
   - **Environnement** : Production

### 5️⃣ Configurez les Variables

Dans Node.js Settings → Variables d'environnement :

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=votre-clé-aléatoire-très-longue
```

### 6️⃣ Redémarrez et Testez

1. Cliquez sur "Redémarrer" dans Node.js
2. Attendez 30 secondes
3. Accédez à https://votre-domaine.com

## 📚 Documentation Complète

| Fichier | Description | Durée |
|---------|-------------|-------|
| **HOSTINGER_QUICK_START.md** | Déploiement rapide | 5 min |
| **HOSTINGER_DEPLOYMENT.md** | Guide complet et détaillé | 30 min |
| **HOSTINGER_COMMANDS.md** | Toutes les commandes | Référence |
| **BUILD_SUMMARY.md** | Résumé du build | Référence |
| **deploy-hostinger.sh** | Script automatisé | 1 min |

## 🔧 Configuration de la Base de Données

### Supabase (Recommandé - Gratuit)

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans Settings → Database → Connection string
4. Copiez la chaîne PostgreSQL
5. Collez-la dans `DATABASE_URL` sur Hostinger

### Hostinger Database

1. Allez dans : Hébergement → Gérer → Bases de données
2. Créez une nouvelle base de données
3. Créez un utilisateur
4. Utilisez la chaîne de connexion fournie

## 🔐 Sécurité

- ✅ HTTPS automatique (certificat SSL gratuit)
- ✅ Variables d'environnement sécurisées
- ✅ Mode production activé
- ✅ Base de données protégée

## 📊 Monitoring

Après le déploiement, surveillez votre application :

1. Allez dans : Hébergement → Gérer → Node.js
2. Consultez les **Logs** pour les erreurs
3. Vérifiez les **Statistiques** (CPU, RAM)
4. Configurez les **Alertes**

## 🐛 Dépannage

### ❌ "Application Error"
```bash
# Vérifiez les logs
# Hébergement → Gérer → Node.js → Logs

# Vérifiez DATABASE_URL
echo $DATABASE_URL

# Réinstallez les dépendances
npm install --production
```

### ❌ "Cannot find module"
```bash
npm install --production
npm rebuild
```

### ❌ "Port already in use"
Changez le port à 5001 ou 5002 dans Node.js Settings

### ❌ "Database connection failed"
- Vérifiez la chaîne `DATABASE_URL`
- Vérifiez les identifiants
- Vérifiez que la base de données est accessible

## 🔄 Mises à Jour

Pour déployer une nouvelle version :

1. **Localement** :
```bash
npm run build
```

2. **Uploadez** les nouveaux fichiers :
```bash
scp -r dist/ username@domain.com:~/public_html/
```

3. **Redémarrez** l'application dans Hostinger

## 📞 Support

- **Hostinger Help** : https://support.hostinger.com
- **Terminal Hostinger** : Hébergement → Gérer → Terminal
- **Logs** : Hébergement → Gérer → Node.js → Logs

## ✅ Checklist Finale

### Avant le déploiement
- [ ] Compte Hostinger créé
- [ ] Domaine configuré
- [ ] Base de données créée
- [ ] Fichiers buildés ✓

### Pendant le déploiement
- [ ] Fichiers uploadés
- [ ] Dépendances installées
- [ ] Node.js configuré
- [ ] Variables d'environnement définies

### Après le déploiement
- [ ] Application accessible
- [ ] Logo ANAROS visible
- [ ] Pas d'erreurs
- [ ] API fonctionne
- [ ] Base de données connectée

## 🎉 Résultat Final

Votre application ANAROS Spa sera accessible à :
```
https://votre-domaine.com
```

Avec :
- ✅ Frontend React moderne
- ✅ Backend Express.js
- ✅ Base de données PostgreSQL
- ✅ Authentification sécurisée
- ✅ Calendrier intelligent
- ✅ Gestion des rendez-vous
- ✅ Dashboard avec KPIs

## 📖 Prochaines Étapes

1. **Lire** : HOSTINGER_QUICK_START.md
2. **Préparer** : Compte Hostinger + domaine
3. **Uploader** : Fichiers via File Manager
4. **Configurer** : Node.js + variables
5. **Tester** : Accéder à votre domaine

---

**Besoin d'aide ? Consultez la documentation ou contactez le support Hostinger.**

**Bonne chance avec votre déploiement ! 🚀**
