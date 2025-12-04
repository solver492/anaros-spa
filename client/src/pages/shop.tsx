import { useState, useMemo } from 'react';
import { Search, ChevronDown, ShoppingCart, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

// Product data structure - Cosmetics & Beauty Products
const shopData = {
  categories: [
    {
      id: 'cheveux',
      name: 'Soins Cheveux',
      icon: '💇',
      products: [
        {
          id: 'shampoing-keratine',
          name: 'Shampoing Kératine Premium',
          price: 24.99,
          rating: 4.8,
          description: 'Shampoing enrichi en kératine pour cheveux lisses et brillants. Répare les cheveux endommagés et prévient la casse. Idéal après un traitement lissant brésilien.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Répare les cheveux', 'Prévient la casse', 'Brillance intense', 'Protection thermique']
        },
        {
          id: 'apres-shampoing-argan',
          name: 'Après-Shampoing Argan Luxe',
          price: 22.50,
          rating: 4.7,
          description: 'Après-shampoing riche à l\'huile d\'argan marocaine. Nourrit en profondeur et démêle les cheveux. Parfait pour les cheveux secs et frisottis.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Hydratation intense', 'Démêlage facile', 'Anti-frisottis', 'Douceur extrême']
        },
        {
          id: 'masque-cheveux-profond',
          name: 'Masque Cheveux Profond 250ml',
          price: 28.99,
          rating: 4.9,
          description: 'Masque capillaire professionnel pour traitement intensif. Restaure la vitalité des cheveux abîmés. À utiliser 1-2 fois par semaine pour résultats optimaux.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Réparation profonde', 'Restaure la vitalité', 'Cheveux soyeux', 'Action 15 minutes']
        },
        {
          id: 'serum-cheveux-brillance',
          name: 'Sérum Cheveux Brillance Extrême',
          price: 32.00,
          rating: 4.8,
          description: 'Sérum léger sans résidu pour cheveux brillants et lisses. Protège de la chaleur et des UV. Idéal avant coiffage ou lissage.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Brillance éclatante', 'Protection thermique', 'Légèreté', 'Anti-frisottis']
        },
        {
          id: 'spray-protection-chaleur',
          name: 'Spray Protection Chaleur 200ml',
          price: 18.50,
          rating: 4.6,
          description: 'Spray protecteur avant lissage ou sèche-cheveux. Crée une barrière protectrice contre la chaleur jusqu\'à 230°C. Essentiel pour les cheveux colorés.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Protection jusqu\'à 230°C', 'Prévient la casse', 'Maintient la couleur', 'Finition légère']
        }
      ]
    },
    {
      id: 'visage',
      name: 'Soins Visage',
      icon: '✨',
      products: [
        {
          id: 'nettoyant-doux-visage',
          name: 'Nettoyant Doux Visage 200ml',
          price: 19.99,
          rating: 4.7,
          description: 'Nettoyant facial doux pour tous types de peau. Élimine les impuretés sans agresser. Formule enrichie en camomille et aloe vera.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Nettoyage en douceur', 'Tous types de peau', 'Apaise la peau', 'Sans résidu']
        },
        {
          id: 'tonique-hydratant',
          name: 'Tonique Hydratant Premium',
          price: 26.50,
          rating: 4.8,
          description: 'Tonique hydratant pour préparer la peau. Équilibre le pH et prépare à l\'absorption des soins. Contient de l\'acide hyaluronique.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Hydratation intense', 'Équilibre pH', 'Acide hyaluronique', 'Peau souple']
        },
        {
          id: 'serum-vitamine-c',
          name: 'Sérum Vitamine C 30ml',
          price: 45.00,
          rating: 4.9,
          description: 'Sérum concentré en vitamine C pure. Illumine et unifie le teint. Réduit les taches et les rides. À appliquer le matin pour un éclat radieux.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Illumine le teint', 'Anti-taches', 'Anti-rides', 'Éclat radieux']
        },
        {
          id: 'creme-hydratante-jour',
          name: 'Crème Hydratante Jour SPF 30',
          price: 38.00,
          rating: 4.7,
          description: 'Crème hydratante légère avec protection solaire SPF 30. Hydrate et protège des UV. Texture non grasse, idéale pour le jour.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Hydratation légère', 'Protection SPF 30', 'Non grasse', 'Protection UV']
        },
        {
          id: 'creme-nuit-regenerante',
          name: 'Crème Nuit Régénérante 50ml',
          price: 42.00,
          rating: 4.8,
          description: 'Crème riche pour la nuit. Régénère et répare la peau pendant le sommeil. Contient du rétinol et des peptides anti-âge.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Régénération nocturne', 'Anti-âge', 'Rétinol', 'Peau lisse']
        },
        {
          id: 'masque-visage-purifiant',
          name: 'Masque Visage Purifiant 100ml',
          price: 24.99,
          rating: 4.6,
          description: 'Masque purifiant à l\'argile pour pores dilatés. Élimine les impuretés et l\'excès de sébum. À utiliser 1-2 fois par semaine.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Purifie les pores', 'Réduit le sébum', 'Peau claire', 'Effet matifiant']
        }
      ]
    },
    {
      id: 'corps',
      name: 'Soins Corps',
      icon: '🧴',
      products: [
        {
          id: 'lait-corps-hydratant',
          name: 'Lait Corps Hydratant 250ml',
          price: 18.50,
          rating: 4.7,
          description: 'Lait corps riche et nourrissant. Hydrate intensément et laisse la peau douce. Texture légère qui pénètre rapidement.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Hydratation intense', 'Peau douce', 'Pénétration rapide', 'Texture légère']
        },
        {
          id: 'huile-corps-luxe',
          name: 'Huile Corps Luxe 100ml',
          price: 32.00,
          rating: 4.8,
          description: 'Huile sèche pour le corps avec huiles essentielles. Nourrit et parfume la peau. Idéale après le hammam ou le massage.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Nutrition intense', 'Parfum délicat', 'Huile sèche', 'Peau lisse']
        },
        {
          id: 'gommage-corps-sucre',
          name: 'Gommage Corps Sucre 200ml',
          price: 22.00,
          rating: 4.6,
          description: 'Gommage doux au sucre pour exfolier en douceur. Élimine les cellules mortes et prépare la peau. À utiliser 1-2 fois par semaine.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Exfoliation douce', 'Élimine les cellules mortes', 'Peau lisse', 'Sucre naturel']
        },
        {
          id: 'beurre-corps-riche',
          name: 'Beurre Corps Riche 200ml',
          price: 28.99,
          rating: 4.8,
          description: 'Beurre corps riche au beurre de karité et cacao. Nourrit intensément les peaux très sèches. Parfum gourmand et réconfortant.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Nutrition intense', 'Peaux très sèches', 'Beurre de karité', 'Parfum gourmand']
        }
      ]
    },
    {
      id: 'maquillage',
      name: 'Maquillage',
      icon: '💄',
      products: [
        {
          id: 'fond-teint-fluide',
          name: 'Fond de Teint Fluide Longue Tenue',
          price: 35.00,
          rating: 4.7,
          description: 'Fond de teint fluide avec couvrance modulable. Longue tenue jusqu\'à 12h. Formule légère et respirante pour un fini naturel.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Longue tenue 12h', 'Couvrance modulable', 'Fini naturel', 'Respirant']
        },
        {
          id: 'correcteur-anti-cernes',
          name: 'Correcteur Anti-Cernes',
          price: 22.50,
          rating: 4.8,
          description: 'Correcteur couvrant pour cernes et imperfections. Formule hydratante qui ne craquelle pas. Teinte universelle adaptable.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Couvrance intense', 'Hydratant', 'Ne craquelle pas', 'Teinte adaptable']
        },
        {
          id: 'poudre-compacte-matte',
          name: 'Poudre Compacte Effet Matte',
          price: 26.00,
          rating: 4.6,
          description: 'Poudre compacte pour fini matte et longue tenue. Fixe le maquillage et contrôle le sébum. Texture légère et naturelle.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Effet matte', 'Longue tenue', 'Contrôle sébum', 'Texture légère']
        },
        {
          id: 'rouge-levres-velours',
          name: 'Rouge à Lèvres Velours',
          price: 24.00,
          rating: 4.7,
          description: 'Rouge à lèvres texture velours ultra-confortable. Couleurs intenses et durables. Formule hydratante sans effet desséchant.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Texture velours', 'Couleurs intenses', 'Hydratant', 'Longue tenue']
        },
        {
          id: 'mascara-volume-extreme',
          name: 'Mascara Volume Extrême',
          price: 28.00,
          rating: 4.8,
          description: 'Mascara pour volume extrême et définition. Brosse innovante pour un effet cils de rêve. Résistant à l\'eau et longue tenue.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Volume extrême', 'Définition', 'Résistant à l\'eau', 'Longue tenue']
        }
      ]
    },
    {
      id: 'parfum',
      name: 'Parfums & Fragrances',
      icon: '🌸',
      products: [
        {
          id: 'eau-parfum-floral',
          name: 'Eau de Parfum Floral Luxe 100ml',
          price: 65.00,
          rating: 4.9,
          description: 'Eau de parfum floral avec notes de rose et jasmin. Parfum élégant et intemporel. Tenue 8-10h sur la peau.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Notes florales', 'Tenue 8-10h', 'Élégant', 'Intemporel']
        },
        {
          id: 'eau-toilette-frais',
          name: 'Eau de Toilette Frais 75ml',
          price: 42.00,
          rating: 4.7,
          description: 'Eau de toilette fraîche et légère. Notes d\'agrumes et musc blanc. Parfait pour le jour et l\'été.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Notes fraîches', 'Légèreté', 'Parfait pour le jour', 'Idéal été']
        },
        {
          id: 'brume-corps-parfumee',
          name: 'Brume Corps Parfumée 200ml',
          price: 28.00,
          rating: 4.6,
          description: 'Brume légère pour le corps avec parfum subtil. Hydrate et parfume délicatement. Idéale après la douche.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Hydrate', 'Parfum subtil', 'Légère', 'Après douche']
        }
      ]
    },
    {
      id: 'accessoires',
      name: 'Accessoires & Outils',
      icon: '🛁',
      products: [
        {
          id: 'brosse-cheveux-paddle',
          name: 'Brosse Paddle Professionnelle',
          price: 32.00,
          rating: 4.8,
          description: 'Brosse paddle ergonomique pour démêlage facile. Poils naturels doux pour cheveux. Réduit la casse et les frisottis.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Démêlage facile', 'Poils naturels', 'Réduit la casse', 'Ergonomique']
        },
        {
          id: 'peigne-demele-fin',
          name: 'Peigne Démêle Fin',
          price: 15.00,
          rating: 4.6,
          description: 'Peigne fin pour démêler les cheveux mouillés. Dents larges pour ne pas casser. Matière antistatique.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Démêle cheveux mouillés', 'Dents larges', 'Antistatique', 'Durable']
        },
        {
          id: 'eponge-konjac',
          name: 'Éponge Konjac Naturelle',
          price: 12.00,
          rating: 4.7,
          description: 'Éponge konjac 100% naturelle pour nettoyage doux du visage. Exfolie délicatement. Biodégradable et écologique.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Nettoyage doux', 'Exfoliation légère', 'Biodégradable', '100% naturelle']
        },
        {
          id: 'gant-hammam-kessa',
          name: 'Gant Hammam Kessa Traditionnel',
          price: 18.00,
          rating: 4.8,
          description: 'Gant kessa traditionnel pour gommage du corps. Exfolie en profondeur. Idéal pour préparer la peau aux soins.',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          benefits: ['Gommage profond', 'Traditionnel', 'Prépare aux soins', 'Réutilisable']
        }
      ]
    }
  ]
};

