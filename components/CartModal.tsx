import React from 'react';
import { Product, Currency, convertCurrency } from '../types';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: Product[];
    onRemoveItem: (productId: number) => void;
    onCheckout: () => void;
    displayCurrency: Currency;
}

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

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onCheckout, displayCurrency }) => {
    
    const totalInDisplayCurrency = cartItems.reduce((acc, item) => {
        const convertedPrice = convertCurrency(item.price, item.currency, displayCurrency);
        return acc + convertedPrice;
    }, 0);

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
                    <h2 className="text-2xl font-bold text-slate-800">Your Cart</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-semibold text-slate-600">Your cart is empty</h3>
                            <p className="text-slate-500 mt-2">Add items to see them here.</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-4">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://picsum.photos/seed/${item.id}/200/200`;
                                    }}
                                    className="w-20 h-20 object-cover rounded-md" 
                                />
                                <div className="flex-grow">
                                    <p className="font-bold text-slate-800">{item.name}</p>
                                    <p className="text-sm text-slate-600">{formatCurrency(convertCurrency(item.price, item.currency, displayCurrency), displayCurrency)}</p>
                                </div>
                                <button onClick={() => onRemoveItem(item.id)} className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors" aria-label={`Remove ${item.name}`}>
                                    <TrashIcon />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t bg-slate-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-slate-700">Subtotal</span>
                        <span className="text-2xl font-extrabold text-indigo-600">{formatCurrency(totalInDisplayCurrency, displayCurrency)}</span>
                    </div>
                    <button
                        onClick={onCheckout}
                        disabled={cartItems.length === 0}
                        className="w-full px-4 py-3 bg-indigo-600 border border-transparent rounded-md shadow-sm text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};