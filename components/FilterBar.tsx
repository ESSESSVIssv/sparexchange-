import React from 'react';
import { motion } from 'motion/react';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { Condition, Currency, CURRENCIES } from '../types';

interface FilterBarProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    conditionFilter: Condition | 'all';
    onConditionFilterChange: (condition: Condition | 'all') => void;
    displayCurrency: Currency;
    onDisplayCurrencyChange: (currency: Currency) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ searchTerm, onSearchTermChange, conditionFilter, onConditionFilterChange, displayCurrency, onDisplayCurrencyChange }) => {
    const conditions: (Condition | 'all')[] = ['all', Condition.NEW, Condition.USED];
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-2xl shadow-lg mb-8 flex flex-col md:flex-row items-center gap-4"
        >
            <div className="relative w-full md:flex-grow focus-within:text-brand-primary">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search premium parts..."
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-white/10 rounded-xl focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition bg-bg-dark text-white placeholder-text-muted outline-none"
                    style={{ '--tw-ring-color': 'var(--color-brand-primary)', '--tw-border-opacity': 1 } as React.CSSProperties}
                />
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                <div className="flex items-center space-x-2 bg-bg-dark p-1.5 rounded-xl border border-white/5">
                    <div className="pl-2 pr-1 text-text-muted">
                        <Filter size={16} />
                    </div>
                    <div className="flex">
                        {conditions.map(condition => (
                            <button
                                key={condition}
                                onClick={() => onConditionFilterChange(condition)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    conditionFilter === condition 
                                        ? 'bg-white/10 text-white shadow-sm' 
                                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {condition.charAt(0).toUpperCase() + condition.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="relative flex items-center">
                    <select
                        value={displayCurrency}
                        onChange={(e) => onDisplayCurrencyChange(e.target.value as Currency)}
                        className="appearance-none border border-white/10 rounded-xl py-3 pl-4 pr-10 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition bg-bg-dark text-white outline-none w-full sm:w-auto font-semibold cursor-pointer"
                        style={{ '--tw-ring-color': 'var(--color-brand-primary)', '--tw-border-opacity': 1 } as React.CSSProperties}
                    >
                        {CURRENCIES.map(c => <option key={c} value={c} className="bg-bg-dark text-white">{c}</option>)}
                    </select>
                    <div className="absolute right-3 pointer-events-none text-text-muted">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