// Flatten all products for search
const getAllProducts = () => {
  const products: any[] = [];
  shopData.categories.forEach(category => {
    category.products.forEach(product => {
      products.push({
        ...product,
        category: category.name,
        categoryId: category.id
      });
    });
  });
  return products;
};

interface ExpandedProduct {
  [key: string]: boolean;
}

export default function ShopView() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProducts, setExpandedProducts] = useState<ExpandedProduct>({});
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  const allProducts = getAllProducts();

  // Intelligent search
  const filteredProducts = useMemo(() => {
    let results = allProducts;

    if (selectedCategory) {
      results = results.filter(p => p.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.benefits && p.benefits.some((b: string) => b.toLowerCase().includes(query)))
      );
    }

    return results;
  }, [selectedCategory, searchQuery]);

  const toggleProductExpanded = (productId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const addToCart = (product: any) => {
    setCart(prev => [...prev, { ...product, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId: number) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white shadow-md pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
              Notre Boutique
            </h1>
            <p className="text-stone-600 text-lg">
              Découvrez nos services et produits exclusifs
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <Input
              type="text"
              placeholder="Rechercher un service, produit, catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-full border-2 border-amber-200 focus:border-amber-600 focus:outline-none w-full"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-serif text-stone-800 mb-6">Catégories</h2>

              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    !selectedCategory
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Tous les produits
                </button>

                {shopData.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category.id ? null : category.id
                      )
                    }
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </span>
                    <span className="text-xs bg-stone-200 px-2 py-1 rounded">
                      {category.products.length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(!showCart)}
                className="w-full mt-6 bg-amber-600 text-white px-4 py-3 rounded-lg hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Panier ({cart.length})
              </button>
            </div>
          </motion.div>

          {/* Main Content - Products */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 overflow-hidden bg-stone-200">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {product.price}€
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="mb-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">
                                {product.category}
                              </p>
                              <h3 className="text-lg font-serif text-stone-800 mt-1">
                                {product.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                              <Star className="w-4 h-4 fill-amber-600 text-amber-600" />
                              <span className="text-sm font-semibold text-amber-800">
                                {product.rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Description & Benefits */}
                        <div className="mb-4">
                          <button
                            onClick={() => toggleProductExpanded(product.id)}
                            className="w-full flex items-center justify-between text-stone-600 hover:text-amber-600 transition-colors py-2 px-2 -mx-2 rounded hover:bg-stone-50"
                          >
                            <span className="text-sm font-medium">
                              Description & Bénéfices
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                expandedProducts[product.id]
                                  ? 'rotate-180'
                                  : ''
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {expandedProducts[product.id] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 space-y-3"
                              >
                                <div className="text-sm text-stone-600 leading-relaxed pl-2 border-l-2 border-amber-200">
                                  {product.description}
                                </div>
                                
                                <div className="bg-amber-50 rounded p-3">
                                  <p className="text-xs font-semibold text-amber-800 mb-2 uppercase">Bénéfices:</p>
                                  <ul className="space-y-1">
                                    {product.benefits && product.benefits.map((benefit: string, idx: number) => (
                                      <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                                        <span className="text-amber-600 mt-1">✓</span>
                                        <span>{benefit}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-serif text-amber-600">
                            {product.price}€
                          </span>
                        </div>

                        <Button
                          onClick={() => addToCart(product)}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Ajouter au panier
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-stone-600 text-lg">
                  Aucun produit ne correspond à votre recherche.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-serif text-stone-800">Panier</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-1 hover:bg-stone-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {cart.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-4">
                      {cart.map((item) => (
                        <div
                          key={item.cartId}
                          className="flex justify-between items-start bg-stone-50 p-3 rounded"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-stone-800">
                              {item.name}
                            </p>
                            <p className="text-sm text-stone-600">
                              {item.price}€
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold text-stone-800">
                          Total:
                        </span>
                        <span className="font-semibold text-amber-600 text-lg">
                          {cart.reduce((sum, item) => sum + item.price, 0)}€
                        </span>
                      </div>
                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                        Procéder au paiement
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-stone-600 py-8">
                    Votre panier est vide
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
