import React, { useState, useEffect } from "react";
import {
  ShoppingBagIcon,
  PackageIcon,
  TrendingUpIcon,
  ClockIcon,
  PlusIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { SalesChart } from "../../components/dashboard/SalesChart";
import { RecentOrders } from "../../components/dashboard/RecentOrders";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { RecentProducts } from "../../components/dashboard/RecentProducts";

export const VendorDashboard = () => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    products_listed: 0,
    pending_orders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Token ${token}` };

    try {
      const [statsRes, ordersRes, productsRes, chartRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/vendor/dashboard/stats/", { headers }),
        fetch("http://127.0.0.1:8000/api/vendor/dashboard/recent-orders/", { headers }),
        fetch("http://127.0.0.1:8000/api/vendor/dashboard/recent-products/", { headers }),
        fetch("http://127.0.0.1:8000/api/vendor/dashboard/sales-chart/", { headers }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setRecentOrders(await ordersRes.json());
      if (productsRes.ok) setRecentProducts(await productsRes.json());
      if (chartRes.ok) setSalesData(await chartRes.json());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <VendorLayout currentPage="dashboard">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Synchronizing Portfolio...</p>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout currentPage="dashboard">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-3">Store Overview</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Business Performance Control Center</p>
          </div>
          <Link to="/vendor/AddProduct">
            <button className="bg-accent hover:bg-[#E65A00] text-white font-black px-8 py-4 rounded-lg flex items-center gap-3 transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em] border-none cursor-pointer">
              <PlusIcon size={16} /> Add New Product
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
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
            <div className="lg:col-span-4">
                <QuickActions />
            </div>

            {/* Recent Activity Section */}
            <div className="lg:col-span-7">
                <RecentOrders orders={recentOrders} />
            </div>

            <div className="lg:col-span-5">
                <RecentProducts products={recentProducts} />
            </div>
        </div>
      </div>
    </VendorLayout>
  );
};
