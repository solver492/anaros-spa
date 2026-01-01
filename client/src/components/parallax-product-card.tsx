import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import type { Product } from '@shared/schema';

interface ParallaxProductCardProps {
    product: Product;
    categoryName: string;
    onAddToCart: (product: Product) => void;
    onClick: (product: Product) => void;
}

export function ParallaxProductCard({ product, categoryName, onAddToCart, onClick }: ParallaxProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0, bX: '50%', bY: '80%' });
    const [isActive, setIsActive] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // "Reverse" tilt effect logic from the inspiration
        const X = (offsetX - w / 2) / 3 / 3;
        const Y = -(offsetY - h / 2) / 3 / 3;

        setTilt({
            x: Y,
            y: X,
            bY: (80 - (X / 4)).toFixed(2) + '%',
            bX: (50 - (Y / 4)).toFixed(2) + '%'
        });
    }, []);

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => {
        setIsActive(false);
        setTilt({ x: 0, y: 0, bX: '50%', bY: '80%' });
    };

    const mainImage = product.images?.[0];

    return (
        <div className="group perspective-1000">
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => onClick(product)}
                className="relative cursor-pointer transition-transform duration-500 ease-out"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: isActive ? 'none' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
            >
                <div
                    className={`relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-200 shadow-sm transition-all duration-500 ${isActive ? 'shadow-2xl' : 'shadow-md'}`}
                    style={{
                        backgroundImage: mainImage ? `linear-gradient(hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0.1)), url(${mainImage})` : 'none',
                        backgroundPosition: `${tilt.bX} ${tilt.bY}`,
                        backgroundSize: '140% auto',
                        transform: 'translateZ(20px)'
                    }}
                >
                    {!mainImage && (
                        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                            <ShoppingBag className="w-12 h-12" />
                        </div>
                    )}

                    {/* Overlay Border Effect */}
                    <div className="absolute inset-4 border border-white/30 rounded-2xl pointer-events-none transition-all duration-500 group-hover:inset-3 group-hover:border-white/50" />

                    {/* Product Tags */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2" style={{ transform: 'translateZ(40px)' }}>
                        {product.featured && (
                            <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none px-3 py-1 text-[10px] tracking-widest font-black rounded-full shadow-lg">
                                VEDETTE
                            </Badge>
                        )}
                        {parseFloat(product.compareAtPrice || '0') > parseFloat(product.price) && (
                            <Badge className="bg-red-500/90 backdrop-blur-md text-white border-none px-3 py-1 text-[10px] tracking-widest font-black rounded-full shadow-lg">
                                PROMO
                            </Badge>
                        )}
                    </div>

                    {/* Hover Quick Action */}
                    <div
                        className="absolute bottom-6 left-0 right-0 px-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                        style={{ transform: 'translateZ(60px)' }}
                    >
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product);
                            }}
                            disabled={product.stock === 0}
                            className="w-full h-12 rounded-2xl bg-white text-slate-900 hover:bg-slate-900 hover:text-white border-none shadow-xl font-bold flex items-center justify-center gap-2"
                        >
                            {product.stock === 0 ? 'Rupture' : (
                                <>
                                    <ShoppingCart className="w-4 h-4" />
                                    Ajouter au Panier
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Product Info below the tilt container for readability? No, the user wants the card itself to look like the theme. 
            The theme has text inside but for an e-commerce grid, maybe better to keep basic info visible under. 
            Wait, I'll put it inside but elevated for better effect. */}
                <div
                    className="mt-6 px-2 transition-all duration-500 group-hover:translate-y-1"
                    style={{ transform: 'translateZ(30px)' }}
                >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">
                        {categoryName}
                    </p>
                    <h3 className="text-lg font-serif text-slate-800 mb-2 truncate group-hover:text-amber-700 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-slate-900">
                            {parseFloat(product.price).toFixed(2)}€
                        </span>
                        {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                            <span className="text-sm text-slate-400 line-through">
                                {parseFloat(product.compareAtPrice).toFixed(2)}€
                            </span>
                        )}
                        {product.stock > 0 && product.stock <= (product.lowStockThreshold || 5) && (
                            <span className="ml-auto text-[10px] font-bold text-red-500 uppercase">
                                Plus que {product.stock} !
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
