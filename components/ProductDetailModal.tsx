import React, { useState, FormEvent } from 'react';
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

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const HeartIconOutline = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

const HeartIconSolid = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const VisaIcon = () => ( <svg className="h-8 w-auto rounded overflow-hidden" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.3 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.7 0 35 0Z" fill="#282828" /><path fillRule="evenodd" clipRule="evenodd" d="M11.6 20.1L6.3 3.9H9.3L14.6 20.1H11.6ZM22.2 3.9L19.4 13.4L16.6 3.9H13.5L18 20.1H21L25.5 3.9H22.2ZM31.2 12.3C31.2 7.1 27.9 3.9 23.3 3.9H17.4L14.6 20.1H18.2L19.2 15.3H21.5C23.9 15.3 25.8 14.3 26.6 12.3H31.2V12.3ZM21.5 12.3H19.7L20.4 7.9H21.5C22.6 7.9 23.3 8.6 23.3 9.9C23.3 11.2 22.6 12.3 21.5 12.3Z" fill="white"/></svg> );
const MastercardIcon = () => ( <svg className="h-8 w-auto rounded overflow-hidden" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.3 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.7 0 35 0Z" fill="#282828" /><circle cx="15" cy="12" r="7" fill="#EB001B" /><circle cx="23" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8" /></svg> );
const PayPalIcon = () => ( <svg className="h-8 w-auto rounded overflow-hidden" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.3 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.7 0 35 0Z" fill="#003087" /><path d="M24.4 8.7c-.1-1.2-1.2-2.1-2.8-2.1h-4.2c-1.6 0-2.7.9-2.8 2.1L13.2 18c0 .3.2.5.5.5h2.2c.3 0 .4-.2.5-.5l.4-2.4c.1-.5.5-.8 1-.8h1.9c1.3 0 2 .7 1.8 1.9l-.5 3c-.1.3.1.5.4.5h2.1c.3 0 .5-.2.6-.5l2-11.5z" fill="#009CDE" /><path d="M23.1 8.7c-.1-1.2-1.2-2.1-2.8-2.1h-4.2c-1.6 0-2.7.9-2.8 2.1l-1 5.9c0 .3.2.5.5.5h2.2c.3 0 .4-.2.5-.5l.4-2.4c.1-.5.5-.8 1-.8h1.9c1.3 0 2 .7 1.8 1.9l-.5 3c-.1.3.1.5.4.5h2.1c.3 0 .5-.2.6-.5l1.3-7.6z" fill="#002169" /></svg> );

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, onAddReview, onStartChat, displayCurrency, isInWishlist, onToggleWishlist }) => {
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [activeImage, setActiveImage] = useState(product.imageUrl);

    const conditionBadgeClass = product.condition === Condition.NEW ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white';
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
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-auto flex flex-col transition-all transform scale-95 opacity-0 animate-fade-in-scale overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Product Details</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors text-2xl"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Image Gallery Section */}
                        <div className="lg:col-span-7 p-6 lg:p-8 bg-slate-50/50 border-r border-slate-100">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200 mb-6">
                                <img 
                                    src={activeImage} 
                                    alt={product.name} 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://picsum.photos/seed/${product.id}/800/600`;
                                    }}
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {allImages.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setActiveImage(img)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImage === img ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-white hover:border-slate-200 shadow-sm'}`}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`${product.name} thumbnail ${idx + 1}`} 
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://picsum.photos/seed/${product.id + idx}/200/200`;
                                            }}
                                            className="w-full h-full object-cover" 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <StarRating rating={averageRating} size="sm" />
                                        <span className="text-sm font-bold text-slate-900">{averageRating.toFixed(1)}</span>
                                        <span className="text-sm text-slate-400 font-medium">({reviews.length} reviews)</span>
                                     </div>
                                     <div className="flex items-center gap-2">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${conditionBadgeClass}`}>
                                            {product.condition}
                                        </span>
                                        {product.imageUrl.includes('unsplash.com') && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-600 text-white shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Verified Part
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onToggleWishlist(product)}
                                    className={`p-3 rounded-xl border transition-all duration-200 ${isInWishlist ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100'}`}
                                >
                                    {isInWishlist ? <HeartIconSolid /> : <HeartIconOutline />}
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h4>
                                    <p className="text-slate-600 leading-relaxed text-sm">{product.description.split(' SKU: ')[0]}</p>
                                </div>

                                {/* Specifications Section */}
                                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Technical Specifications</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">SKU</p>
                                            <p className="text-xs font-mono text-slate-700 truncate">{product.description.includes('SKU: ') ? product.description.split('SKU: ')[1] : `PART-${product.id}`}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Compatibility</p>
                                            <p className="text-xs text-slate-700">{product.name.split(' ')[0]} Models</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Material</p>
                                            <p className="text-xs text-slate-700">OEM Grade</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Warranty</p>
                                            <p className="text-xs text-slate-700">12 Months</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Seller Information</h4>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {product.sellerId === 'currentUser' ? 'ME' : 'S'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{product.sellerId === 'currentUser' ? 'You (Seller)' : 'Verified Seller'}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <PhoneIcon />
                                                <span>{product.sellerPhoneNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onStartChat(product)} 
                                        className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <MessageIcon />
                                        Message Seller
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex items-end justify-between mb-6">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Price</p>
                                            <p className="text-3xl font-black text-slate-900">{formatCurrency(convertedPrice, displayCurrency)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Secure Payment</p>
                                            <div className="flex gap-2">
                                                <VisaIcon />
                                                <MastercardIcon />
                                                <PayPalIcon />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-indigo-600 rounded-2xl p-4 text-white mb-6 shadow-lg shadow-indigo-200">
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Payment Plan</p>
                                        <p className="text-sm font-medium">Pay 50% now, 50% on delivery.</p>
                                    </div>

                                    <button 
                                        onClick={() => onAddToCart(product)} 
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-lg font-bold hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200 active:scale-[0.98]"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Reviews Section */}
                    <div className="p-6 lg:p-10 border-t border-slate-100 bg-slate-50/30">
                        <div className="max-w-3xl mx-auto">
                            <h4 className="text-2xl font-black text-slate-900 mb-8">Customer Reviews</h4>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10">
                                <h5 className="text-sm font-bold text-slate-900 mb-4">Write a Review</h5>
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Rating</span>
                                        <StarRating rating={newRating} onRatingChange={setNewRating} interactive />
                                    </div>
                                    <textarea 
                                        value={newComment} 
                                        onChange={(e) => setNewComment(e.target.value)} 
                                        rows={3} 
                                        placeholder="What did you think of this part?" 
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                        required
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <button 
                                            type="submit" 
                                            className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:bg-slate-200 disabled:text-slate-400"
                                            disabled={newRating === 0 || !newComment.trim()}
                                        >
                                            Post Review
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="space-y-8">
                                {reviews.length > 0 ? (
                                    reviews.map(review => (
                                        <div key={review.id} className="group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                        {review.author[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{review.author}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                <StarRating rating={review.rating} size="sm" />
                                            </div>
                                            <p className="text-sm text-slate-600 pl-11 leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-sm text-slate-400 font-medium italic">No reviews yet. Be the first to share your experience!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};
