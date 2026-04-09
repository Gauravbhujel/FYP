import React, { useState, useEffect } from "react";
import {
  ShoppingBagIcon,
  TrendingUpIcon,
  CheckCircle2Icon,
  PieChartIcon,
  ArrowRightIcon,
  XIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { MetricCard } from "../../components/dashboard/MetricCard";
import api from "../../api";

export const VendorDashboard = () => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_earnings: 0,
    total_orders: 0,
  });
  const [profile, setProfile] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproval, setShowApproval] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      const [profileRes, statsRes, ordersRes] = await Promise.all([
        api.get("vendor/profile/"),
        api.get("vendor/dashboard/stats/"),
        api.get("vendor/dashboard/recent-orders/"),
      ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
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
        {/* Alerts Section (Keep existing status alerts) */}
        {profile?.status === "rejected" && showApproval && (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center font-black uppercase tracking-widest text-sm mt-6 border border-red-200 shadow-sm relative animate-fade-in">
             Your vendor account has been rejected.
             {profile?.admin_feedback && <span className="block mt-2 font-medium text-xs opacity-80 normal-case">Reason: {profile.admin_feedback}</span>}
             <button onClick={handleDismissApproval} className="absolute top-4 right-4 text-red-600/50 hover:text-red-600 transition-colors p-1"><XIcon size={16} /></button>
          </div>
        )}

        {profile?.status === "pending" && (
          <div className="bg-amber-50 text-amber-600 p-6 rounded-xl text-center font-black uppercase tracking-widest text-sm mt-6 border border-amber-200 shadow-sm animate-pulse-subtle">
            Your account is currently under review by our administration team.
            <span className="block mt-2 font-medium text-xs opacity-80 normal-case">You will be notified here once your application has been processed.</span>
          </div>
        )}

        {profile?.status === "approved" && showApproval && (
          <div className="bg-emerald-50 text-emerald-600 p-6 rounded-xl text-center font-black uppercase tracking-widest text-sm mt-6 border border-emerald-200 shadow-sm relative group">
             Your account has been approved.
             {profile?.admin_feedback && <span className="block mt-2 font-medium text-xs opacity-80 normal-case">Message from Admin: {profile.admin_feedback}</span>}
             <button onClick={handleDismissApproval} className="absolute top-4 right-4 text-emerald-600/50 hover:text-emerald-600 transition-colors p-1"><XIcon size={16} /></button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-3">Dashboard</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Business Summary Overview</p>
          </div>
          
          <Link to="/vendor/reports">
            <button className="h-14 px-8 bg-gray-900 text-white font-black text-[10px] rounded uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:bg-black hover:scale-[1.02] active:scale-95 shadow-lg border-none cursor-pointer">
              <PieChartIcon size={18} /> View Detailed Reports
            </button>
          </Link>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`Rs. ${(stats.total_revenue || 0).toLocaleString()}`}
            icon={TrendingUpIcon}
          />
          <MetricCard
            title="Your Earnings"
            value={`Rs. ${(stats.total_earnings || 0).toLocaleString()}`}
            icon={CheckCircle2Icon}
            variant="accent"
          />
          <MetricCard
            title="Total Orders"
            value={String(stats.total_orders)}
            icon={ShoppingBagIcon}
          />
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-[14px] font-black text-gray-900 uppercase tracking-[2px]">Recent Transactions</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Last 5 operational events</p>
                </div>
                <Link to="/vendor/orders" className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline flex items-center gap-2">
                    Order Workflow <ArrowRightIcon size={12} />
                </Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-4">Order ID</th>
                            <th className="px-8 py-4">Product</th>
                            <th className="px-8 py-4">Customer</th>
                            <th className="px-8 py-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-6 text-[10px] font-black text-gray-900 uppercase">{order.id}</td>
                                <td className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-tight">{order.product}</td>
                                <td className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.customer}</td>
                                <td className="px-8 py-6 text-[10px] font-black text-gray-900 text-right uppercase tracking-tighter">Rs. {order.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                        {recentOrders.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-8 py-12 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No recent transactions detectable.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </VendorLayout>
  );
};
