import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

export function FloatingCart() {
    const { cart, setIsCartOpen, isCartOpen } = useCart();

    if (cart.length === 0 || isCartOpen) return null;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100]"
        >
            <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-5 bg-amber-600 text-white rounded-full shadow-2xl hover:bg-amber-700 transition-colors group"
            >
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-amber-600 rounded-full text-[12px] font-bold flex items-center justify-center border-2 border-amber-600 group-hover:bg-amber-50 transition-colors">
                    {cart.length}
                </span>

                {/* Subtle pulse animation */}
                <span className="absolute inset-0 rounded-full bg-amber-600 animate-ping opacity-20 pointer-events-none" />
            </button>
        </motion.div>
    );
}
