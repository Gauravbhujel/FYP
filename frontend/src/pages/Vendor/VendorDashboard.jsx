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
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mt-6 border border-red-200 shadow-sm relative flex items-start gap-3">
             <div className="flex-1">
               <p className="font-semibold">Your vendor account has been rejected.</p>
               {profile?.admin_feedback && <p className="mt-1 text-red-600">Reason: {profile.admin_feedback}</p>}
             </div>
             <button onClick={handleDismissApproval} className="text-red-400 hover:text-red-700 transition-colors p-1"><XIcon size={16} /></button>
          </div>
        )}

        {profile?.status === "pending" && (
          <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm mt-6 border border-amber-200 shadow-sm flex items-start gap-3">
            <div className="flex-1">
              <p className="font-semibold">Account under review.</p>
              <p className="mt-1 text-amber-600">Your account is currently under review by our administration team. You will be notified here once processed.</p>
            </div>
          </div>
        )}

        {profile?.status === "approved" && showApproval && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm mt-6 border border-emerald-200 shadow-sm relative flex items-start gap-3">
             <div className="flex-1">
               <p className="font-semibold">Account approved!</p>
               {profile?.admin_feedback && <p className="mt-1 text-emerald-600">Message from Admin: {profile.admin_feedback}</p>}
             </div>
             <button onClick={handleDismissApproval} className="text-emerald-400 hover:text-emerald-700 transition-colors p-1"><XIcon size={16} /></button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500 font-medium">Business Summary & Overview</p>
          </div>
          
          <Link to="/vendor/reports">
            <button className="h-10 px-5 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-lg flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
              <PieChartIcon size={16} className="text-gray-400" /> View Detailed Reports
            </button>
          </Link>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`Rs. ${(stats.total_revenue || 0).toLocaleString()}`}
            icon={TrendingUpIcon}
            change={8.5} // Placeholder trend to satisfy requirements
          />
          <MetricCard
            title="Your Earnings"
            value={`Rs. ${(stats.total_earnings || 0).toLocaleString()}`}
            icon={CheckCircle2Icon}
            variant="accent"
            change={5.2} // Placeholder trend
          />
          <MetricCard
            title="Total Orders"
            value={String(stats.total_orders)}
            icon={ShoppingBagIcon}
            change={-1.4} // Placeholder trend
          />
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Recent Transactions</h2>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Last 5 operational events</p>
                </div>
                <Link to="/vendor/orders" className="text-sm font-medium text-accent hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-accent/5 transition-colors">
                    View All Orders <ArrowRightIcon size={14} />
                </Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-left">Order ID</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-left">Product</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-left">Customer</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.customer}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Rs. {order.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                        {recentOrders.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-400 font-medium">No recent transactions recorded.</td>
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
