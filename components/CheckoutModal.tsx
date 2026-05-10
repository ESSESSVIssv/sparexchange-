import React, { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldCheck, X } from 'lucide-react';
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
        setIsConfirmed(false);
    };

    if (!isOpen) return null;

    const upiString = `upi://pay?pa=seller@sparexchange&pn=SpareXchange Seller&am=${depositInDisplayCurrency.toFixed(2)}&cu=${displayCurrency}&tn=Order-${orderId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}&bgcolor=FFFFFF&color=000000`;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-bg-darker/90 backdrop-blur-md"
                    onClick={onClose}
                />
                
                {isConfirmed ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative w-full max-w-md bg-bg-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden glass-panel flex flex-col items-center text-center p-8 z-10"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        >
                            <CheckCircle2 size={80} className="text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-2 font-display">Order Confirmed!</h2>
                        <p className="text-text-secondary mb-6">Thank you for your premium purchase.</p>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 w-full backdrop-blur-sm">
                            <p className="text-sm text-text-muted mb-1 uppercase tracking-widest font-bold">Order ID</p>
                            <p className="font-mono text-xl text-white tracking-widest">{orderId}</p>
                        </div>
                        
                        <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-r-xl rounded-l-sm w-full text-left mb-8">
                            <p className="font-bold text-emerald-400 mb-1 flex items-center gap-2">
                                <ShieldCheck size={18} />
                                Secure Escrow Active
                            </p>
                            <p className="text-sm text-emerald-300/80 leading-relaxed">
                                You've paid the 50% deposit. The remaining balance is secured and only due upon verified delivery of your items.
                            </p>
                        </div>

                        <button 
                            onClick={handleFinish} 
                            className="w-full px-4 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full font-bold text-white transition-all backdrop-blur-md"
                        >
                            View Order Dashboard
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-bg-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden glass-panel z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center glass-nav sticky top-0 z-20">
                            <div>
                                <h2 className="text-2xl font-bold text-white font-display">Secure Checkout</h2>
                                <p className="text-sm text-emerald-400 flex items-center gap-1.5 mt-1">
                                    <ShieldCheck size={14} /> AI-Secured Transaction
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handlePaymentSubmit}>
                            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Order Summary</h3>
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex gap-4 items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium truncate">{item.name}</p>
                                                    <p className="text-sm text-text-secondary font-mono mt-1">{formatCurrency(convertCurrency(item.price, item.currency, displayCurrency), displayCurrency)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 p-5 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                                        <div className="flex justify-between text-sm text-text-muted">
                                            <span>Subtotal ({displayCurrency})</span>
                                            <span className="font-mono">{formatCurrency(totalInDisplayCurrency, displayCurrency)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-white/10">
                                            <span>Deposit Required (50%)</span>
                                            <span className="font-mono text-brand-primary">{formatCurrency(depositInDisplayCurrency, displayCurrency)}</span>
                                        </div>
                                        <p className="text-xs text-text-muted/60 mt-2 text-center">Remaining 50% due on delivery.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Payment securely via App</h3>
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/10 backdrop-blur-md">
                                        <div className="p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] relative group">
                                            <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                            <img
                                                src={qrCodeUrl}
                                                alt="Payment QR Code"
                                                className="w-48 h-48 rounded-xl block relative z-10"
                                            />
                                        </div>
                                        <p className="mt-6 text-sm text-text-secondary text-center leading-relaxed">
                                            Scan using your favorite payment app to securely authorize the deposit.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 bg-bg-darker/50">
                                <button type="submit" className="w-full px-4 py-4 bg-brand-primary border border-transparent rounded-full shadow-[0_0_20px_rgba(255,107,0,0.3)] text-lg font-bold text-white hover:bg-opacity-90 hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] focus:outline-none transition-all glow-orange" style={{ backgroundColor: 'var(--color-brand-primary)' }}>
                                    I Have Completed The Payment
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    );
};