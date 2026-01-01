import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Check, AlertCircle, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@shared/schema';

interface ProductDetailDialogProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}

export function ProductDetailDialog({ product, isOpen, onClose, onAddToCart }: ProductDetailDialogProps) {
    if (!product) return null;

    const mainImage = product.images?.[0];
    const hasMultipleImages = product.images && product.images.length > 1;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-none shadow-2xl rounded-3xl">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 relative bg-slate-50 group">
                        {mainImage ? (
                            <div className="aspect-[4/5] md:h-full relative overflow-hidden">
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {hasMultipleImages && product.images && (
                                    <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                        {product.images.map((img, i) => (
                                            <button
                                                key={i}
                                                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === 0 ? 'border-amber-500 scale-105' : 'border-white/50 hover:border-white'}`}
                                            >
                                                <img src={img} className="w-full h-full object-cover" alt="" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="aspect-[4/5] md:h-full flex items-center justify-center text-slate-200">
                                <ShoppingBag className="w-24 h-24" />
                            </div>
                        )}

                        {/* Promo Badge */}
                        <div className="absolute top-6 left-6">
                            {product.featured && (
                                <Badge className="bg-amber-500/90 text-white border-none px-4 py-1.5 text-xs font-bold rounded-full shadow-lg backdrop-blur-md">
                                    SÉLECTION EXCLUSIVE
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50/50">
                                    {product.sku ? `SKU: ${product.sku}` : 'Collection Premium'}
                                </Badge>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-bold">4.9</span>
                                </div>
                            </div>

                            <DialogTitle className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 leading-tight">
                                {product.name}
                            </DialogTitle>

                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-3xl font-bold text-slate-900">
                                    {parseFloat(product.price).toFixed(2)}€
                                </span>
                                {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                                    <span className="text-xl text-slate-400 line-through">
                                        {parseFloat(product.compareAtPrice).toFixed(2)}€
                                    </span>
                                )}
                            </div>

                            <div className="space-y-6 mb-10 overflow-y-auto max-h-[30vh] pr-4 no-scrollbar">
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3">À propos du produit</h4>
                                    <p className="text-slate-600 leading-relaxed text-lg italic font-serif">
                                        {product.description || "Aucune description détaillée disponible pour le moment."}
                                    </p>
                                </div>

                                {product.shortDescription && (
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-sm text-slate-500 font-medium">
                                            "{product.shortDescription}"
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span>Dermatologiquement testé</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span>Ingrédients naturels</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                                {product.stock > 0 ? (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-sm font-bold text-slate-700">En stock : {product.stock} unités restantes</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <span className="text-sm font-bold text-red-500">Actuellement en rupture de stock</span>
                                    </>
                                )}
                            </div>

                            <Button
                                onClick={() => {
                                    onAddToCart(product);
                                    onClose();
                                }}
                                disabled={product.stock === 0}
                                className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Ajouter au Panier
                            </Button>

                            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
                                Paiement sécurisé à la livraison • Satisfaction garantie
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
