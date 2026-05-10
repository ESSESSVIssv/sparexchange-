import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Tags } from 'lucide-react';
import { Product, Condition, Currency, convertCurrency } from '../types';
import { StarRating } from './StarRating';

interface ProductCardProps {
    product: Product;
    onViewItem: (product: Product) => void;
    displayCurrency: Currency;
}

const formatCurrency = (price: number, currency: string) => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 2,
        }).format(price);
    } catch (e) {
        return `${currency} ${price.toFixed(2)}`;
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewItem, displayCurrency }) => {
    const conditionBadgeClass = product.condition === Condition.NEW
        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30';

    const reviews = product.reviews || [];
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;
        
    const convertedPrice = convertCurrency(product.price, product.currency, displayCurrency);
    const isVerified = product.imageUrl.includes('unsplash.com');

    return (
        <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group glass-panel rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full hover:shadow-[0_0_30px_rgba(255,107,0,0.1)] transition-all duration-300 relative border border-white/5 hover:border-brand-primary/30"
            onClick={() => onViewItem(product)}
            style={{ '--color-brand-primary': '#FF6B00' } as React.CSSProperties}
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-bg-darker">
                {/* Image */}
                <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={product.imageUrl} 
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/seed/${product.id}/400/300`;
                    }}
                    className="w-full h-full object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-darkos/80 via-transparent to-transparent opacity-60 pointer-events-none" />

                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${conditionBadgeClass}`}>
                        {product.condition}
                    </span>
                    {isVerified && (
                        <div className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-brand-primary/20 text-brand-primary border border-brand-primary/30 backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,107,0,0.2)]" style={{ color: 'var(--color-brand-primary)' }}>
                            <ShieldCheck size={12} />
                            AI Verified
                        </div>
                    )}
                </div>
                
                <div className="absolute bottom-2 right-2 bg-white/10 backdrop-blur-md text-[10px] font-semibold px-2 py-1 rounded-md border border-white/10 text-white/80 uppercase flex items-center gap-1 z-10">
                    <Tags size={10} />
                    Genuine Part
                </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow bg-bg-dark/50">
                <div className="flex-grow">
                    <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-brand-primary transition-colors mb-1.5 font-display" style={{ '--tw-text-opacity': 1, color: 'inherit' }}>
                        {product.name}
                    </h3>
                    <p className="text-[11px] text-text-muted font-mono mb-3 tracking-wider uppercase">
                        {product.description.includes('SKU: ') ? `SKU: ${product.description.split('SKU: ')[1]}` : `SKU: PART-${product.id}`}
                    </p>
                    <div className="flex items-center gap-1.5 mb-2">
                        <StarRating rating={averageRating} size="sm" />
                        <span className="text-[11px] text-text-muted font-medium">({reviews.length} reviews)</span>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-text-muted font-medium mb-0.5 uppercase tracking-widest">Price</p>
                        <p className="text-xl font-bold text-white font-display">
                            {formatCurrency(convertedPrice, displayCurrency)}
                        </p>
                    </div>
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: -15 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:-rotate-45 transition-all duration-300 shadow-[0_0_15px_rgba(255,107,0,0)] group-hover:shadow-[0_0_15px_rgba(255,107,0,0.4)]"
                    >
                        <ArrowRight size={18} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};
