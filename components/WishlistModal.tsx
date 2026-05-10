import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product, Currency, convertCurrency } from '../types';

interface WishlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    wishlistItems: Product[];
    onRemoveItem: (productId: number) => void;
    onViewItem: (product: Product) => void;
    onMoveToCart: (product: Product) => void;
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

export const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose, wishlistItems, onRemoveItem, onViewItem, onMoveToCart, displayCurrency }) => {
    const handleViewAndClose = (product: Product) => {
        onClose();
        onViewItem(product);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-bg-darker/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 h-full w-full max-w-md bg-bg-dark shadow-2xl flex flex-col border-l border-white/5"
                    >
                        <div className="p-6 flex justify-between items-center border-b border-white/10 glass-nav">
                            <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                                <Heart size={24} className="text-rose-500 fill-rose-500/20" />
                                Your Wishlist
                            </h2>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {wishlistItems.length === 0 ? (
                                <div className="text-center py-16 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                                        <Heart size={32} className="text-text-muted" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 font-display">Your wishlist is empty</h3>
                                    <p className="text-text-muted">Save your favorite parts and view them here anytime.</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {wishlistItems.map(item => (
                                        <motion.div 
                                            key={item.id} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                            className="flex items-start space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors"
                                        >
                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-bg-darker border border-white/10 shrink-0">
                                                <img 
                                                    src={item.imageUrl} 
                                                    alt={item.name} 
                                                    referrerPolicy="no-referrer"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = `https://picsum.photos/seed/${item.id}/200/200`;
                                                    }}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                />
                                            </div>
                                            <div className="flex-grow min-w-0 pt-1">
                                                <p className="font-bold text-white truncate text-lg pr-8">{item.name}</p>
                                                <p className="text-sm text-text-secondary mt-1 font-mono">{formatCurrency(convertCurrency(item.price, item.currency, displayCurrency), displayCurrency)}</p>
                                                
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <button 
                                                        onClick={() => onMoveToCart(item)} 
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-bold hover:bg-brand-primary hover:text-white transition-colors"
                                                        style={{ color: 'var(--color-brand-primary)' }}
                                                    >
                                                        <ShoppingBag size={14} />
                                                        Add to Cart
                                                    </button>
                                                    <button 
                                                        onClick={() => handleViewAndClose(item)} 
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white rounded-lg text-xs font-semibold hover:bg-white/10 transition-colors"
                                                    >
                                                        <Eye size={14} />
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => onRemoveItem(item.id)} 
                                                className="absolute top-4 right-4 text-text-muted hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-colors backdrop-blur-md" 
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};