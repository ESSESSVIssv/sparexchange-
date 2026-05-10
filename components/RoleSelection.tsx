import React from 'react';

interface RoleSelectionProps {
    onSelectRole: (role: 'buyer' | 'seller') => void;
}

const BuyerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const SellerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 11V3m0 8h.01M12 21h.01M4 4h.01M4 12h.01M4 20h.01M12 4h.01M20 4h.01M20 12h.01M20 20h.01M12 12l-4-4m4 4l4-4m-4 4v4m0 0l-4 4m4-4l4 4" />
         <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);


export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-4xl w-full text-center">
                 <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to SpareXchange</h1>
                 <p className="text-xl text-gray-600 mb-12">How are you joining us today?</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <button 
                        onClick={() => onSelectRole('buyer')}
                        className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-2"
                     >
                        <BuyerIcon />
                        <h2 className="text-2xl font-bold text-slate-800">I'm here to Buy</h2>
                        <p className="text-slate-600 mt-2">Browse and discover amazing products.</p>
                     </button>
                      <button 
                        onClick={() => onSelectRole('seller')}
                        className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-2"
                     >
                        <SellerIcon />
                        <h2 className="text-2xl font-bold text-slate-800">I'm here to Sell</h2>
                        <p className="text-slate-600 mt-2">List your items and reach buyers.</p>
                     </button>
                 </div>
            </div>
        </div>
    );
};
