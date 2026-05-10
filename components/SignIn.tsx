import React from 'react';
import { motion } from 'motion/react';
import { Fingerprint, Lock, Mail, ArrowRight } from 'lucide-react';

interface SignInProps {
    onSignIn: () => void;
    role: 'buyer' | 'seller';
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn, role }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background animated elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full bg-bg-dark border border-white/10 shadow-2xl rounded-3xl p-8 md:p-10 space-y-8 glass-panel relative z-10"
            >
                <div className="text-center relative">
                    <div className="w-20 h-20 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/30 mb-6 shadow-[0_0_30px_rgba(255,107,0,0.2)]">
                        <Fingerprint size={36} className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }} />
                    </div>
                    <h2 className="mt-2 text-3xl font-black text-white font-display tracking-tight">
                        Identity Verification
                    </h2>
                    <p className="mt-3 text-sm text-text-secondary">
                        Authenticate to access the high-end {role === 'buyer' ? 'consumer' : 'merchant'} exchange.
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onSignIn(); }}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <label htmlFor="email-address" className="sr-only">Email access code</label>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-text-muted group-focus-within:text-brand-primary transition-colors" />
                            </div>
                            <input 
                                id="email-address" 
                                name="email" 
                                type="email" 
                                autoComplete="email" 
                                required 
                                className="block w-full pl-11 pr-3 py-4 bg-bg-darker border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all sm:text-sm shadow-inner" 
                                placeholder="Secure Email Address" 
                            />
                        </div>
                        <div className="relative group">
                            <label htmlFor="password" className="sr-only">Passphrase</label>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-text-muted group-focus-within:text-brand-primary transition-colors" />
                            </div>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                autoComplete="current-password" 
                                required 
                                className="block w-full pl-11 pr-3 py-4 bg-bg-darker border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all sm:text-sm shadow-inner" 
                                placeholder="Cryptographic Passphrase" 
                            />
                        </div>
                    </div>
                    
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            className="group relative w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] glow-orange"
                            style={{ backgroundColor: 'var(--color-brand-primary)' }}
                        >
                            Authorize Access
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    
                    <div className="text-center mt-6">
                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold">
                            Secured by Zero-Knowledge Architecture
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
