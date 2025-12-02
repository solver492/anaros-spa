# 🔧 Dépannage Render - ANAROS Spa

## ❌ Erreur : `tsx: not found`

### Problème
```
sh: 1: tsx: not found
==> Build failed 😞
```

### Cause
Render ne trouve pas `tsx` globalement. Les scripts doivent utiliser `npx tsx`.

### Solution ✅
Les scripts ont été corrigés pour utiliser `npx tsx` :

```json
{
  "scripts": {
    "dev": "NODE_ENV=development npx tsx server/index.ts",
    "build": "npx tsx script/build.ts",
    "start": "NODE_ENV=production node dist/index.cjs"
  }
}
```

### Commit de la correction
- Commit : `5a19113`
- Message : "Fix: Use npx tsx for build and dev scripts to work on Render"

## 🔍 Autres Erreurs Courantes

### ❌ "Build failed" - Dépendances manquantes

**Symptôme :**
```
Error: Cannot find module '...'
```

**Solution :**
1. Vérifiez que toutes les dépendances sont dans `package.json`
2. Vérifiez que `tsx` est dans `devDependencies`
3. Redéployez manuellement

### ❌ "Application Error" - Variables d'environnement

**Symptôme :**
```
Application Error
```

**Solution :**
1. Vérifiez les variables d'environnement dans Render Dashboard
2. Assurez-vous que `DATABASE_URL` est correct
3. Vérifiez que `SESSION_SECRET` est défini

### ❌ "Cannot connect to database"

**Symptôme :**
```
Error: connect ECONNREFUSED
```

**Solution :**
1. Vérifiez la chaîne `DATABASE_URL`
2. Assurez-vous que la base de données est accessible
3. Vérifiez les règles de pare-feu

### ❌ "Application is sleeping"

**Symptôme :**
```
Application is starting...
```

**Solution :**
- C'est normal avec le plan Free
- Attendez 30-60 secondes
- Rechargez la page
- Passez au plan Starter pour éviter cela

## 📊 Vérifier les Logs

### Accès aux Logs
1. Allez sur https://dashboard.render.com
2. Sélectionnez votre Web Service
3. Cliquez sur "Logs"
4. Consultez les logs en temps réel

### Logs de Build
- Apparaissent pendant le déploiement
- Montrent les erreurs de compilation
- Montrent les dépendances installées

### Logs d'Exécution
- Apparaissent après le déploiement
- Montrent les erreurs runtime
- Montrent les requêtes API

## 🛠️ Débogage Local

### Testez localement avant de pousser
```bash
# Nettoyez
rm -rf dist
rm -rf node_modules

# Réinstallez
npm install

# Testez le build
npm run build

# Testez l'application
npm start
```

### Vérifiez les variables d'environnement
```bash
# Testez avec les mêmes variables que Render
export NODE_ENV=production
export PORT=10000
export DATABASE_URL="votre_chaîne_de_connexion"
export SESSION_SECRET="votre_clé_secrète"

npm start
```

## 🔄 Redéploiement Manuel

Si le déploiement automatique ne fonctionne pas :

1. **Via Render Dashboard**
   - Web Service → Manual Deploy
   - Choisissez le commit
   - Cliquez sur "Deploy"

2. **Via Git**
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

## 📋 Checklist de Dépannage

### Build échoue ?
- [ ] Scripts utilisent `npx tsx` ✅
- [ ] `tsx` est dans `devDependencies` ✅
- [ ] Toutes les dépendances sont listées
- [ ] Pas d'erreurs de syntaxe

### Application ne démarre pas ?
- [ ] Variables d'environnement configurées
- [ ] `DATABASE_URL` est correct
- [ ] `SESSION_SECRET` est défini
- [ ] Port est `10000`

### Base de données inaccessible ?
- [ ] Chaîne de connexion correcte
- [ ] Base de données accessible
- [ ] Pare-feu configuré
- [ ] SSL activé

### Application lente ?
- [ ] Plan Free (mise en veille normale)
- [ ] Passez au plan Starter
- [ ] Optimisez les requêtes
- [ ] Ajoutez du cache

## 🆘 Support Render

- **Documentation** : https://render.com/docs
- **Dépannage** : https://render.com/docs/troubleshooting-deploys
- **Support** : https://render.com/support
- **Status** : https://status.render.com

## 🎉 Succès !

Si tout fonctionne, votre application sera accessible à :

```
https://anaros-spa.onrender.com
```

Avec :
✅ Frontend React moderne
✅ Backend Express.js
✅ Base de données PostgreSQL
✅ Authentification sécurisée
✅ Calendrier intelligent
✅ Gestion des rendez-vous
✅ Dashboard avec KPIs
✅ Logo ANAROS visible
✅ HTTPS sécurisé

---

**Problème résolu ! 🚀**
