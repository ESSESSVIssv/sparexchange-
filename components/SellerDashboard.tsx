import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Store,
  Package,
  ShoppingBag,
  BarChart3,
  CreditCard,
  Users,
  Download,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Product, Order } from "../types";

interface SellerDashboardProps {
  products: Product[];
  orders: Order[];
  onBack: () => void;
  user?: any;
}

type TabType =
  | "profile"
  | "inventory"
  | "orders"
  | "analytics"
  | "payouts"
  | "customers";

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 7500 },
];

const productPerformanceData = [
  { name: "Brake Pads", sold: 120 },
  { name: "Oil Filter", sold: 90 },
  { name: "Turbocharger", sold: 40 },
  { name: "Radiator", sold: 30 },
];

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  products,
  orders,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("analytics");

  const tabs = [
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "orders", icon: ShoppingBag, label: "Orders" },
    { id: "inventory", icon: Package, label: "Inventory" },
    { id: "payouts", icon: CreditCard, label: "Payouts" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "profile", icon: Store, label: "Store Profile" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <p className="text-text-muted text-sm font-bold uppercase tracking-widest mb-2">
                  Total Revenue
                </p>
                <h3 className="text-3xl font-display font-bold text-white">
                  $45,230.00
                </h3>
                <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp size={14} /> +12% from last month
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <p className="text-text-muted text-sm font-bold uppercase tracking-widest mb-2">
                  Total Orders
                </p>
                <h3 className="text-3xl font-display font-bold text-white">
                  1,452
                </h3>
                <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp size={14} /> +5% from last month
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <p className="text-text-muted text-sm font-bold uppercase tracking-widest mb-2">
                  Conversion Rate
                </p>
                <h3 className="text-3xl font-display font-bold text-white">
                  4.2%
                </h3>
                <p className="text-rose-400 text-sm mt-2 flex items-center gap-1">
                  -0.3% from last month
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-[350px]">
                <h4 className="font-bold mb-6">Monthly Revenue</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={revenueData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff10"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#ffffff50"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#ffffff50"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#1a1a2e",
                        border: "1px solid #ffffff20",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-brand-primary)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-brand-primary)", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-[350px]">
                <h4 className="font-bold mb-6">Top Selling Parts</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={productPerformanceData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff10"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      stroke="#ffffff50"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#ffffff50"
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#1a1a2e",
                        border: "1px solid #ffffff20",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="sold"
                      fill="var(--color-brand-primary)"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case "inventory":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Inventory Management</h3>
              <button className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm">
                Add New Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-bold text-text-muted text-sm">
                      Product
                    </th>
                    <th className="py-4 px-4 font-bold text-text-muted text-sm">
                      SKU
                    </th>
                    <th className="py-4 px-4 font-bold text-text-muted text-sm">
                      Price
                    </th>
                    <th className="py-4 px-4 font-bold text-text-muted text-sm">
                      Stock
                    </th>
                    <th className="py-4 px-4 font-bold text-text-muted text-sm text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
                      <span className="font-bold">Premium Brake Pads</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-muted">
                      BP-0012A
                    </td>
                    <td className="py-4 px-4 font-mono">$45.00</td>
                    <td className="py-4 px-4">
                      <span className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded text-xs font-bold">
                        Low: 3
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-text-muted hover:text-white mr-3">
                        Edit
                      </button>
                      <button className="text-rose-400 hover:text-rose-300">
                        Remove
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
                      <span className="font-bold">Synthetic Motor Oil</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-muted">
                      OIL-5W30
                    </td>
                    <td className="py-4 px-4 font-mono">$25.00</td>
                    <td className="py-4 px-4">
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold">
                        45
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-text-muted hover:text-white mr-3">
                        Edit
                      </button>
                      <button className="text-rose-400 hover:text-rose-300">
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-start gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center border-4 border-bg-dark shrink-0 overflow-hidden bg-brand-primary">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Store size={40} className="text-white" />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-2xl font-display font-bold flex items-center gap-2">
                      AutoParts Pro{" "}
                      <ShieldCheck size={20} className="text-brand-primary" />
                    </h3>
                    <p className="text-text-secondary">Owner: {user?.displayName || "Jane Smith"}</p>
                    <p className="text-text-muted text-sm">{user?.email || "jane@example.com"}</p>
                  </div>
                  <button className="border border-white/20 text-sm font-bold px-4 py-2 rounded-lg hover:bg-white/5">
                    Edit Profile
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-widest">
                      GST/Tax ID
                    </p>
                    <p className="font-mono text-sm">29ABCDE1234F1Z5</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-widest">
                      Contact
                    </p>
                    <p className="text-sm">{user?.phoneNumber || "+1 (555) 019-9122"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="space-y-6">
            <div className="flex gap-4 border-b border-white/10 pb-4">
              <button className="text-white font-bold border-b-2 border-brand-primary pb-1">
                New Orders (2)
              </button>
              <button className="text-text-muted hover:text-white pb-1">
                Processing
              </button>
              <button className="text-text-muted hover:text-white pb-1">
                Delivered
              </button>
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-bg-darker border border-white/5 p-4 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold">Order #ORD-889{i}</p>
                    <p className="text-sm text-text-muted">
                      Toyota Camry Headlight Assembly
                    </p>
                    <p className="text-xs mt-1 text-emerald-400">
                      Ship by: Tomorrow
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold font-mono">$150.00</p>
                    <button className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-brand-primary hover:text-white transition">
                      Process
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "payouts":
        return (
          <div className="space-y-6 max-w-3xl">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-bg-darker to-bg-dark border border-brand-primary/20 flex justify-between items-center">
              <div>
                <p className="text-sm text-text-muted font-bold uppercase tracking-widest">
                  Available for Payout
                </p>
                <p className="text-4xl font-display font-bold text-white">
                  $2,450.00
                </p>
              </div>
              <button className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg glow-orange">
                Request Withdrawal
              </button>
            </div>
            <h4 className="font-bold mt-4">Transaction History</h4>
            <div className="bg-bg-darker rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold">Withdrawal to Bank ****1234</p>
                  <p className="text-text-muted text-xs">May 01, 2026</p>
                </div>
                <p className="font-bold text-emerald-400">
                  Completed <span className="text-white ml-2">$3,000.00</span>
                </p>
              </div>
              <div className="p-4 border-b border-white/5 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold">Sale: Custom Turbo Kits (x2)</p>
                  <p className="text-text-muted text-xs">Apr 28, 2026</p>
                </div>
                <p className="font-bold text-white">+$800.00</p>
              </div>
            </div>
          </div>
        );
      case "customers":
        return (
          <div className="space-y-6 text-center py-12">
            <Users size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-bold">Customer Management</h3>
            <p className="text-text-muted max-w-md mx-auto">
              View customer profiles, respond to reviews, and handle complaints
              directly from this dashboard.
            </p>
            <button className="mt-4 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5 text-sm font-bold">
              Load Customer Data
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <h2 className="text-3xl font-display font-bold mb-8">Seller Hub</h2>
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
              className="bg-bg-dark rounded-3xl border border-white/10 p-6 md:p-8 min-h-[600px]"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
