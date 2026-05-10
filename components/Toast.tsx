import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
    toast: ToastMessage;
    onClose: (id: number) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    
    // We don't need local visible state if we rely on AnimatePresence from parent, 
    // but typically toasting systems handle their own lifecycles.
    // If the parent is managing an array of toasts, we just return the motion.div.

    const isSuccess = toast.type === 'success';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`w-full max-w-sm p-4 rounded-2xl shadow-2xl flex items-center border glass-panel backdrop-blur-xl
                ${isSuccess 
                    ? 'bg-brand-primary/10 border-brand-primary/30 shadow-[0_4px_30px_rgba(255,107,0,0.2)]' 
                    : 'bg-white/5 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                }`
            }
            role="alert"
        >
            <div className={`inline-flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl border
                ${isSuccess 
                    ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
                    : 'bg-white/10 text-white border-white/10'
                }`}
                style={isSuccess ? { color: 'var(--color-brand-primary)' } : {}}
            >
                {isSuccess ? <CheckCircle2 size={20} /> : <Info size={20} />}
            </div>
            
            <div className="ml-4 text-sm font-semibold text-white/90">
                {toast.message}
            </div>
            
            <button 
                type="button" 
                className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20" 
                onClick={() => onClose(toast.id)} 
                aria-label="Close"
            >
                <X size={18} />
            </button>
        </motion.div>
    );
};
