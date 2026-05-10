import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Clock, Truck, CheckCircle2, ShieldCheck, Check } from 'lucide-react';
import { Order, OrderStatus, Address } from '../types';

interface OrdersPageProps {
    orders: Order[];
    onConfirmDelivery: (orderId: string) => void;
}

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
        { name: OrderStatus.PROCESSING, Icon: Clock },
        { name: OrderStatus.SHIPPED, Icon: Truck },
        { name: OrderStatus.DELIVERED, Icon: CheckCircle2 },
    ];
    const currentIndex = statuses.findIndex(s => s.name === status);

    return (
        <div className="w-full my-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-white/10 rounded-full transform -translate-y-1/2"></div>
                <div 
                    className="absolute left-0 top-1/2 h-1 bg-brand-primary rounded-full transform -translate-y-1/2 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,107,0,0.5)]" 
                    style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%`, backgroundColor: 'var(--color-brand-primary)' }}
                ></div>
                {statuses.map((s, index) => {
                    const isActive = index <= currentIndex;
                    const isCompleted = index < currentIndex;
                    return (
                        <div key={s.name} className="z-10 text-center relative group">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-all duration-500 border-2 ${isActive ? 'bg-bg-darker border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(255,107,0,0.2)]' : 'bg-bg-dark border-white/10 text-text-muted'}`} style={isActive ? { color: 'var(--color-brand-primary)', borderColor: 'var(--color-brand-primary)' } : {}}>
                                {isCompleted ? <Check size={20} /> : <s.Icon size={20} />}
                            </div>
                            <p className={`mt-3 text-xs font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-text-muted'}`}>{s.name}</p>
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
        <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto p-4 md:p-8"
        >
            <div className="bg-bg-darker glass-panel border border-white/10 p-6 md:p-10 rounded-3xl shadow-xl max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-10 border-b border-white/10 pb-6">
                    <h2 className="text-3xl font-bold text-white font-display flex items-center gap-3">
                        <Package size={28} className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }} />
                        Command Center
                    </h2>
                    <div className="text-sm font-bold text-text-secondary uppercase tracking-widest">
                        {orders.length} Active {orders.length === 1 ? 'Operation' : 'Operations'}
                    </div>
                </div>

                <div className="space-y-8">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/5 rotate-3">
                                <Package size={40} className="text-text-muted" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 font-display">No active operations</h3>
                            <p className="text-text-secondary">Your transaction history and order tracking will securely appear here.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {orders.map((order, index) => (
                                <motion.div 
                                    key={order.id} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-bg-dark border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg hover:border-white/20 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
                                        <div>
                                            <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">Order ID</p>
                                            <p className="font-mono text-xl text-white">{order.id}</p>
                                            <p className="text-sm text-text-secondary mt-2">Initiated on {new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl md:text-right">
                                            <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">Escrow Status</p>
                                            <div className="flex items-end md:justify-end gap-3 mb-1">
                                                <p className="text-sm line-through text-text-muted">{formatCurrency(order.total, order.currency)}</p>
                                                <p className="font-bold text-brand-primary text-2xl font-mono leading-none" style={{ color: 'var(--color-brand-primary)' }}>{formatCurrency(order.total / 2, order.currency)}</p>
                                            </div>
                                            <p className="text-xs text-text-secondary">50% secured. Remaining due on verified delivery.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="my-10 px-4 md:px-8">
                                        <OrderStatusTracker status={order.status} />
                                    </div>

                                    {order.status === OrderStatus.SHIPPED && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-brand-primary/10 border-l-4 border-brand-primary p-5 rounded-r-xl rounded-l-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6"
                                            style={{ borderColor: 'var(--color-brand-primary)' }}
                                        >
                                            <div className="text-center sm:text-left">
                                                <p className="font-bold text-brand-primary text-lg mb-1" style={{ color: 'var(--color-brand-primary)' }}>Target Acquired: Order has arrived.</p>
                                                <p className="text-sm text-white/80">Authorize release of remaining escrow balance to finalize operation.</p>
                                            </div>
                                            <button 
                                                onClick={() => handleConfirmClick(order.id)}
                                                className="whitespace-nowrap px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] glow-orange"
                                                style={{ backgroundColor: 'var(--color-brand-primary)' }}
                                            >
                                                Verify Delivery
                                            </button>
                                        </motion.div>
                                    )}

                                    <div className="border-t border-white/10 pt-6 mt-4">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Payload</p>
                                                <div className="space-y-4">
                                                    {order.items.map(item => (
                                                        <div key={item.id} className="flex items-center space-x-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-bg-darker">
                                                                <img 
                                                                    src={item.imageUrl} 
                                                                    alt={item.name} 
                                                                    referrerPolicy="no-referrer"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.src = `https://picsum.photos/seed/${item.id}/200/200`;
                                                                    }}
                                                                    className="w-full h-full object-cover" 
                                                                />
                                                            </div>
                                                            <div className="flex-grow min-w-0">
                                                                <p className="font-bold text-white truncate">{item.name}</p>
                                                                <p className="font-mono text-text-secondary text-sm mt-1">{formatCurrency(item.price, order.currency)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Destination Coordinates</p>
                                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                    <p className="text-sm text-text-secondary leading-relaxed">{formatAddress(order.shippingAddress)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* OTP Verification Modal */}
            <AnimatePresence>
                {verifyingOrderId && (
                    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-bg-darker/90 backdrop-blur-md"
                            onClick={() => setVerifyingOrderId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-bg-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden glass-panel z-10 p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck size={28} className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }} />
                                <h3 className="text-2xl font-bold text-white font-display">Verify Handover</h3>
                            </div>
                            
                            <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                                A 6-digit cryptographic key (OTP) has been transmitted to your device. Enter it below to confirm safe receipt and authorize final escrow release.
                            </p>
                            
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div>
                                    <label htmlFor="otp" className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Decryption Key (OTP)</label>
                                    <input 
                                        type="text" 
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000"
                                        className="w-full bg-bg-darker border border-white/20 rounded-xl px-4 py-4 text-center text-3xl tracking-[0.5em] font-mono font-bold text-white placeholder-white/10 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                                        required
                                    />
                                </div>
                                
                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setVerifyingOrderId(null)}
                                        className="flex-1 px-4 py-4 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={otp.length !== 6 || isVerifying}
                                        className="flex-1 px-4 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center glow-orange"
                                        style={(!isVerifying && otp.length === 6) ? { backgroundColor: 'var(--color-brand-primary)' } : {}}
                                    >
                                        {isVerifying ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                        ) : 'Authorize'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.main>
    );
};
