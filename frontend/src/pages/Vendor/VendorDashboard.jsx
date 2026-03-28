import React, { useState, useEffect } from "react";
import {
  ShoppingBagIcon,
  PackageIcon,
  TrendingUpIcon,
  ClockIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { SalesChart } from "../../components/dashboard/SalesChart";
import { RecentOrders } from "../../components/dashboard/RecentOrders";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { RecentProducts } from "../../components/dashboard/RecentProducts";
import api from "../../api";

export const VendorDashboard = () => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    products_listed: 0,
    pending_orders: 0,
  });
  const [profile, setProfile] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproval, setShowApproval] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      try {
        const profileResponse = await api.get("vendor/profile/");
        setProfile(profileResponse.data);

        // Check if this status notification was already seen
        const currentStatus = profileResponse.data.status;
        const profileId = profileResponse.data.id;
        
        if (currentStatus === "approved" || currentStatus === "rejected") {
          const seenKey = `seen_status_${profileId}_${currentStatus}`;
          const hasSeen = localStorage.getItem(seenKey);
          if (hasSeen) {
            setShowApproval(false);
          } else {
            setShowApproval(true);
            // Mark as seen immediately so it doesn't show next time
            localStorage.setItem(seenKey, "true");
          }
        }
      } catch (e) {
        console.error("Profile fetch error", e);
      }

      const [statsRes, ordersRes, productsRes, chartRes] = await Promise.all([
        api.get("vendor/dashboard/stats/"),
        api.get("vendor/dashboard/recent-orders/"),
        api.get("vendor/dashboard/recent-products/"),
        api.get("vendor/dashboard/sales-chart/"),
      ]);

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
      setRecentProducts(productsRes.data);
      setSalesData(chartRes.data);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissApproval = () => {
    if (profile?.id) {
      localStorage.setItem(`dismissed_approval_${profile.id}`, "true");
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
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
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
          <div className="bg-amber-50 text-amber-600 p-6 rounded-xl text-center font-black uppercase tracking-widest text-sm mt-6 border border-amber-200 shadow-sm">
            Your account is under review. You will be notified once approved by admin.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={`Rs. ${stats.total_revenue.toLocaleString()}`}
                change={5.2}
                icon={TrendingUpIcon}
              />
              <MetricCard
                title="Total Orders"
                value={String(stats.total_orders)}
                change={2.1}
                icon={ShoppingBagIcon}
              />
              <MetricCard
                title="Listed Products"
                value={String(stats.products_listed)}
                icon={PackageIcon}
              />
              <MetricCard
                title="Pending Actions"
                value={String(stats.pending_orders)}
                icon={ClockIcon}
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-8">
                    <SalesChart data={salesData} />
                </div>

                {/* Quick Actions */}
                {profile?.status === "approved" && (
                  <div className="lg:col-span-4">
                      <QuickActions />
                  </div>
                )}
                
                {profile?.status !== "approved" && (
                  <div className="lg:col-span-4 flex items-center justify-center p-8 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-400 text-xs text-center font-black uppercase tracking-widest">Quick actions locked pending approval</p>
                  </div>
                )}

                {/* Recent Activity Section */}
                <div className="lg:col-span-7">
                    <RecentOrders orders={recentOrders} />
                </div>

                <div className="lg:col-span-5">
                    <RecentProducts products={recentProducts} />
                </div>
            </div>
          </>
        )}
      </div>
    </VendorLayout>
  );
};
