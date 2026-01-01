# 🛍️ Module de Gestion de Boutique - Back-Office

## Vue d'ensemble

Ce module fournit un back-office complet pour gérer une boutique en ligne avec toutes les fonctionnalités essentielles d'un système e-commerce.

## 🎯 Fonctionnalités

### 📊 Dashboard
- **Statistiques en temps réel**
  - Nombre total de produits et produits publiés
  - Alertes de stock faible
  - Nombre de commandes (total, en attente, en cours, livrées)
  - Revenus totaux
  - Nombre de clients

- **Aperçus rapides**
  - 5 dernières commandes
  - Produits en stock faible
  - Navigation rapide vers les sections

### 📦 Gestion des Produits
- **CRUD complet** : Créer, Lire, Mettre à jour, Supprimer
- **Champs disponibles** :
  - Nom et slug (URL)
  - Description courte et complète
  - Prix de vente, prix barré, coût
  - SKU et code-barres
  - Stock et seuil de stock faible
  - Catégorie
  - Statut (publié/brouillon)
  - Produit vedette
  - Images (support multi-images)
  - Poids et dimensions
  - Tags
  - Meta title et description (SEO)

### 🗂️ Gestion des Catégories
- **CRUD complet**
- **Hiérarchie** : Support des catégories parentes/enfants
- **Champs** :
  - Nom et slug
  - Description
  - Image
  - Catégorie parente

### 👥 Gestion des Clients
- **CRUD complet**
- **Informations** :
  - Nom, prénom, email
  - Téléphone, entreprise
  - Adresse complète (rue, ville, code postal, pays)
  - Notes internes

### 📋 Gestion des Commandes
- **Visualisation** :
  - Numéro de commande
  - Client associé
  - Date de création
  - Montant total
  - Statut (en attente, en cours, expédié, livré, annulé)
  - Statut de paiement (en attente, payé, échoué, remboursé)

## 🚀 Accès au Back-Office

### URL d'accès
```
http://localhost:5000/backoffice
```

### Structure des routes
- `/backoffice` - Dashboard principal
- `/backoffice/products` - Gestion des produits
- `/backoffice/categories` - Gestion des catégories
- `/backoffice/orders` - Gestion des commandes
- `/backoffice/customers` - Gestion des clients

## 📡 API Endpoints

### Produits
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Récupère un produit
- `POST /api/products` - Crée un produit
- `PUT /api/products/:id` - Met à jour un produit
- `DELETE /api/products/:id` - Supprime un produit

### Catégories
- `GET /api/categories` - Liste toutes les catégories
- `GET /api/categories/:id` - Récupère une catégorie
- `POST /api/categories` - Crée une catégorie
- `PUT /api/categories/:id` - Met à jour une catégorie
- `DELETE /api/categories/:id` - Supprime une catégorie

### Clients
- `GET /api/customers` - Liste tous les clients
- `GET /api/customers/:id` - Récupère un client
- `POST /api/customers` - Crée un client
- `PUT /api/customers/:id` - Met à jour un client
- `DELETE /api/customers/:id` - Supprime un client

### Commandes
- `GET /api/orders` - Liste toutes les commandes
- `GET /api/orders/:id` - Récupère une commande avec ses articles
- `GET /api/customers/:customerId/orders` - Commandes d'un client
- `POST /api/orders` - Crée une commande
- `PUT /api/orders/:id` - Met à jour une commande
- `DELETE /api/orders/:id` - Supprime une commande

### Statistiques
- `GET /api/shop/stats` - Récupère toutes les statistiques du dashboard

## 🎨 Design

Le back-office utilise un design moderne avec :
- **Gradients colorés** pour les cartes de statistiques
- **Animations** et transitions fluides
- **Mode sombre** supporté
- **Responsive** pour mobile et tablette
- **Icônes Lucide** pour une meilleure UX
- **Composants shadcn/ui** pour une interface cohérente

## 💾 Stockage

Actuellement, le système utilise un **stockage en mémoire** (`MemStorage`). Les données sont perdues au redémarrage du serveur.

### Migration vers PostgreSQL

Pour passer à une base de données persistante :

1. Configurez votre `DATABASE_URL` dans les variables d'environnement
2. Exécutez les migrations :
   ```bash
   npm run db:push
   ```
3. Remplacez `MemStorage` par une implémentation PostgreSQL dans `server/storage.ts`

## 🔒 Sécurité

⚠️ **Important** : Ce back-office n'a actuellement **aucune authentification**. 

Pour la production, vous devez :
1. Ajouter un système d'authentification (JWT, sessions, etc.)
2. Protéger toutes les routes `/api/*` et `/backoffice/*`
3. Implémenter des rôles et permissions
4. Ajouter la validation CSRF
5. Limiter les tentatives de connexion

## 📝 Exemple d'utilisation

### Créer un produit via l'API

```javascript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Mon Produit',
    slug: 'mon-produit',
    description: 'Description complète du produit',
    shortDescription: 'Description courte',
    price: '29.99',
    stock: 100,
    published: true,
    categoryId: 'category-id-here'
  })
});

const product = await response.json();
```

### Créer une commande

```javascript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: 'customer-id',
    status: 'pending',
    paymentStatus: 'pending',
    subtotal: '100.00',
    tax: '20.00',
    shipping: '5.00',
    total: '125.00',
    items: [
      {
        productId: 'product-id',
        productName: 'Nom du produit',
        quantity: 2,
        price: '50.00',
        total: '100.00'
      }
    ]
  })
});

const order = await response.json();
```

## 🛠️ Technologies utilisées

- **Frontend** : React, TypeScript, Wouter (routing), TanStack Query
- **UI** : shadcn/ui, Tailwind CSS, Lucide Icons
- **Backend** : Express.js, TypeScript
- **Validation** : Zod
- **ORM** : Drizzle ORM (prêt pour PostgreSQL)

## 📚 Prochaines étapes

1. **Authentification** : Ajouter un système de login sécurisé
2. **Upload d'images** : Implémenter l'upload de fichiers
3. **Filtres et recherche** : Ajouter des filtres avancés
4. **Export de données** : CSV, Excel
5. **Notifications** : Emails pour les commandes
6. **Analytics** : Graphiques et rapports détaillés
7. **Multi-langue** : Support i18n
8. **API publique** : Pour le frontend boutique

## 🎉 Félicitations !

Vous avez maintenant un back-office complet et professionnel pour gérer votre boutique en ligne !
