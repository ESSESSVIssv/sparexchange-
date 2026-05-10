import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
    toast: ToastMessage;
    onClose: (id: number) => void;
}

const SuccessIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
);
const InfoIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
);

const CloseIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
)

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true); // Animate in
    }, []);

    const handleClose = () => {
        setVisible(false);
        // Allow time for animation before calling parent's remove function
        setTimeout(() => onClose(toast.id), 300);
    };

    const Icon = toast.type === 'success' ? SuccessIcon : InfoIcon;
    const baseColors = toast.type === 'success' 
        ? 'bg-green-50 text-green-800'
        : 'bg-blue-50 text-blue-800';
    const hoverColors = toast.type === 'success'
        ? 'hover:bg-green-100'
        : 'hover:bg-blue-100';
    const ringColors = toast.type === 'success'
        ? 'focus:ring-green-400'
        : 'focus:ring-blue-400'


    return (
        <div
            className={`w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg flex items-center transition-all duration-300 ease-in-out transform ${visible ? 'opacity-100 translate-x-0 sm:translate-y-0' : 'opacity-0 translate-x-full sm:translate-y-2'}`}
            role="alert"
        >
             <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${baseColors} rounded-lg`}>
                <Icon />
                <span className="sr-only">{toast.type} icon</span>
            </div>
            <div className="ml-3 text-sm font-normal text-slate-700">{toast.message}</div>
            <button 
                type="button" 
                className={`ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8`} 
                onClick={handleClose} 
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <CloseIcon />
            </button>
        </div>
    );
};
