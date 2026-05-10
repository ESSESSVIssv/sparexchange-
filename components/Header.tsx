import React from 'react';
import { motion } from 'motion/react';
import { Store, ShoppingCart, Heart, MessageSquare, Package, Plus } from 'lucide-react';

interface HeaderProps {
    onSellClick: () => void;
    cartItemCount: number;
    onCartClick: () => void;
    wishlistItemCount: number;
    onWishlistClick: () => void;
    role: 'buyer' | 'seller';
    onChatClick: () => void;
    chatCount: number;
    onOrdersClick: () => void;
    onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    onSellClick, 
    cartItemCount, 
    onCartClick, 
    wishlistItemCount, 
    onWishlistClick, 
    role, 
    onChatClick, 
    chatCount, 
    onOrdersClick, 
    onNavigateHome 
}) => {
    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="sticky top-0 z-50 px-4 py-4 md:px-8"
        >
            <div className="container mx-auto glass-panel rounded-2xl px-6 py-4 flex justify-between items-center shadow-2xl">
                <div 
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={onNavigateHome}
                >
                    <motion.div 
                        whileHover={{ rotate: 15 }}
                        className="bg-brand-primary/20 p-2 rounded-xl text-brand-primary"
                        style={{ color: 'var(--color-brand-primary)', backgroundColor: 'rgba(255, 107, 0, 0.1)' }}
                    >
                        <Store size={28} />
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gradient font-display">
                        SpareXchange
                        {role === 'seller' && <span className="text-sm font-medium text-brand-primary ml-3" style={{ color: 'var(--color-brand-primary)' }}>Seller Dashboard</span>}
                    </h1>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onChatClick}
                        className="relative text-text-secondary hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                        aria-label={`View chats with ${chatCount} conversations`}
                    >
                        <MessageSquare size={24} />
                        {chatCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white transform translate-x-1/4 -translate-y-1/4" style={{ backgroundColor: 'var(--color-brand-primary)' }}>
                                {chatCount}
                            </span>
                        )}
                    </motion.button>
                   {role === 'buyer' && (
                       <>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onOrdersClick}
                            className="relative text-text-secondary hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                            aria-label="View your orders"
                        >
                            <Package size={24} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onWishlistClick}
                            className="relative text-text-secondary hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                            aria-label={`View wishlist with ${wishlistItemCount} items`}
                        >
                            <Heart size={24} />
                            {wishlistItemCount > 0 && (
                                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white transform translate-x-1/4 -translate-y-1/4" style={{ backgroundColor: 'var(--color-brand-primary)' }}>
                                    {wishlistItemCount}
                                </span>
                            )}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onCartClick}
                            className="relative text-text-secondary hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                            aria-label={`View cart with ${cartItemCount} items`}
                        >
                            <ShoppingCart size={24} />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white transform translate-x-1/4 -translate-y-1/4" style={{ backgroundColor: 'var(--color-brand-primary)' }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </motion.button>
                       </>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onSellClick}
                        className="bg-brand-primary text-white font-semibold px-5 py-2.5 rounded-full shadow-lg transition-all glow-orange flex items-center gap-2"
                        style={{ backgroundColor: 'var(--color-brand-primary)' }}
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">{role === 'buyer' ? 'Sell Your Item' : 'Add New Item'}</span>
                    </motion.button>
                </div>
            </div>
        </motion.header>
    );
};