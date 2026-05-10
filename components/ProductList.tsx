import React from 'react';
import { ProductCard } from './ProductCard';
import { Product, Currency } from '../types';

interface ProductListProps {
    products: Product[];
    onViewItem: (product: Product) => void;
    displayCurrency: Currency;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onViewItem, displayCurrency }) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-slate-600">No products found</h2>
                <p className="text-slate-500 mt-2">Try adjusting your search or filter settings.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} onViewItem={onViewItem} displayCurrency={displayCurrency} />
            ))}
        </div>
    );
};
