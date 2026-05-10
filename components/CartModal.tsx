import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, ShoppingCart } from 'lucide-react';
import { Product, Currency, convertCurrency } from '../types';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: Product[];
    onRemoveItem: (productId: number) => void;
    onCheckout: () => void;
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

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onCheckout, displayCurrency }) => {
    const totalInDisplayCurrency = cartItems.reduce((acc, item) => {
        const convertedPrice = convertCurrency(item.price, item.currency, displayCurrency);
        return acc + convertedPrice;
    }, 0);

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
                                <ShoppingCart size={24} className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }} />
                                Your Cart
                            </h2>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="text-center py-16 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                                        <ShoppingCart size={32} className="text-text-muted" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 font-display">Your cart is empty</h3>
                                    <p className="text-text-muted">Find premium parts and add them to your cart.</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {cartItems.map(item => (
                                        <motion.div 
                                            key={item.id} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                            className="flex items-center space-x-4 bg-white/5 p-3 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors"
                                        >
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-bg-darker border border-white/10 shrink-0">
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
                                            <div className="flex-grow min-w-0">
                                                <p className="font-bold text-white truncate">{item.name}</p>
                                                <p className="text-sm text-text-secondary mt-1 font-mono">{formatCurrency(convertCurrency(item.price, item.currency, displayCurrency), displayCurrency)}</p>
                                            </div>
                                            <button 
                                                onClick={() => onRemoveItem(item.id)} 
                                                className="text-text-muted hover:text-red-500 p-3 rounded-full hover:bg-red-500/10 transition-colors shrink-0" 
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        <div className="p-6 border-t border-white/10 glass-panel mt-auto">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Subtotal</span>
                                <span className="text-3xl font-black text-white font-display tracking-tight">{formatCurrency(totalInDisplayCurrency, displayCurrency)}</span>
                            </div>
                            <button
                                onClick={onCheckout}
                                disabled={cartItems.length === 0}
                                className="w-full px-4 py-4 bg-brand-primary border border-transparent rounded-full shadow-[0_0_20px_rgba(255,107,0,0.3)] text-lg font-bold text-white hover:bg-opacity-90 hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] focus:outline-none transition-all glow-orange disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                                style={{ backgroundColor: 'var(--color-brand-primary)' }}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};