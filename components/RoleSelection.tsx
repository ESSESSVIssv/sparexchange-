import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Store } from 'lucide-react';

interface RoleSelectionProps {
    onSelectRole: (role: 'buyer' | 'seller') => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-display tracking-tight">
                        Welcome to <span className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }}>SpareXchange</span>
                    </h1>
                    <p className="text-xl text-text-secondary mb-16">Enter the high-end marketplace. Establish your identity.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    <motion.button 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        onClick={() => onSelectRole('buyer')}
                        className="group relative bg-bg-dark border border-white/10 p-10 rounded-3xl hover:border-brand-primary/50 transition-all transform hover:-translate-y-2 overflow-hidden glass-panel"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 to-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-bg-darker rounded-full flex items-center justify-center border border-white/10 group-hover:border-brand-primary/50 group-hover:shadow-[0_0_30px_rgba(255,107,0,0.3)] transition-all mb-6">
                                <ShoppingCart size={32} className="text-white group-hover:text-brand-primary transition-colors delay-100" />
                            </div>
                            <h2 className="text-3xl font-bold text-white font-display mb-3">Consumer</h2>
                            <p className="text-text-secondary text-center group-hover:text-white/90 transition-colors">Acquire premium assets with secure AI-verified transactions.</p>
                        </div>
                    </motion.button>
                     
                    <motion.button 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        onClick={() => onSelectRole('seller')}
                        className="group relative bg-bg-dark border border-white/10 p-10 rounded-3xl hover:border-brand-primary/50 transition-all transform hover:-translate-y-2 overflow-hidden glass-panel"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 to-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-bg-darker rounded-full flex items-center justify-center border border-white/10 group-hover:border-brand-primary/50 group-hover:shadow-[0_0_30px_rgba(255,107,0,0.3)] transition-all mb-6">
                                <Store size={32} className="text-white group-hover:text-brand-primary transition-colors delay-100" />
                            </div>
                            <h2 className="text-3xl font-bold text-white font-display mb-3">Merchant</h2>
                            <p className="text-text-secondary text-center group-hover:text-white/90 transition-colors">Distribute authentic inventory to a global verified audience.</p>
                        </div>
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
