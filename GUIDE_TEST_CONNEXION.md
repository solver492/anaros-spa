# 🚀 Guide de Test Rapide - Boutique ↔ Back-Office

## ⚡ Test en 3 minutes

### 1️⃣ Créer une catégorie (30 secondes)

1. Ouvrez http://localhost:5000/backoffice/categories
2. Cliquez sur **"Nouvelle Catégorie"**
3. Remplissez :
   - **Nom** : `Soins Cheveux`
   - **Slug** : `soins-cheveux`
   - **Description** : `Produits pour cheveux`
4. Cliquez sur **"Créer"**

✅ **Résultat** : La catégorie apparaît dans la liste

---

### 2️⃣ Créer un produit (1 minute)

1. Ouvrez http://localhost:5000/backoffice/products
2. Cliquez sur **"Nouveau Produit"**
3. Remplissez :
   - **Nom** : `Shampoing Kératine Premium`
   - **Slug** : `shampoing-keratine-premium`
   - **Description courte** : `Shampoing enrichi en kératine`
   - **Description** : `Répare les cheveux endommagés et prévient la casse`
   - **Prix** : `24.99`
   - **Stock** : `50`
   - **Catégorie** : Sélectionnez `Soins Cheveux`
   - **Publié** : ✓ (coché)
4. Cliquez sur **"Créer"**

✅ **Résultat** : Le produit apparaît dans la liste

---

### 3️⃣ Voir le produit sur la boutique (30 secondes)

1. Ouvrez http://localhost:5000
2. Cliquez sur **"BOUTIQUE"** dans le menu
3. **Vous devriez voir** :
   - Votre produit "Shampoing Kératine Premium"
   - Prix : 24.99€
   - Catégorie : "Soins Cheveux" dans la sidebar
   - Badge "En stock (50)"

✅ **Résultat** : Le produit est visible sur la boutique !

---

### 4️⃣ Tester la mise à jour en temps réel (1 minute)

#### Test 1 : Modifier le prix

1. Retournez au back-office : http://localhost:5000/backoffice/products
2. Cliquez sur l'icône **"Modifier"** (crayon) de votre produit
3. Changez le prix à `29.99`
4. Cliquez sur **"Mettre à jour"**
5. Retournez à la boutique
6. **Le prix est maintenant 29.99€** !

#### Test 2 : Mettre en rupture de stock

1. Retournez au back-office
2. Modifiez le produit
3. Mettez le **stock à 0**
4. Cliquez sur **"Mettre à jour"**
5. Retournez à la boutique
6. **Vous devriez voir** :
   - Badge rouge "Rupture de stock"
   - Bouton "Ajouter au panier" désactivé

#### Test 3 : Produit vedette

1. Retournez au back-office
2. Modifiez le produit
3. Cochez **"Produit vedette"**
4. Remettez le stock à `50`
5. Cliquez sur **"Mettre à jour"**
6. Retournez à la boutique
7. **Vous devriez voir** :
   - Badge violet "⭐ Vedette" sur l'image

---

## 🎯 Tests avancés

### Test du filtrage par catégorie

1. Créez une 2ème catégorie : `Soins Visage`
2. Créez un produit dans cette catégorie : `Sérum Vitamine C`
3. Sur la boutique :
   - Cliquez sur "Soins Cheveux" → Seul le shampoing s'affiche
   - Cliquez sur "Soins Visage" → Seul le sérum s'affiche
   - Cliquez sur "Tous les produits" → Les deux s'affichent

### Test de la recherche

1. Dans la barre de recherche de la boutique
2. Tapez "kératine"
3. **Résultat** : Seul le shampoing apparaît
4. Tapez "vitamine"
5. **Résultat** : Seul le sérum apparaît

### Test du panier

1. Ajoutez le shampoing au panier
2. Cliquez sur "Panier (1)"
3. **Vous devriez voir** :
   - Le produit dans le panier
   - Le prix total
   - Le bouton WhatsApp

---

## 📊 Vérifications

### ✅ Checklist de connexion

- [ ] Les produits créés dans le back-office apparaissent sur la boutique
- [ ] Les modifications de prix se reflètent instantanément
- [ ] Les catégories s'affichent dans la sidebar
- [ ] Le filtrage par catégorie fonctionne
- [ ] La recherche fonctionne
- [ ] Les badges de stock s'affichent correctement
- [ ] Les produits en rupture de stock sont désactivés
- [ ] Les produits vedettes ont leur badge
- [ ] Les produits non publiés sont cachés

---

## 🐛 Dépannage

### Le produit n'apparaît pas sur la boutique ?

1. Vérifiez que **"Publié"** est coché
2. Vérifiez que le **stock > 0** (ou acceptez qu'il soit en rupture)
3. Rafraîchissez la page (F5)

### Les modifications ne s'affichent pas ?

1. Attendez 1-2 secondes (React Query met à jour le cache)
2. Rafraîchissez la page si nécessaire
3. Vérifiez la console du navigateur (F12) pour les erreurs

### La catégorie n'apparaît pas ?

1. Vérifiez qu'il y a au moins 1 produit **publié** dans cette catégorie
2. Les catégories vides sont masquées automatiquement

---

## 🎉 Félicitations !

Si tous les tests passent, votre boutique est **100% connectée** au back-office !

**Vous pouvez maintenant** :
- Gérer tous vos produits depuis le back-office
- Voir les changements en temps réel sur la boutique
- Créer des catégories et organiser vos produits
- Gérer le stock et les prix facilement

---

## 📞 Support

Pour toute question ou problème :
1. Consultez `BOUTIQUE_BACKOFFICE_CONNECTION.md` pour plus de détails
2. Consultez `BACKOFFICE_README.md` pour la documentation complète
3. Vérifiez les logs du serveur dans le terminal
