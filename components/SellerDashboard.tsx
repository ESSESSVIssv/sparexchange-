import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { Product } from '../types';

interface SellerDashboardProps {
    products: Product[];
    onAddNewItem: () => void;
    onEditItem: (product: Product) => void;
    onDeleteItem: (productId: number) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ products, onAddNewItem, onEditItem, onDeleteItem }) => {
    return (
        <div className="space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-dark border border-white/10 p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 glass-panel"
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Package size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white font-display mb-1">Your Inventory</h2>
                        <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">{products.length} Active {products.length === 1 ? 'Listing' : 'Listings'}</p>
                    </div>
                </div>
                 <button
                    onClick={onAddNewItem}
                    className="flex items-center justify-center gap-2 bg-brand-primary text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] active:scale-95 transition-all w-full md:w-auto glow-orange group relative overflow-hidden"
                    style={{ backgroundColor: 'var(--color-brand-primary)' }}
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <Plus size={20} className="relative z-10" />
                    <span className="relative z-10">Add New Asset</span>
                </button>
            </motion.div>

            {products.length === 0 ? (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center py-24 bg-bg-dark border border-white/10 border-dashed rounded-3xl glass-panel flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Package size={32} className="text-text-muted" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-display mb-2">Initialize your portfolio</h3>
                    <p className="text-text-secondary max-w-sm">Your premium marketplace inventory is currently empty. Add your first asset to begin.</p>
                </motion.div>
            ) : (
                <div className="bg-bg-dark border border-white/10 rounded-3xl overflow-hidden glass-panel">
                    <ul role="list" className="divide-y divide-white/10">
                        <AnimatePresence>
                            {products.map((product, index) => (
                                <motion.li 
                                    key={product.id} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-bg-darker relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-darker/60 to-transparent z-10"></div>
                                        <img 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                                            src={product.imageUrl} 
                                            alt={product.name} 
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://picsum.photos/seed/${product.id}/200/200`;
                                            }}
                                        />
                                    </div>
                                    <div className="flex-auto min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            {product.isVerified && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 roundedbg-white/5 text-brand-primary border border-brand-primary/30 uppercase tracking-widest bg-brand-primary/10" style={{ color: 'var(--color-brand-primary)' }}>AI Verified</span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 truncate">{product.name}</h3>
                                        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">{product.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0">
                                        <div className="flex flex-col items-start sm:items-end flex-shrink-0 mr-6">
                                            <p className="text-2xl font-bold text-brand-primary font-mono mb-1" style={{ color: 'var(--color-brand-primary)' }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.price)}</p>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest ${product.condition === 'New' ? 'bg-white/10 text-white' : 'bg-bg-darker text-text-secondary border border-white/10'}`}>
                                                {product.condition}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 border-l border-white/10 pl-6 h-full py-2">
                                            <button onClick={() => onEditItem(product)} className="w-12 h-12 flex items-center justify-center text-text-muted hover:text-white rounded-xl hover:bg-white/10 transition-colors" aria-label={`Edit ${product.name}`}>
                                                <Edit2 size={20} />
                                            </button>
                                            <button onClick={() => onDeleteItem(product.id)} className="w-12 h-12 flex items-center justify-center text-text-muted hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors" aria-label={`Delete ${product.name}`}>
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
            )}
        </div>
    );
};
