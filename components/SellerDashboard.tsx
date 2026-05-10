import React from 'react';
import { Product } from '../types';

interface SellerDashboardProps {
    products: Product[];
    onAddNewItem: () => void;
    onEditItem: (product: Product) => void;
    onDeleteItem: (productId: number) => void;
}

const PlusCircleIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const TrashIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ products, onAddNewItem, onEditItem, onDeleteItem }) => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Your Listings</h2>
                    <p className="text-slate-500">You have {products.length} item(s) for sale.</p>
                </div>
                 <button
                    onClick={onAddNewItem}
                    className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 w-full md:w-auto"
                >
                    <PlusCircleIcon />
                    <span>Add New Item</span>
                </button>
            </div>

            {products.length === 0 ? (
                 <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-600">You haven't listed any items yet.</h3>
                    <p className="text-slate-500 mt-2">Click 'Add New Item' to get started!</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <ul role="list" className="divide-y divide-slate-200">
                        {products.map((product) => (
                        <li key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 hover:bg-slate-50 transition-colors">
                            <img 
                                className="w-full sm:w-24 h-24 flex-shrink-0 rounded-md object-cover" 
                                src={product.imageUrl} 
                                alt={product.name} 
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://picsum.photos/seed/${product.id}/200/200`;
                                }}
                            />
                            <div className="flex-auto">
                                <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                            </div>
                            <div className="flex items-center justify-between w-full sm:w-auto">
                                <div className="flex flex-col items-start sm:items-end flex-shrink-0">
                                    <p className="text-lg font-bold text-indigo-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.price)}</p>
                                    <span className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${product.condition === 'New' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                        {product.condition}
                                    </span>
                                </div>
                                <div className="sm:ml-6 flex items-center space-x-1">
                                    <button onClick={() => onEditItem(product)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors" aria-label={`Edit ${product.name}`}>
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => onDeleteItem(product.id)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors" aria-label={`Delete ${product.name}`}>
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
