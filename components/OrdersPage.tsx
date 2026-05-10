import React from 'react';
import { Order, OrderStatus, Address } from '../types';

interface OrdersPageProps {
    orders: Order[];
    onConfirmDelivery: (orderId: string) => void;
}

const OrdersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const ProcessingIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const ShippedIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16h2a2 2 0 002-2V7a2 2 0 00-2-2h-3.382a1 1 0 00-.94.66L11 11"></path></svg>
);

const DeliveredIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const CheckIcon = () => (
    <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);


const formatCurrency = (price: number, currency: string) => {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(price);
    } catch (e) {
        return `${currency} ${price.toFixed(2)}`;
    }
};

const formatAddress = (address: Address) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
};

const OrderStatusTracker: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statuses = [
        { name: OrderStatus.PROCESSING, Icon: ProcessingIcon },
        { name: OrderStatus.SHIPPED, Icon: ShippedIcon },
        { name: OrderStatus.DELIVERED, Icon: DeliveredIcon },
    ];
    const currentIndex = statuses.findIndex(s => s.name === status);

    return (
        <div className="w-full my-6">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 transform -translate-y-1/2"></div>
                <div 
                    className="absolute left-0 top-1/2 h-0.5 bg-indigo-600 transform -translate-y-1/2 transition-all duration-500" 
                    style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%`}}
                ></div>
                {statuses.map((s, index) => {
                    const isActive = index <= currentIndex;
                    const isCompleted = index < currentIndex;
                    return (
                        <div key={s.name} className="z-10 text-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-colors duration-500 ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {isCompleted ? <CheckIcon /> : <s.Icon />}
                            </div>
                            <p className={`mt-2 text-xs font-semibold ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>{s.name}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const OrdersPage: React.FC<OrdersPageProps> = ({ orders, onConfirmDelivery }) => {
    const [verifyingOrderId, setVerifyingOrderId] = React.useState<string | null>(null);
    const [otp, setOtp] = React.useState('');
    const [isVerifying, setIsVerifying] = React.useState(false);

    const handleConfirmClick = (orderId: string) => {
        setVerifyingOrderId(orderId);
        setOtp('');
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        
        // Simulate OTP verification and payment
        setTimeout(() => {
            if (verifyingOrderId) {
                onConfirmDelivery(verifyingOrderId);
            }
            setVerifyingOrderId(null);
            setIsVerifying(false);
        }, 1500);
    };

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">My Orders</h2>
                <div className="space-y-8">
                    {orders.length === 0 ? (
                        <div className="text-center py-16 flex flex-col items-center">
                            <OrdersIcon />
                            <h3 className="text-xl font-semibold text-slate-600 mt-4">You have no orders yet</h3>
                            <p className="text-slate-500 mt-2">Your past orders will appear here.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 transition-shadow hover:shadow-md">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Order ID: <span className="font-mono text-slate-600">{order.id}</span></p>
                                        <p className="text-xs text-slate-500">Ordered on: {new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-semibold text-slate-800">Total Paid (50%)</p>
                                        <p className="font-bold text-indigo-600 text-lg">{formatCurrency(order.total / 2, order.currency)}</p>
                                        <p className="text-xs text-slate-500">Remaining: {formatCurrency(order.total / 2, order.currency)}</p>
                                    </div>
                                </div>
                                
                                <OrderStatusTracker status={order.status} />

                                {order.status === OrderStatus.SHIPPED && (
                                    <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-center sm:text-left">
                                            <p className="font-bold text-indigo-900">Order has arrived!</p>
                                            <p className="text-sm text-indigo-700">Confirm delivery to pay the remaining 50% and complete the order.</p>
                                        </div>
                                        <button 
                                            onClick={() => handleConfirmClick(order.id)}
                                            className="whitespace-nowrap px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                                        >
                                            Confirm Delivery & Pay
                                        </button>
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <p className="text-sm font-semibold text-slate-800 mb-2">Items in this order:</p>
                                    <div className="space-y-4">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex items-center space-x-4">
                                                <img 
                                                    src={item.imageUrl} 
                                                    alt={item.name} 
                                                    referrerPolicy="no-referrer"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = `https://picsum.photos/seed/${item.id}/200/200`;
                                                    }}
                                                    className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
                                                />
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-slate-700">{item.name}</p>
                                                </div>
                                                <p className="font-medium text-slate-800">{formatCurrency(item.price, order.currency)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                 <div className="border-t pt-4 mt-4">
                                     <p className="text-sm font-semibold text-slate-800 mb-1">Shipping To:</p>
                                     <p className="text-sm text-slate-600">{formatAddress(order.shippingAddress)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* OTP Verification Modal */}
            {verifyingOrderId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-scale">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Verify Delivery</h3>
                        <p className="text-sm text-slate-600 mb-6">
                            We've sent a 6-digit OTP to your registered phone number. Please enter it below to confirm delivery and authorize the final payment.
                        </p>
                        
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">Enter OTP</label>
                                <input 
                                    type="text" 
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="123456"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-center text-2xl tracking-widest font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setVerifyingOrderId(null)}
                                    className="flex-grow px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={otp.length !== 6 || isVerifying}
                                    className="flex-grow px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isVerifying ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Verify & Pay'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};
