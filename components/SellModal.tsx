import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Upload, X, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { Product, Condition, CURRENCIES, Currency, Address } from '../types';
import { analyzeProductImage } from '../services/geminiService';

interface SellModalProps {
    onClose: () => void;
    onSaveProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerPhoneNumber'> | Product) => void;
    onGenerateDescription: (productName: string) => Promise<string>;
    productToEdit?: Product | null;
}

export const SellModal: React.FC<SellModalProps> = ({ onClose, onSaveProduct, onGenerateDescription, productToEdit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [condition, setCondition] = useState<Condition>(Condition.USED);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationResult, setValidationResult] = useState<{ isValid: boolean; score: number; reason: string } | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const isEditing = !!productToEdit;

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setDescription(productToEdit.description);
            setPrice(productToEdit.price.toString());
            setCurrency(productToEdit.currency);
            setCondition(productToEdit.condition);
            setImagePreview(productToEdit.imageUrl);
        }
    }, [productToEdit]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Invalid file type. Please upload an image file (PNG, JPG, GIF).');
                if(imageInputRef.current) imageInputRef.current.value = "";
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert('File is too large. Please upload an image under 10MB.');
                if(imageInputRef.current) imageInputRef.current.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setValidationResult(null); // Reset on new image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setValidationResult(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleGenerateClick = async () => {
        setIsGenerating(true);
        const generatedDesc = await onGenerateDescription(name);
        setDescription(generatedDesc);
        setIsGenerating(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name || !description || !price || !imagePreview) {
            alert('Please fill out all fields and upload an image.');
            return;
        }

        setIsSubmitting(true);

        // Run AI validation before finalizing (only if it's a new upload/Base64, or just run it anyway)
        let aiValidation = validationResult;
        
        if (!aiValidation && imagePreview.startsWith('data:image')) {
            aiValidation = await analyzeProductImage(imagePreview, name, description);
            setValidationResult(aiValidation);
            
            if (!aiValidation.isValid) {
                // If it fails, stop submission and let user review the issue
                setIsSubmitting(false);
                return; 
            }
        }

        const buildProduct = () => {
            if (isEditing && productToEdit) {
                return {
                    ...productToEdit,
                    name,
                    description,
                    price: parseFloat(price),
                    condition,
                    currency,
                    imageUrl: imagePreview,
                };
            }
            return {
                name,
                description,
                price: parseFloat(price),
                condition,
                currency,
                imageUrl: imagePreview,
                reviews: [],
                sellerLocation: { street: '456 Commerce St', city: 'New York', state: 'NY', zip: '10001', country: 'USA' },
            };
        };

        onSaveProduct(buildProduct());
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-bg-darker/80 backdrop-blur-sm pointer-events-none"
                />
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="glass-panel w-full max-w-2xl max-h-full overflow-y-auto rounded-3xl shadow-2xl relative border border-white/10" 
                    onClick={(e) => e.stopPropagation()}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="p-6 md:p-8 flex-grow">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white font-display">
                                        {isEditing ? 'Edit Listing' : 'Create Listing'}
                                    </h2>
                                    <p className="text-text-secondary mt-1">List your premium part on the marketplace.</p>
                                </div>
                                <button type="button" onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">Product Name</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all outline-none" 
                                        placeholder="e.g. Brembo Carbon Ceramic Brakes"
                                        style={{ '--tw-ring-color': 'var(--color-brand-primary)' } as React.CSSProperties}
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label htmlFor="description" className="block text-sm font-semibold text-white">Description</label>
                                        <button 
                                            type="button" 
                                            onClick={handleGenerateClick} 
                                            disabled={isGenerating || !name} 
                                            className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-wide uppercase px-3 py-1.5 bg-brand-primary/10 rounded-lg hover:bg-brand-primary/20"
                                            style={{ color: 'var(--color-brand-primary)' }}
                                        >
                                            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                            {isGenerating ? 'AI Writing...' : 'AI Enhance'}
                                        </button>
                                    </div>
                                    <textarea 
                                        id="description" 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)} 
                                        rows={4} 
                                        className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all outline-none resize-none leading-relaxed" 
                                        placeholder="Describe the condition, features, and compatibility..."
                                        style={{ '--tw-ring-color': 'var(--color-brand-primary)' } as React.CSSProperties}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-semibold text-white mb-2">Price</label>
                                        <div className="flex">
                                            <select 
                                                id="currency" 
                                                value={currency} 
                                                onChange={(e) => setCurrency(e.target.value as Currency)} 
                                                className="bg-white/5 border border-white/10 border-r-0 rounded-l-xl px-3 py-3 text-white focus:outline-none appearance-none font-semibold cursor-pointer"
                                            >
                                                {CURRENCIES.map(c => <option key={c} className="bg-bg-dark text-white">{c}</option>)}
                                            </select>
                                            <input 
                                                type="number" 
                                                id="price" 
                                                value={price} 
                                                onChange={(e) => setPrice(e.target.value)} 
                                                min="0" 
                                                step="0.01" 
                                                className="flex-1 bg-bg-dark border border-white/10 rounded-r-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all outline-none" 
                                                required 
                                                placeholder="0.00" 
                                                style={{ '--tw-ring-color': 'var(--color-brand-primary)' } as React.CSSProperties}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-2">Condition</label>
                                        <div className="flex space-x-3 mt-1">
                                            {[Condition.NEW, Condition.USED].map(cond => (
                                                <button
                                                    key={cond}
                                                    type="button"
                                                    onClick={() => setCondition(cond)}
                                                    className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${
                                                        condition === cond 
                                                        ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary shadow-[0_0_15px_rgba(255,107,0,0.15)]' 
                                                        : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10 hover:text-white'
                                                    }`}
                                                    style={condition === cond ? { color: 'var(--color-brand-primary)', borderColor: 'rgba(255,107,0,0.5)' } : {}}
                                                >
                                                    {cond}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">Product Image (AI Validated)</label>
                                    
                                    {validationResult && !validationResult.isValid && (
                                        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-400">
                                            <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-sm tracking-wide">Image Validation Failed</h4>
                                                <p className="text-sm mt-1 opacity-90">{validationResult.reason}</p>
                                                <p className="text-xs mt-2 opacity-75">Please upload a clear, accurate photo of the item.</p>
                                            </div>
                                        </div>
                                    )}

                                    {validationResult && validationResult.isValid && (
                                        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3 text-emerald-400">
                                            <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-sm tracking-wide">Image Verified Genuine</h4>
                                                <p className="text-sm mt-1 opacity-90">Trust Score: {validationResult.score}%</p>
                                            </div>
                                        </div>
                                    )}

                                    {imagePreview ? (
                                        <div className="relative group rounded-xl overflow-hidden border border-white/10">
                                            <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover bg-bg-darker" />
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button type="button" onClick={handleRemoveImage} className="text-white font-bold bg-white/20 hover:bg-red-500 rounded-full px-6 py-2 backdrop-blur-md transition-colors">
                                                    Remove Image
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 hover:border-brand-primary/50 transition-all cursor-pointer group">
                                            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                                                <div className="p-3 bg-bg-darker rounded-full mb-3 group-hover:text-brand-primary transition-colors text-text-muted">
                                                    <Upload size={24} />
                                                </div>
                                                <p className="text-sm font-medium text-white mb-1"><span className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }}>Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-text-muted">PNG, JPG, WEBP up to 10MB</p>
                                            </motion.div>
                                            <input id="file-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" ref={imageInputRef} />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 md:p-8 border-t border-white/5 bg-white/5 flex justify-end gap-4 rounded-b-3xl">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                disabled={isSubmitting}
                                className="px-6 py-3 font-semibold text-text-secondary hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-brand-primary text-white font-bold rounded-full shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] transition-all glow-orange flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: 'var(--color-brand-primary)' }}
                            >
                                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                                {isSubmitting ? 'AI Verifying...' : (isEditing ? 'Save Changes' : 'List Item')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
