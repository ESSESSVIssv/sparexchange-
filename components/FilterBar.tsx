import React from 'react';
import { Condition, Currency, CURRENCIES } from '../types';

interface FilterBarProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    conditionFilter: Condition | 'all';
    onConditionFilterChange: (condition: Condition | 'all') => void;
    displayCurrency: Currency;
    onDisplayCurrencyChange: (currency: Currency) => void;
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const FilterBar: React.FC<FilterBarProps> = ({ searchTerm, onSearchTermChange, conditionFilter, onConditionFilterChange, displayCurrency, onDisplayCurrencyChange }) => {
    const conditions: (Condition | 'all')[] = ['all', Condition.NEW, Condition.USED];
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-slate-900"
                />
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
                <span className="font-semibold text-slate-600">Condition:</span>
                <div className="flex bg-slate-100 p-1 rounded-md">
                    {conditions.map(condition => (
                        <button
                            key={condition}
                            onClick={() => onConditionFilterChange(condition)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                conditionFilter === condition 
                                    ? 'bg-indigo-600 text-white shadow' 
                                    : 'text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {condition.charAt(0).toUpperCase() + condition.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
                <span className="font-semibold text-slate-600">Currency:</span>
                <select
                    value={displayCurrency}
                    onChange={(e) => onDisplayCurrencyChange(e.target.value as Currency)}
                    className="border border-slate-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-slate-900"
                >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>
    );
};
