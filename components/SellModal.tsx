import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { Product, Condition, CURRENCIES, Currency, Address } from '../types';

interface SellModalProps {
    onClose: () => void;
    onSaveProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerPhoneNumber'> | Product) => void;
    onGenerateDescription: (productName: string) => Promise<string>;
    productToEdit?: Product | null;
}

const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);


export const SellModal: React.FC<SellModalProps> = ({ onClose, onSaveProduct, onGenerateDescription, productToEdit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [condition, setCondition] = useState<Condition>(Condition.USED);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
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

            // Convert file to Base64 Data URL for persistent storage in state
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name || !description || !price || !imagePreview) {
            alert('Please fill out all fields and upload an image.');
            return;
        }
        
        if (isEditing) {
            const updatedProduct: Product = {
                ...productToEdit,
                name,
                description,
                price: parseFloat(price),
                condition,
                currency,
                imageUrl: imagePreview,
            };
            onSaveProduct(updatedProduct);
        } else {
            const sellerLocation: Address = { street: '456 Commerce St', city: 'New York', state: 'NY', zip: '10001', country: 'USA' };
            onSaveProduct({
                name,
                description,
                price: parseFloat(price),
                condition,
                currency,
                imageUrl: imagePreview,
                reviews: [],
                sellerLocation,
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                             <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Edit Your Item' : 'List Your Item'}</h2>
                             <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Product Name</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 bg-white" required />
                            </div>
                            <div>
                                <div className="flex justify-between items-center">
                                    <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                                    <button type="button" onClick={handleGenerateClick} disabled={isGenerating || !name} className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors">
                                        <MagicWandIcon /> {isGenerating ? 'Generating...' : 'Generate with AI'}
                                    </button>
                                </div>
                                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 bg-white" required></textarea>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price</label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-white text-slate-600 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500">
                                            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" className="flex-1 block w-full border-slate-300 rounded-none rounded-r-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 bg-white" required placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Condition</label>
                                    <fieldset className="mt-2 flex space-x-4">
                                        <div className="flex items-center">
                                            <input id="used" name="condition" type="radio" checked={condition === Condition.USED} onChange={() => setCondition(Condition.USED)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                                            <label htmlFor="used" className="ml-2 block text-sm text-slate-900">Used</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="new" name="condition" type="radio" checked={condition === Condition.NEW} onChange={() => setCondition(Condition.NEW)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                                            <label htmlFor="new" className="ml-2 block text-sm text-slate-900">New</label>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Product Image</label>
                                {imagePreview ? (
                                    <div className="mt-2">
                                        <div className="relative">
                                            <img src={imagePreview} alt="Product Preview" className="w-full h-48 object-contain rounded-md border border-slate-300 bg-slate-50 p-1" />
                                        </div>
                                        <button type="button" onClick={handleRemoveImage} className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
                                            Remove Image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-slate-600 justify-center">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" required ref={imageInputRef}/>
                                                </label>
                                            </div>
                                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {isEditing ? 'Save Changes' : 'List Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
