import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';

export function CartDrawer() {
    const { cart, removeFromCart, totalAmount, isCartOpen, setIsCartOpen } = useCart();

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

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[110]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[111] shadow-2xl flex flex-col"
                    >
                        <div className="p-8 border-b border-stone-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-serif text-stone-900">Votre Panier</h2>
                                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-1">
                                    {cart.length} article{cart.length > 1 ? 's' : ''} sélectionné{cart.length > 1 ? 's' : ''}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-stone-50 rounded-full transition-all"
                            >
                                <X className="w-6 h-6 text-stone-400" />
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
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                                            {item.images?.[0] && (
                                                <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-stone-900 truncate">{item.name}</h4>
                                            <p className="text-amber-600 font-bold mt-1">{item.price}€</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.cartId)}
                                            className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag className="w-6 h-6 text-stone-300" />
                                    </div>
                                    <p className="text-stone-500 font-serif italic text-lg">Votre panier est encore vide</p>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-amber-600 font-bold"
                                    >
                                        Continuer vos achats
                                    </Button>
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-8 bg-stone-50 border-t border-stone-100 space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-stone-500 font-medium">Total de la commande</span>
                                    <span className="text-2xl font-bold text-stone-900">{totalAmount.toFixed(2)}€</span>
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
                                <p className="text-[10px] text-center text-stone-400 font-bold uppercase tracking-widest">
                                    Paiement à la livraison
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
