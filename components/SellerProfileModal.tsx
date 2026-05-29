import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, Phone, Box, Star, ShieldCheck } from "lucide-react";
import { Address } from "../types";

interface SellerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerPhoneNumber: string;
  sellerLocation: Address | null;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({
  isOpen,
  onClose,
  sellerId,
  sellerPhoneNumber,
  sellerLocation,
}) => {
  // Generate some mock stats for the seller
  const isCurrentUser = sellerId === "currentUser";
  const numItemsSold = isCurrentUser ? 12 : Math.floor(Math.random() * 50) + 20;
  const rating = isCurrentUser ? 4.9 : (Math.random() * 1.5 + 3.5).toFixed(1);
  const joinYear = isCurrentUser
    ? new Date().getFullYear() - 1
    : new Date().getFullYear() - Math.floor(Math.random() * 3) - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-bg-darker/90 backdrop-blur-md pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-bg-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden glass-panel z-10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-bg-dark/50 z-20 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white font-display">
                Seller Profile
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center border-b border-white/5 relative overflow-hidden">
              <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none"></div>

              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg border-4 border-bg-dark mb-4 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                {isCurrentUser ? "ME" : "S"}
                {!isCurrentUser && (
                  <div className="absolute bottom-0 right-0 bg-brand-primary p-1.5 rounded-full border-2 border-bg-dark">
                    <ShieldCheck size={14} className="text-white" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-1 z-10">
                {isCurrentUser ? "You (Seller)" : "Verified Retailer"}
              </h3>
              <p className="text-xs text-text-muted font-medium z-10 tracking-widest uppercase mb-4">
                Member since {joinYear}
              </p>

              <div className="flex items-center gap-6 z-10">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold">{rating}</span>
                  </div>
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">
                    Rating
                  </span>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                    <Box size={16} />
                    <span className="font-bold">{numItemsSold}</span>
                  </div>
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">
                    Items Sold
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-bg-darker/50 space-y-4 flex-grow">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={14} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                    Contact
                  </p>
                  <p className="text-sm font-medium text-white">
                    {sellerPhoneNumber}
                  </p>
                </div>
              </div>

              {sellerLocation && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={14} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                      Location
                    </p>
                    <p className="text-sm font-medium text-white">
                      {sellerLocation.city}, {sellerLocation.state}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {sellerLocation.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
