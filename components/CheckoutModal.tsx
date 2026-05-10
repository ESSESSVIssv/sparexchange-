import React, { useState, useMemo, FormEvent } from 'react';
import { Product, Currency, convertCurrency } from '../types';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: Product[];
    onConfirmOrder: (orderDetails: { id: string; items: Product[]; total: number; currency: Currency; }) => void;
    displayCurrency: Currency;
}

const formatCurrency = (price: number, currency: string) => {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(price);
    } catch (e) {
        return `${currency} ${price.toFixed(2)}`;
    }
};

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, onConfirmOrder, displayCurrency }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const orderId = useMemo(() => `SX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, [isOpen]); // Re-generate on open

    const totalInDisplayCurrency = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const convertedPrice = convertCurrency(item.price, item.currency, displayCurrency);
            return acc + convertedPrice;
        }, 0);
    }, [cartItems, displayCurrency]);
    
    const depositInDisplayCurrency = totalInDisplayCurrency / 2;

    const handlePaymentSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsConfirmed(true);
    };

    const handleFinish = () => {
        onConfirmOrder({
            id: orderId,
            items: cartItems,
            total: totalInDisplayCurrency,
            currency: displayCurrency,
        });
    };

    if (!isOpen) return null;

    if (isConfirmed) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-md text-center p-8 transform transition-all animate-fade-in-scale">
                    <CheckCircleIcon />
                    <h2 className="text-2xl font-bold text-slate-800 mt-4">Order Confirmed!</h2>
                    <p className="text-slate-600 mt-2">Thank you for your purchase.</p>
                    <p className="text-sm text-slate-500 mt-4">Your order ID is <span className="font-mono bg-slate-100 p-1 rounded">{orderId}</span>.</p>
                     <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 p-4 rounded-r-lg mt-6 text-left" role="alert">
                        <p className="font-bold">What's Next?</p>
                        <p className="text-sm">You've paid the 50% deposit. The remaining balance is due upon delivery of your items. You can track your order status in the "My Orders" section.</p>
                    </div>
                    <button onClick={handleFinish} className="mt-8 w-full px-4 py-3 bg-indigo-600 border border-transparent rounded-md shadow-sm text-lg font-medium text-white hover:bg-indigo-700">
                        Continue Shopping
                    </button>
                </div>
                <style>{`
                    @keyframes fade-in-scale {
                        to { transform: scale(1); opacity: 1; }
                    }
                    .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards; transform: scale(0.95); opacity: 0; }
                `}</style>
            </div>
        );
    }

    const upiString = `upi://pay?pa=seller@sparexchange&pn=SpareXchange Seller&am=${depositInDisplayCurrency.toFixed(2)}&cu=${displayCurrency}&tn=Order-${orderId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handlePaymentSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                             <h2 className="text-2xl font-bold text-slate-800">Checkout</h2>
                             <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-lg font-semibold text-slate-700 mb-4">Order Summary</h3>
                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <p className="text-slate-600 truncate flex-1 pr-4">{item.name}</p>
                                        <p className="font-medium text-slate-800">{formatCurrency(convertCurrency(item.price, item.currency, displayCurrency), displayCurrency)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-4">
                             <h3 className="text-lg font-semibold text-slate-700 mb-4">Scan to Pay</h3>
                             <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border">
                                <img
                                    src={qrCodeUrl}
                                    alt="Payment QR Code"
                                    className="w-48 h-48 md:w-56 md:h-56 rounded-lg shadow-md bg-white"
                                />
                                <p className="mt-4 text-sm text-slate-600 text-center">
                                    Scan the QR code with your UPI-enabled payment app.
                                </p>
                                <p className="mt-1 text-xs text-slate-500 text-center">
                                    (e.g., Google Pay, PhonePe, Paytm)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-4">
                        <div className="space-y-2 mb-4 p-4 bg-white rounded-lg border">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Total Amount ({displayCurrency})</span>
                                <span>{formatCurrency(totalInDisplayCurrency, displayCurrency)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-indigo-700">
                                <span>Deposit (50%) to Pay Now</span>
                                <span>{formatCurrency(depositInDisplayCurrency, displayCurrency)}</span>
                            </div>
                            <p className="text-xs text-slate-500 pt-2 border-t mt-2">The remaining {formatCurrency(depositInDisplayCurrency, displayCurrency)} is due upon delivery.</p>
                        </div>
                        <button type="submit" className="w-full mt-2 px-4 py-3 bg-indigo-600 border border-transparent rounded-md shadow-sm text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                           I Have Completed The Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};