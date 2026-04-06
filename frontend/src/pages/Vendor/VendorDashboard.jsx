import React, { useState, useEffect } from "react";
import {
  ShoppingBagIcon,
  PackageIcon,
  TrendingUpIcon,
  ClockIcon,
  PlusIcon,
  XIcon,
  CheckCircle2Icon,
  WalletIcon,
  ArrowDownToLineIcon,
  CreditCardIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { SalesChart } from "../../components/dashboard/SalesChart";
import { RecentProducts } from "../../components/dashboard/RecentProducts";
import api from "../../api";

export const VendorDashboard = () => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_earnings: 0,
    this_month_earnings: 0,
    pending_earnings: 0,
    available_balance: 0,
    total_orders: 0,
    products_listed: 0,
    pending_orders: 0,
  });
  const [profile, setProfile] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproval, setShowApproval] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Sync approval message visibility with localStorage whenever profile changes
  useEffect(() => {
    if (profile?.id && profile?.status) {
      const currentStatus = profile.status.trim().toLowerCase();
      if (currentStatus === "approved" || currentStatus === "rejected") {
        const dismissKey = `dismissed_status_${profile.id}_${currentStatus}`;
        const isDismissed = window.localStorage.getItem(dismissKey);
        if (isDismissed === "true") {
          setShowApproval(false);
        } else {
          setShowApproval(true);
        }
      } else {
        setShowApproval(true);
      }
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      try {
        const profileResponse = await api.get("vendor/profile/");
        setProfile(profileResponse.data);
      } catch (e) {
        console.error("Profile fetch error", e);
      }

      const [statsRes, ordersRes, productsRes, chartRes] = await Promise.all([
        api.get("vendor/dashboard/stats/"),
        api.get("vendor/orders/"),
        api.get("vendor/dashboard/recent-products/"),
        api.get("vendor/dashboard/sales-chart/"),
      ]);

      setStats(statsRes.data);
      setAllOrders(ordersRes.data);
      setRecentProducts(productsRes.data);
      setSalesData(chartRes.data);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissApproval = () => {
    if (profile?.id && profile?.status) {
      const currentStatus = profile.status.toLowerCase();
      const dismissKey = `dismissed_status_${profile.id}_${currentStatus}`;
      window.localStorage.setItem(dismissKey, "true");
    }
    setShowApproval(false);
  };

  if (loading) {
    return (
      <VendorLayout currentPage="dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout currentPage="dashboard">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-12">
        {profile?.status === "rejected" && showApproval && (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center font-black uppercase tracking-widest text-sm mt-6 border border-red-200 shadow-sm relative group animate-fade-in">
             Your vendor account has been rejected.
             {profile?.admin_feedback && (
               <span className="block mt-2 font-medium text-xs opacity-80 normal-case">
                 Reason: {profile.admin_feedback}
               </span>
             )}
             <button 
                onClick={handleDismissApproval}
                className="absolute top-4 right-4 text-red-600/50 hover:text-red-600 transition-colors p-1"
                title="Dismiss"
             >
                <XIcon size={16} />
             </button>
          </div>
        )}

        {profile?.status === "pending" && (
          <div className="bg-amber-50 text-amber-600 p-6 rounded-xl text-center font-black uppercase tracking-widest text-sm mt-6 border border-amber-200 shadow-sm animate-pulse-subtle">
            Your account is currently under review by our administration team.
            <span className="block mt-2 font-medium text-xs opacity-80 normal-case">
              You will be notified here once your application has been processed.
            </span>
          </div>
        )}

        {profile?.status === "approved" && showApproval && (
          <div className="bg-emerald-50 text-emerald-600 p-6 rounded-xl text-center font-black uppercase tracking-widest text-sm mt-6 border border-emerald-200 shadow-sm relative group">
             Your account has been approved.
             {profile?.admin_feedback && (
               <span className="block mt-2 font-medium text-xs opacity-80 normal-case">
                 Message from Admin: {profile.admin_feedback}
               </span>
             )}
             <button 
                onClick={handleDismissApproval}
                className="absolute top-4 right-4 text-emerald-600/50 hover:text-emerald-600 transition-colors p-1"
                title="Dismiss"
             >
                <XIcon size={16} />
             </button>
          </div>
        )}

        {/* Welcome Section */}
        {profile?.status !== "rejected" && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-3">Store Overview</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Business Performance Control Center</p>
          </div>
          {profile?.status === "approved" && (
            <Link to="/vendor/AddProduct">
              <button className="bg-accent hover:bg-[#EA580C] text-white font-black px-8 py-4 rounded-lg flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-[10px] uppercase tracking-[0.2em] border-none cursor-pointer">
                <PlusIcon size={16} /> Add New Product
              </button>
            </Link>
          )}
        </div>
        )}

        {/* Stats Grid */}
        {profile?.status !== "rejected" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Earnings"
                value={`Rs. ${(stats.total_earnings || 0).toLocaleString()}`}
                icon={TrendingUpIcon}
                variant="accent"
              />
              <MetricCard
                title="This Month Earnings"
                value={`Rs. ${(stats.this_month_earnings || 0).toLocaleString()}`}
                icon={CheckCircle2Icon}
              />
              <MetricCard
                title="Total Orders"
                value={String(stats.total_orders)}
                icon={ShoppingBagIcon}
              />
              <MetricCard
                title="Pending Earnings"
                value={`Rs. ${(stats.pending_earnings || 0).toLocaleString()}`}
                icon={ClockIcon}
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Visual Chart */}
                <div className="lg:col-span-8">
                    <SalesChart data={salesData} />
                </div>

                {/* Wallet UI Component */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-gray-900 rounded-xl p-8 relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <WalletIcon className="w-5 h-5 text-gray-400" />
                            <h2 className="text-[12px] font-black text-white uppercase tracking-[2px]">Store Wallet</h2>
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Available Balance</p>
                                <p className="text-3xl font-black text-white tracking-tight">Rs. {(stats.available_balance || 0).toLocaleString()}</p>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Clearing Soon</p>
                                    <p className="text-sm font-black text-emerald-400 tracking-tight">Rs. {(stats.pending_earnings || 0).toLocaleString()}</p>
                                </div>
                                <button className="w-10 h-10 bg-accent hover:bg-[#EA580C] rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 border-none cursor-pointer" title="Withdraw Funds">
                                    <ArrowDownToLineIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {profile?.status === "approved" && (
                        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCardIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">Payout Method</h2>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Linked Account</p>
                                <p className="text-sm font-black text-gray-900 tracking-tighter">eSewa •••• 4091</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Earnings Breakdown Table */}
                <div className="lg:col-span-12">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">My Earnings Breakdown</h2>
                            <Link to="/vendor/orders" className="text-[9px] font-black text-accent uppercase tracking-widest transition-all hover:underline cursor-pointer">View Processing Workflow</Link>
                        </div>
                        <div className="overflow-x-auto max-h-[500px]">
                            <table className="w-full text-left">
                                <thead className="bg-[#F5F5F5] border-b border-gray-200 text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4">Transaction</th>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Gross Revenue</th>
                                        <th className="px-6 py-4 text-rose-500">Platform Comm (5%)</th>
                                        <th className="px-6 py-4 text-emerald-600">Net Earning</th>
                                        <th className="px-6 py-4 text-right">Fund Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-[11px] font-bold text-gray-800">
                                    {allOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No earning events available.</td>
                                        </tr>
                                    ) : allOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black uppercase text-gray-900">{order.id}</span>
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{order.date}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-gray-500">
                                                {order.product} <span className="opacity-50">×{order.quantity}</span>
                                            </td>
                                            <td className="px-6 py-4 tracking-tight">Rs. {(order.amount || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 tracking-tight text-rose-500">- Rs. {(order.commission || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 tracking-tight text-emerald-600 font-black">Rs. {(order.vendor_earning || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                                                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    order.status === 'canceled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                    'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                    {order.status === 'delivered' ? 'Cleared' : order.status === 'canceled' ? 'Void' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
          </>
        )}
      </div>
    </VendorLayout>
  );
};
