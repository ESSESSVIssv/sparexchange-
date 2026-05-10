import React from 'react';
import { motion } from 'motion/react';
import { ProductCard } from './ProductCard';
import { Product, Currency } from '../types';

interface ProductListProps {
    products: Product[];
    onViewItem: (product: Product) => void;
    displayCurrency: Currency;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

export const ProductList: React.FC<ProductListProps> = ({ products, onViewItem, displayCurrency }) => {
    if (products.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 px-4"
            >
                <div className="glass-panel inline-block p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-2 font-display">No products found</h2>
                    <p className="text-text-secondary">Try adjusting your search or filter settings.</p>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6"
        >
            {products.map(product => (
                <ProductCard key={product.id} product={product} onViewItem={onViewItem} displayCurrency={displayCurrency} />
            ))}
        </motion.div>
    );
};
