# ⚡ Déploiement Rapide sur Hostinger (5 minutes)

## 📋 Checklist Avant Déploiement

- [x] Application buildée (`npm run build`)
- [ ] Compte Hostinger actif
- [ ] Domaine configuré sur Hostinger
- [ ] Accès SSH/FTP disponible
- [ ] Base de données PostgreSQL/MySQL créée

## 🚀 Déploiement en 5 Étapes

### Étape 1 : Préparez les fichiers (1 min)

L'application a déjà été buildée. Vous avez :
```
dist/
├── index.cjs (serveur)
└── public/ (frontend)

package.json
package-lock.json
```

### Étape 2 : Uploadez via File Manager (2 min)

1. Connectez-vous à **Hostinger Dashboard**
2. Allez dans : **Hébergement** → **Gérer** → **File Manager**
3. Naviguez vers `public_html`
4. Uploadez :
   - Dossier `dist/`
   - Fichier `package.json`
   - Fichier `package-lock.json`

### Étape 3 : Installez les dépendances (1 min)

**Via Terminal Hostinger :**
1. Allez dans : **Hébergement** → **Gérer** → **Terminal**
2. Exécutez :
```bash
cd public_html
npm install --production
```

### Étape 4 : Configurez Node.js (1 min)

1. Allez dans : **Hébergement** → **Gérer** → **Node.js**
2. Cliquez sur **"Créer une application"**
3. Remplissez :
   - **Nom** : anaros-spa
   - **Domaine** : votre-domaine.com
   - **Port** : 5000
   - **Répertoire racine** : public_html
   - **Fichier d'entrée** : dist/index.cjs
   - **Version Node** : 20.x (ou plus récente)
   - **Environnement** : Production

### Étape 5 : Configurez les Variables d'Environnement

1. Dans la même section Node.js, cliquez sur **"Variables d'environnement"**
2. Ajoutez :

```
NODE_ENV = production
PORT = 5000
DATABASE_URL = postgresql://user:password@host:5432/database
SESSION_SECRET = votre-clé-aléatoire-très-longue
```

**Où trouver DATABASE_URL ?**
- **Supabase** : https://supabase.com → Paramètres du projet → Chaîne de connexion
- **Hostinger DB** : Hébergement → Gérer → Bases de données → Détails

3. Cliquez sur **"Enregistrer"**

## ✅ Vérification

Après quelques secondes, votre application devrait être en ligne à :
```
https://votre-domaine.com
```

**Vérifiez :**
- [ ] Page d'accueil charge
- [ ] Logo ANAROS s'affiche
- [ ] Pas d'erreurs dans la console (F12)
- [ ] API répond (`/api/health`)

## 🔍 Dépannage

### ❌ "Application Error"
- Vérifiez les logs : **Hébergement** → **Gérer** → **Node.js** → **Logs**
- Vérifiez que `DATABASE_URL` est correct
- Vérifiez que le fichier `dist/index.cjs` existe

### ❌ "Cannot find module"
```bash
cd public_html
npm install --production
npm rebuild
```

### ❌ "Port already in use"
- Changez le port à 5001 ou 5002
- Redémarrez l'application

### ❌ "Database connection failed"
- Vérifiez la chaîne `DATABASE_URL`
- Vérifiez les identifiants de base de données
- Vérifiez que la base de données est accessible

## 📊 Monitoring

Pour surveiller votre application :
1. Allez dans : **Hébergement** → **Gérer** → **Node.js**
2. Consultez les **Logs** et les **Statistiques**
3. Configurez les **Alertes** pour CPU/RAM

## 🔄 Mise à Jour

Pour déployer une nouvelle version :

1. **Localement** :
```bash
npm run build
```

2. **Uploadez** les nouveaux fichiers du dossier `dist/`

3. **Redémarrez** l'application :
   - Hébergement → Gérer → Node.js → Redémarrer

## 📞 Besoin d'aide ?

- **Documentation Hostinger** : https://support.hostinger.com
- **Logs d'erreur** : Hébergement → Gérer → Node.js → Logs
- **Support Hostinger** : Chat en direct sur le dashboard

---

**Votre application ANAROS Spa est maintenant en production ! 🎉**
