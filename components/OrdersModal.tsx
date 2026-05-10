import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrdersModalProps {
    isOpen: boolean;
    onClose: () => void;
    orders: Order[];
}

const OrdersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const formatCurrency = (price: number, currency: string) => {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(price);
    } catch (e) {
        return `${currency} ${price.toFixed(2)}`;
    }
};

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PROCESSING:
            return 'bg-blue-100 text-blue-800';
        case OrderStatus.SHIPPED:
            return 'bg-yellow-100 text-yellow-800';
        case OrderStatus.DELIVERED:
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose, orders }) => {
    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

            {/* Modal Panel */}
            <div
                className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-2xl font-bold text-slate-800">My Orders</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-16 flex flex-col items-center">
                            <OrdersIcon />
                            <h3 className="text-xl font-semibold text-slate-600 mt-4">You have no orders yet</h3>
                            <p className="text-slate-500 mt-2">Your past orders will appear here.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-white border border-slate-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Order ID</p>
                                        <p className="font-mono text-xs text-slate-500">{order.id}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="border-t border-b py-2 my-2">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm py-1">
                                            <p className="text-slate-600 truncate flex-1 pr-4">{item.name}</p>
                                            <p className="font-medium text-slate-700">{formatCurrency(item.price, order.currency)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center">
                                     <div>
                                        <p className="text-xs text-slate-500">
                                            {new Date(order.date).toLocaleString()}
                                        </p>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-800">Total Paid</p>
                                        <p className="font-bold text-indigo-600">{formatCurrency(order.total, order.currency)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
