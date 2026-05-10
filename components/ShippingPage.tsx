import React, { useState, FormEvent } from 'react';
import { Product, Address } from '../types';

interface ShippingPageProps {
    cartItems: Product[];
    onConfirmShipping: (address: Address) => void;
}

const TruckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16h2a2 2 0 002-2V7a2 2 0 00-2-2h-3.382a1 1 0 00-.94.66L11 11" />
    </svg>
);

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
        <main className="container mx-auto p-4 md:p-8">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">Shipping & Delivery</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side: Info */}
                    <div className="space-y-6">
                         <div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Ships From</h3>
                            <div className="bg-slate-50 p-4 rounded-lg border">
                                {sellerLocation ? (
                                    <p className="text-slate-600">{formatAddress(sellerLocation)}</p>
                                ) : (
                                    <p className="text-slate-500">Location unavailable</p>
                                )}
                                {cartItems.length > 1 && <p className="text-xs text-slate-400 mt-2">Note: Items in your cart may ship from different locations.</p>}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Estimated Arrival</h3>
                            <div className="bg-slate-50 p-4 rounded-lg border flex items-center">
                                <TruckIcon />
                                <p className="text-slate-600 font-medium">Arrives in 5-7 business days</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Ship To</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="street" className="block text-sm font-medium text-slate-700">Street Address</label>
                                <input type="text" name="street" id="street" value={address.street} onChange={handleInputChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 bg-white" required />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
                                <input type="text" name="city" id="city" value={address.city} onChange={handleInputChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 bg-white" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-slate-700">State / Province</label>
                                    <input type="text" name="state" id="state" value={address.state} onChange={handleInputChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 bg-white" required />
                                </div>
                                <div>
                                    <label htmlFor="zip" className="block text-sm font-medium text-slate-700">ZIP / Postal Code</label>
                                    <input type="text" name="zip" id="zip" value={address.zip} onChange={handleInputChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 bg-white" required />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
                                <select id="country" name="country" value={address.country} onChange={handleInputChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 bg-white">
                                    <option>USA</option>
                                    <option>Canada</option>
                                    <option>UK</option>
                                    <option>Germany</option>
                                    <option>Japan</option>
                                    <option>India</option>
                                </select>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full px-4 py-3 bg-indigo-600 border border-transparent rounded-md shadow-sm text-lg font-medium text-white hover:bg-indigo-700">
                                    Proceed to Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};