import React from 'react';
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

const HeartIconSolid = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

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
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

            {/* Modal Panel */}
            <div
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-2xl font-bold text-slate-800">Your Wishlist</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {wishlistItems.length === 0 ? (
                        <div className="text-center py-16 flex flex-col items-center">
                            <HeartIconSolid />
                            <h3 className="text-xl font-semibold text-slate-600 mt-4">Your wishlist is empty</h3>
                            <p className="text-slate-500 mt-2">Add your favorite items to see them here.</p>
                        </div>
                    ) : (
                        wishlistItems.map(item => (
                            <div key={item.id} className="flex items-start space-x-4">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://picsum.photos/seed/${item.id}/200/200`;
                                    }}
                                    className="w-20 h-20 object-cover rounded-md flex-shrink-0" 
                                />
                                <div className="flex-grow">
                                    <p className="font-bold text-slate-800">{item.name}</p>
                                    <p className="text-sm text-slate-600">{formatCurrency(convertCurrency(item.price, item.currency, displayCurrency), displayCurrency)}</p>
                                    <div className="mt-2 flex space-x-2">
                                        <button onClick={() => handleViewAndClose(item)} className="text-xs font-semibold text-indigo-600 hover:underline">View Details</button>
                                        <span className="text-slate-300">|</span>
                                        <button onClick={() => onMoveToCart(item)} className="text-xs font-semibold text-green-600 hover:underline">Move to Cart</button>
                                    </div>
                                </div>
                                <button onClick={() => onRemoveItem(item.id)} className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors flex-shrink-0" aria-label={`Remove ${item.name}`}>
                                    <TrashIcon />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};