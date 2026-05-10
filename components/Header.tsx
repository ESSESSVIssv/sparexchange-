import React from 'react';

interface HeaderProps {
    onSellClick: () => void;
    cartItemCount: number;
    onCartClick: () => void;
    wishlistItemCount: number;
    onWishlistClick: () => void;
    role: 'buyer' | 'seller';
    onChatClick: () => void;
    chatCount: number;
    onOrdersClick: () => void;
    onNavigateHome: () => void;
}

const StoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const WishlistIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

const OrdersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ onSellClick, cartItemCount, onCartClick, wishlistItemCount, onWishlistClick, role, onChatClick, chatCount, onOrdersClick, onNavigateHome }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={onNavigateHome}
                >
                    <StoreIcon />
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                        SpareXchange
                        {role === 'seller' && <span className="text-base font-medium text-indigo-600 ml-2">Seller Dashboard</span>}
                    </h1>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                        onClick={onChatClick}
                        className="relative text-slate-600 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                        aria-label={`View chats with ${chatCount} conversations`}
                    >
                        <ChatIcon />
                        {chatCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2">
                                {chatCount}
                            </span>
                        )}
                    </button>
                   {role === 'buyer' && (
                       <>
                        <button
                            onClick={onOrdersClick}
                            className="relative text-slate-600 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                            aria-label="View your orders"
                        >
                            <OrdersIcon />
                        </button>
                        <button
                            onClick={onWishlistClick}
                            className="relative text-slate-600 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                            aria-label={`View wishlist with ${wishlistItemCount} items`}
                        >
                            <WishlistIcon />
                            {wishlistItemCount > 0 && (
                                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2">
                                    {wishlistItemCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={onCartClick}
                            className="relative text-slate-600 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                            aria-label={`View cart with ${cartItemCount} items`}
                        >
                            <CartIcon />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                       </>
                    )}
                    <button
                        onClick={onSellClick}
                        className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                    >
                        <span className="hidden sm:inline">{role === 'buyer' ? 'Sell Your Item' : 'Add New Item'}</span>
                        <span className="sm:hidden">+</span>
                    </button>
                </div>
            </div>
        </header>
    );
};