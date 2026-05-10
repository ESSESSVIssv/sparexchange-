import React, { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShieldCheck, MessageSquare, Phone, Info, ShoppingCart } from 'lucide-react';
import { Product, Condition, Review, Currency, convertCurrency } from '../types';
import { StarRating } from './StarRating';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
    onAddReview: (productId: number, review: Omit<Review, 'id' | 'author' | 'date'>) => void;
    onStartChat: (product: Product) => void;
    displayCurrency: Currency;
    isInWishlist: boolean;
    onToggleWishlist: (product: Product) => void;
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

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, onAddReview, onStartChat, displayCurrency, isInWishlist, onToggleWishlist }) => {
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [activeImage, setActiveImage] = useState(product.imageUrl);

    // Reset image when a new product is opened
    useEffect(() => {
        setActiveImage(product.imageUrl);
    }, [product.imageUrl]);

    const conditionBadgeClass = product.condition === Condition.NEW ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    const reviews = product.reviews || [];
    const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    
    const convertedPrice = convertCurrency(product.price, product.currency, displayCurrency);

    const allImages = [product.imageUrl, ...(product.additionalImages || [])];

    const handleReviewSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (newRating === 0 || !newComment.trim()) {
            return;
        }
        onAddReview(product.id, { rating: newRating, comment: newComment });
        setNewRating(0);
        setNewComment('');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-bg-darkos/90 backdrop-blur-md pointer-events-none"
                />
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="glass-panel w-full max-w-6xl max-h-full overflow-y-auto rounded-3xl shadow-2xl relative border border-white/10 flex flex-col" 
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-bg-dark/50 sticky top-0 z-20 backdrop-blur-md">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white font-display">{product.name}</h2>
                            <p className="text-xs text-brand-primary font-bold uppercase tracking-wider" style={{ color: 'var(--color-brand-primary)' }}>Premium Listing</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-grow">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                            {/* Image Gallery Section */}
                            <div className="lg:col-span-7 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/5 bg-bg-darker/50">
                                <motion.div 
                                    layoutId={`img-${product.id}`}
                                    className="aspect-[4/3] rounded-2xl overflow-hidden bg-bg-darker border border-white/10 mb-6 relative group"
                                >
                                    <img 
                                        src={activeImage} 
                                        alt={product.name} 
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://picsum.photos/seed/${product.id}/800/600`;
                                        }}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-darkos/80 to-transparent opacity-60 pointer-events-none" />
                                </motion.div>
                                <div className="grid grid-cols-4 gap-4">
                                    {allImages.map((img, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => setActiveImage(img)}
                                            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 border ${
                                                activeImage === img 
                                                ? 'border-brand-primary shadow-[0_0_15px_rgba(255,107,0,0.3)]' 
                                                : 'border-white/10 hover:border-white/30'
                                            }`}
                                            style={activeImage === img ? { borderColor: 'var(--color-brand-primary)' } : {}}
                                        >
                                            <img 
                                                src={img} 
                                                alt={`${product.name} thumbnail ${idx + 1}`} 
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = `https://picsum.photos/seed/${product.id + idx}/200/200`;
                                                }}
                                                className={`w-full h-full object-cover transition-opacity duration-300 ${activeImage === img ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col bg-bg-dark/30">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <StarRating rating={averageRating} size="sm" />
                                            <span className="text-sm font-bold text-white">{averageRating.toFixed(1)}</span>
                                            <span className="text-sm text-text-muted font-medium">({reviews.length} reviews)</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${conditionBadgeClass}`}>
                                                {product.condition}
                                            </span>
                                            {product.imageUrl.includes('unsplash.com') && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-brand-primary/20 text-brand-primary border border-brand-primary/30 backdrop-blur-md shadow-[0_0_10px_rgba(255,107,0,0.2)]" style={{ color: 'var(--color-brand-primary)' }}>
                                                    <ShieldCheck size={12} />
                                                    AI Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => onToggleWishlist(product)}
                                        className={`p-3 rounded-full border transition-all duration-300 ${
                                            isInWishlist 
                                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' 
                                            : 'bg-white/5 border-white/10 text-white hover:text-rose-500 hover:border-rose-500/50 hover:bg-rose-500/10'
                                        }`}
                                    >
                                        <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
                                    </motion.button>
                                </div>

                                <div className="space-y-8 flex-grow">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
                                            <Info size={14} /> Description
                                        </h4>
                                        <p className="text-text-secondary leading-relaxed text-sm font-light">
                                            {product.description.split(' SKU: ')[0]}
                                        </p>
                                    </div>

                                    {/* Specifications Section */}
                                    <div className="bg-bg-darker/50 p-5 rounded-2xl border border-white/5">
                                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Technical Specifications</h4>
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                            <div>
                                                <p className="text-[9px] text-text-muted font-bold uppercase mb-1 drop-shadow-sm">SKU</p>
                                                <p className="text-xs font-mono text-white truncate">{product.description.includes('SKU: ') ? product.description.split('SKU: ')[1] : `PART-${product.id}`}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-text-muted font-bold uppercase mb-1 drop-shadow-sm">Compatibility</p>
                                                <p className="text-xs text-white">{product.name.split(' ')[0]} Models</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-text-muted font-bold uppercase mb-1 drop-shadow-sm">Material</p>
                                                <p className="text-xs text-white">OEM Grade</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-text-muted font-bold uppercase mb-1 drop-shadow-sm">Warranty</p>
                                                <p className="text-xs text-white">12 Months</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seller Section */}
                                    <div className="bg-bg-darker/50 rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Seller Information</h4>
                                        <div className="flex items-center gap-4 mb-5 relative z-10">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {product.sellerId === 'currentUser' ? 'ME' : 'S'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{product.sellerId === 'currentUser' ? 'You (Seller)' : 'Verified Retailer'}</p>
                                                <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
                                                    <Phone size={12} />
                                                    <span>{product.sellerPhoneNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onStartChat(product)} 
                                            className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-colors relative z-10"
                                        >
                                            <MessageSquare size={16} />
                                            Message Seller
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-white/5">
                                    <div className="flex items-end justify-between mb-6">
                                        <div>
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Total Price</p>
                                            <p className="text-4xl font-black text-white font-display tracking-tight">{formatCurrency(convertedPrice, displayCurrency)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,107,0,0.1), transparent)' }} />
                                        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1" style={{ color: 'var(--color-brand-primary)' }}>Flexible Payment</p>
                                        <p className="text-sm font-medium text-white/90">Pay 50% now, 50% on delivery.</p>
                                    </div>

                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onAddToCart(product)} 
                                        className="w-full py-4 bg-brand-primary text-white rounded-full text-lg font-bold shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] transition-all glow-orange flex justify-center items-center gap-2 relative overflow-hidden"
                                        style={{ backgroundColor: 'var(--color-brand-primary)' }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                                        <ShoppingCart size={20} />
                                        Add to Cart
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Reviews Section */}
                        <div className="p-6 lg:p-10 border-t border-white/5 bg-bg-darker/30">
                            <div className="max-w-4xl mx-auto">
                                <h4 className="text-2xl font-bold text-white mb-8 font-display">Customer Reviews</h4>
                                
                                <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 mb-10 relative overflow-hidden">
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(255,107,0,0.1)' }} />
                                    <h5 className="text-sm font-bold text-white mb-6 uppercase tracking-wider relative z-10">Write a Review</h5>
                                    <form onSubmit={handleReviewSubmit} className="space-y-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Your Rating</span>
                                            <StarRating rating={newRating} onRatingChange={setNewRating} interactive />
                                        </div>
                                        <textarea 
                                            value={newComment} 
                                            onChange={(e) => setNewComment(e.target.value)} 
                                            rows={3} 
                                            placeholder="What did you think of this premium part?" 
                                            className="w-full p-4 bg-bg-dark border border-white/10 rounded-2xl text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-white placeholder-text-muted outline-none transition-all resize-none" 
                                            style={{ '--tw-ring-color': 'var(--color-brand-primary)' } as React.CSSProperties}
                                            required
                                        />
                                        <div className="flex justify-end">
                                            <button 
                                                type="submit" 
                                                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-white/30 truncate"
                                                disabled={newRating === 0 || !newComment.trim()}
                                            >
                                                Post Review
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="space-y-6">
                                    {reviews.length > 0 ? (
                                        reviews.map(review => (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                key={review.id} 
                                                className="group bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                                            >
                                                <div className="flex items-start sm:items-center justify-between mb-4 flex-col sm:flex-row gap-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-bg-darker border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                                                            {review.author[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white/90">{review.author}</p>
                                                            <p className="text-[10px] text-text-muted font-medium mt-0.5">{new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                    <StarRating rating={review.rating} size="sm" />
                                                </div>
                                                <p className="text-sm text-text-secondary leading-relaxed pl-14">{review.comment}</p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                                            <p className="text-sm text-text-muted font-medium italic">No reviews yet. Be the first to share your experience!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
