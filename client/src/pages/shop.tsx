import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronDown, ShoppingCart, X, Star, Heart, ArrowRight, Filter, ShoppingBag, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ParallaxProductCard } from '@/components/parallax-product-card';
import { ProductDetailDialog } from '@/components/product-detail-dialog';
import type { Product, Category } from '@shared/schema';

interface ExpandedProduct {
  [key: string]: boolean;
}

interface CartItem extends Product {
  cartId: number;
}

export default function ShopView() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProducts, setExpandedProducts] = useState<ExpandedProduct>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State for product details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch products from API
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Fetch categories from API
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Filter only published products
  const publishedProducts = useMemo(() => {
    return products.filter(p => p.published);
  }, [products]);

  // Intelligent search and filtering
  const filteredProducts = useMemo(() => {
    let results = publishedProducts;

    if (selectedCategory) {
      results = results.filter(p => p.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query))
      );
    }

    return results;
  }, [publishedProducts, selectedCategory, searchQuery]);

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Essentiels';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Essentiels';
  };

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, { ...product, cartId: Date.now() }]);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const removeFromCart = (cartId: number) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  }, [cart]);

  const generateWhatsAppMessage = () => {
    const phoneNumber = '213542384160';
    let message = '✨ *Nouvelle Commande - ANAROS Beauty Lounge*\n\n';

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* - ${item.price}€\n`;
    });

    message += `\n💰 *Total: ${totalAmount.toFixed(2)}€*\n\n`;
    message += 'Je souhaiterais obtenir ces produits. Merci !';

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-amber-200 animate-ping"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-white rounded-full shadow-lg">
              <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-serif text-stone-800">Préparation de votre univers...</h2>
          <p className="text-stone-400 mt-2 text-sm uppercase tracking-widest">Anaros Beauty Lounge</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-amber-100 selection:text-amber-900">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-50/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Badge variant="outline" className="mb-4 border-amber-200 text-amber-700 bg-amber-50/50 px-3 py-1 text-xs uppercase tracking-widest font-bold">
              Collections Exclusives
            </Badge>
            <h1 className="text-5xl md:text-7xl font-serif text-slate-900 mb-6 leading-tight">
              L'élégance à portée <br />
              <span className="text-amber-600 italic">de votre peau.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
              Découvrez une sélection rigoureuse de soins et produits de beauté conçus pour sublimer votre éclat naturel.
            </p>

            <div className="relative group max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <Input
                type="text"
                placeholder="Rechercher un soin, un parfum, une gamme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-7 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-0 focus:border-amber-400 text-lg transition-all shadow-sm group-hover:shadow-md"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-24">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12 py-6 border-b border-slate-200">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${!selectedCategory
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
            >
              Tous les produits
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setShowCart(true)}
              className="relative p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-amber-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <ParallaxProductCard
                product={product}
                categoryName={getCategoryName(product.categoryId)}
                onAddToCart={addToCart}
                onClick={handleProductClick}
              />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-serif text-slate-800 mb-2">Aucun produit trouvé</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Nous n'avons trouvé aucun résultat pour votre recherche. Essayez d'autres termes ou catégories.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              className="mt-8 rounded-xl border-slate-200"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Product Detail Dialog */}
      <ProductDetailDialog
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={addToCart}
      />

      {/* Modern Slide-out Cart */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-slate-900">Votre Panier</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                    {cart.length} article{cart.length > 1 ? 's' : ''} sélectionné{cart.length > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-all"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 p-8 space-y-6 scrollbar-hide">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <motion.div
                      layout
                      key={item.cartId}
                      className="flex items-center gap-4"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {item.images?.[0] && (
                          <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 truncate">{item.name}</h4>
                        <p className="text-amber-600 font-bold mt-1">{item.price}€</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-serif italic text-lg">Votre panier est encore vide</p>
                    <Button
                      variant="ghost"
                      onClick={() => setShowCart(false)}
                      className="text-amber-600 font-bold"
                    >
                      Continuer vos achats
                    </Button>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-500 font-medium">Total de la commande</span>
                    <span className="text-2xl font-bold text-slate-900">{totalAmount.toFixed(2)}€</span>
                  </div>

                  <Button
                    onClick={generateWhatsAppMessage}
                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 text-lg font-bold"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.335 1.236-3.356 2.259-1.02 1.02-1.756 2.117-2.259 3.355C2.05 12.745 1.5 14.373 1.5 16.025c0 1.652.55 3.28 1.637 4.757l-1.738 5.318 5.318-1.738c1.477 1.087 3.105 1.637 4.757 1.637 1.652 0 3.28-.55 4.757-1.637 1.02-1.02 1.756-2.117 2.259-3.355.503-1.238.949-2.866.949-4.255 0-1.652-.55-3.28-1.637-4.757-1.02-1.02-2.117-1.756-3.355-2.259-1.238-.503-2.866-.949-4.255-.949z" />
                    </svg>
                    Commander via WhatsApp
                  </Button>
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                    Paiement à la livraison
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Internal Trash2 icon since I forgot to import it if it's not in lucide
