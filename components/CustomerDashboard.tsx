import React, { useState } from "react";
import {
  User,
  Package,
  Clock,
  CreditCard,
  Heart,
  Car,
  HelpCircle,
  Download,
  RefreshCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Order, OrderStatus } from "../types";

interface CustomerDashboardProps {
  orders: Order[];
  wishlist: Product[];
  onBack: () => void;
}

type TabType =
  | "profile"
  | "orders"
  | "history"
  | "payment"
  | "saved"
  | "garage";

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  orders,
  wishlist,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("John Doe");
  const [profileEmail, setProfileEmail] = useState("john.doe@example.com");
  const [profilePhone, setProfilePhone] = useState("+1 555-0199");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "orders", icon: Package, label: "My Orders" },
    { id: "history", icon: Clock, label: "Purchase History" },
    { id: "payment", icon: CreditCard, label: "Payment History" },
    { id: "saved", icon: Heart, label: "Saved Items" },
    { id: "garage", icon: Car, label: "Vehicle Garage" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-6 w-full">
                <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center text-3xl font-bold shrink-0 overflow-hidden relative group">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profileName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'
                  )}
                  {isEditingProfile && (
                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <User size={20} className="text-white mb-1" />
                      <span className="text-[10px] text-white">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                <div className="w-full">
                  {isEditingProfile ? (
                    <div className="space-y-3 w-full max-w-sm">
                      <input 
                        type="text" 
                        value={profileName} 
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                        placeholder="Full Name"
                      />
                      <input 
                        type="email" 
                        value={profileEmail} 
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                        placeholder="Email Address"
                      />
                      <input 
                        type="tel" 
                        value={profilePhone} 
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                        placeholder="Phone Number"
                      />
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors">Save</button>
                        <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 bg-white/10 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <h3 className="text-2xl font-display font-bold">{profileName}</h3>
                        <p className="text-text-secondary">{profileEmail}</p>
                        <p className="text-text-secondary">{profilePhone}</p>
                      </div>
                      <button onClick={() => setIsEditingProfile(true)} className="px-4 py-2 border border-white/20 rounded-lg text-sm font-bold hover:bg-white/5 transition-colors">
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="font-bold mb-4 text-brand-primary">
                  Address Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-text-muted">
                      Primary Address
                    </label>
                    <p>123 Main St, New York, NY 10001, USA</p>
                  </div>
                  <button className="text-sm border border-brand-primary text-brand-primary px-4 py-2 rounded-lg hover:bg-brand-primary/10">
                    Edit Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold">My Orders</h3>
            {orders.length === 0 ? (
              <div className="p-12 text-center text-text-muted border border-white/10 rounded-2xl">
                No active orders found.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-6 justify-between"
                >
                  <div>
                    <p className="text-sm text-text-muted">
                      Order ID: #{order.id}
                    </p>
                    <p className="font-bold text-lg">
                      {order.items.length} items
                    </p>
                    <p className="text-brand-primary font-bold">
                      Total: {order.total} {order.currency}
                    </p>
                    <p className="text-sm mt-2">
                      Status:{" "}
                      <span className="uppercase tracking-widest text-emerald-400 font-bold">
                        {order.status}
                      </span>
                    </p>
                  </div>
                  <div className="min-w-[200px] border-l border-white/10 pl-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span>Processing</span>
                    </div>
                    <div className="w-0.5 h-4 bg-white/10 ml-1"></div>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <div className="w-2 h-2 rounded-full bg-white/20"></div>
                      <span>Shipping</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "history":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold">
              Purchase History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-bold text-text-muted text-sm">
                      Date
                    </th>
                    <th className="py-4 px-4 font-bold text-text-muted text-sm">
                      Item
                    </th>
                    <th className="py-4 px-4 font-bold text-text-muted text-sm">
                      Amount
                    </th>
                    <th className="py-4 px-4 font-bold text-text-muted text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4">May 10, 2026</td>
                    <td className="py-4 px-4">Brake Rotor Set</td>
                    <td className="py-4 px-4">$120.00</td>
                    <td className="py-4 px-4 flex gap-2">
                      <button className="flex text-xs items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20">
                        <RefreshCcw size={14} /> Reorder
                      </button>
                      <button className="flex text-xs items-center gap-1 bg-brand-primary/20 text-brand-primary px-3 py-1.5 rounded-lg hover:bg-brand-primary/30">
                        <Download size={14} /> Invoice
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4">Apr 22, 2026</td>
                    <td className="py-4 px-4">Oil Filter</td>
                    <td className="py-4 px-4">$15.00</td>
                    <td className="py-4 px-4 flex gap-2">
                      <button className="flex text-xs items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20">
                        <RefreshCcw size={14} /> Reorder
                      </button>
                      <button className="flex text-xs items-center gap-1 bg-brand-primary/20 text-brand-primary px-3 py-1.5 rounded-lg hover:bg-brand-primary/30">
                        <Download size={14} /> Invoice
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "payment":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 text-white">
                <h4 className="font-bold opacity-80 mb-2">Wallet Balance</h4>
                <p className="text-4xl font-display font-bold">$450.00</p>
                <button className="mt-4 bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-bold opacity-90 hover:opacity-100">
                  Add Funds
                </button>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="font-bold text-text-muted mb-2">
                  Active Offers
                </h4>
                <p className="text-2xl font-display text-emerald-400">
                  10% OFF Tires (SUMMER10)
                </p>
              </div>
            </div>
            <h3 className="text-xl font-bold mt-4">Recent Transactions</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 border border-white/5 rounded-xl bg-bg-darker">
                <div>
                  <p className="font-bold">Payment for Order #ORD-1234</p>
                  <p className="text-xs text-text-muted">May 10, 2026</p>
                </div>
                <span className="text-rose-400 font-bold">-$120.00</span>
              </div>
              <div className="flex justify-between items-center p-4 border border-white/5 rounded-xl bg-bg-darker">
                <div>
                  <p className="font-bold">Refund for #ORD-998</p>
                  <p className="text-xs text-text-muted">May 01, 2026</p>
                </div>
                <span className="text-emerald-400 font-bold">+$45.00</span>
              </div>
            </div>
          </div>
        );
      case "saved":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold">
              Saved Items ({wishlist.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.length === 0 ? (
                <p className="text-text-muted col-span-3">
                  Your wishlist is empty.
                </p>
              ) : (
                wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 rounded-2xl border border-white/10 p-4"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-xl mb-4"
                    />
                    <p className="font-bold truncate">{item.name}</p>
                    <p className="text-brand-primary">
                      {item.price} {item.currency}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case "garage":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-display font-bold">
                My Vehicle Garage
              </h3>
              <button className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-bold">
                Add Vehicle
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-brand-primary/30 relative">
                <div className="absolute top-4 right-4 bg-brand-primary/20 text-brand-primary text-xs px-2 py-1 rounded font-bold">
                  Primary
                </div>
                <h4 className="text-xl font-bold mb-1">BMW M3</h4>
                <p className="text-text-muted mb-4">
                  2021 • 3.0L Twin-Turbo I6
                </p>
                <button className="w-full text-center border border-white/10 rounded-xl py-2 text-sm hover:bg-white/10 transition">
                  Find Compatible Parts
                </button>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-xl font-bold mb-1">Honda Civic Type R</h4>
                <p className="text-text-muted mb-4">2019 • 2.0L Turbo I4</p>
                <button className="w-full text-center border border-white/10 rounded-xl py-2 text-sm hover:bg-white/10 transition">
                  Find Compatible Parts
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <h2 className="text-3xl font-display font-bold mb-8">
        Customer Dashboard
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? "bg-brand-primary text-white font-bold" : "text-text-muted hover:bg-white/5 hover:text-white"}`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Pane */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-bg-dark rounded-3xl border border-white/10 p-6 md:p-8 min-h-[500px]"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
