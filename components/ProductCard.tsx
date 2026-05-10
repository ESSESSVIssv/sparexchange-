import React from 'react';
import { Product, Condition, Currency, convertCurrency } from '../types';
import { StarRating } from './StarRating';

interface ProductCardProps {
    product: Product;
    onViewItem: (product: Product) => void;
    displayCurrency: Currency;
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

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewItem, displayCurrency }) => {
    const conditionBadgeClass = product.condition === Condition.NEW
        ? 'bg-emerald-500 text-white'
        : 'bg-amber-500 text-white';

    const reviews = product.reviews || [];
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;
        
    const convertedPrice = convertCurrency(product.price, product.currency, displayCurrency);

    const isVerified = product.imageUrl.includes('unsplash.com');

    return (
        <div 
            className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
            onClick={() => onViewItem(product)}
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/seed/${product.id}/400/300`;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${conditionBadgeClass}`}>
                        {product.condition}
                    </span>
                    {isVerified && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm bg-indigo-600 text-white flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                        </span>
                    )}
                </div>
                <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm text-[8px] font-bold px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 uppercase tracking-tighter z-10">
                    Genuine Part
                </div>
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-1">
                        {product.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mb-2">
                        {product.description.includes('SKU: ') ? `SKU: ${product.description.split('SKU: ')[1]}` : `SKU: PART-${product.id}`}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                        <StarRating rating={averageRating} size="sm" />
                        <span className="text-[10px] text-slate-400 font-medium">({reviews.length})</span>
                    </div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5">Price</p>
                        <p className="text-lg font-bold text-slate-900">
                            {formatCurrency(convertedPrice, displayCurrency)}
                        </p>
                    </div>
                    <div className="p-2 bg-slate-900 text-white rounded-lg group-hover:bg-indigo-600 transition-all duration-200 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
