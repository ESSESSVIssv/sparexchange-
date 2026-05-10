import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Truck, MapPin, Package, Clock } from 'lucide-react';
import { Product, Address } from '../types';

interface ShippingPageProps {
    cartItems: Product[];
    onConfirmShipping: (address: Address) => void;
}

const formatAddress = (address: Address) => {
    return `${address.city}, ${address.state}, ${address.country}`;
};

export const ShippingPage: React.FC<ShippingPageProps> = ({ cartItems, onConfirmShipping }) => {
    const [address, setAddress] = useState<Address>({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'USA'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onConfirmShipping(address);
    };
    
    // For simulation, we'll use the first item's seller location.
    const sellerLocation = cartItems.length > 0 ? cartItems[0].sellerLocation : null;

    return (
        <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto p-4 md:p-8"
        >
            <div className="bg-bg-darker glass-panel border border-white/10 p-6 md:p-10 rounded-3xl shadow-xl max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                        <Truck size={24} className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }} />
                    </div>
                    <h2 className="text-3xl font-bold text-white font-display">Shipping & Delivery</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Side: Info */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Package size={18} className="text-text-muted" />
                                Order Journey
                            </h3>
                            
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                                
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-darker border border-brand-primary text-brand-primary shadow-[0_0_15px_rgba(255,107,0,0.2)] shrink-0" style={{ color: 'var(--color-brand-primary)', borderColor: 'var(--color-brand-primary)' }}>
                                        <MapPin size={16} />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] p-4 rounded-xl border border-white/5 bg-white/5">
                                        <p className="font-bold text-white mb-1">Ships From</p>
                                        {sellerLocation ? (
                                            <p className="text-sm text-text-secondary">{formatAddress(sellerLocation)}</p>
                                        ) : (
                                            <p className="text-sm text-text-secondary">Premium Fulfillment Center</p>
                                        )}
                                    </div>
                                </div>

                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-dark border border-white/20 text-white shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] p-4 rounded-xl border border-white/5 bg-white/5">
                                        <p className="font-bold text-white mb-1">Estimated Arrival</p>
                                        <p className="text-sm text-text-secondary">Arrives in 5-7 business days</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {cartItems.length > 1 && (
                            <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-4 text-sm text-brand-primary" style={{ color: 'var(--color-brand-primary)' }}>
                                Note: Items from multiple premium sellers may ship separately.
                            </div>
                        )}
                    </div>

                    {/* Right Side: Form */}
                    <div className="bg-bg-dark border border-white/10 rounded-2xl p-6 lg:p-8">
                        <h3 className="text-xl font-bold text-white mb-6 font-display">Shipping Destination</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="street" className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Street Address</label>
                                <input 
                                    type="text" 
                                    name="street" 
                                    id="street" 
                                    value={address.street} 
                                    onChange={handleInputChange} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors" 
                                    placeholder="123 Sector 7G"
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="city" className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-2">City</label>
                                <input 
                                    type="text" 
                                    name="city" 
                                    id="city" 
                                    value={address.city} 
                                    onChange={handleInputChange} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors" 
                                    placeholder="Neo Tokyo"
                                    required 
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="state" className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-2">State / Region</label>
                                    <input 
                                        type="text" 
                                        name="state" 
                                        id="state" 
                                        value={address.state} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors" 
                                        placeholder="NT"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="zip" className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Postal Code</label>
                                    <input 
                                        type="text" 
                                        name="zip" 
                                        id="zip" 
                                        value={address.zip} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors" 
                                        placeholder="100-0001"
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="country" className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Country</label>
                                <select 
                                    id="country" 
                                    name="country" 
                                    value={address.country} 
                                    onChange={handleInputChange} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors appearance-none"
                                >
                                    <option value="USA" className="bg-bg-dark text-white">USA</option>
                                    <option value="Canada" className="bg-bg-dark text-white">Canada</option>
                                    <option value="UK" className="bg-bg-dark text-white">UK</option>
                                    <option value="Germany" className="bg-bg-dark text-white">Germany</option>
                                    <option value="Japan" className="bg-bg-dark text-white">Japan</option>
                                    <option value="India" className="bg-bg-dark text-white">India</option>
                                </select>
                            </div>
                            
                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    className="w-full px-4 py-4 bg-brand-primary border border-transparent rounded-full shadow-[0_0_20px_rgba(255,107,0,0.3)] text-lg font-bold text-white hover:bg-opacity-90 hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] focus:outline-none transition-all glow-orange"
                                    style={{ backgroundColor: 'var(--color-brand-primary)' }}
                                >
                                    Proceed to Secure Checkout
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </motion.main>
    );
};