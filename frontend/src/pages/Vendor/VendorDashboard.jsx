import React, { useState, useEffect } from "react";
import {
  DollarSignIcon,
  ShoppingBagIcon,
  PackageIcon,
  TrendingUpIcon,
  ClockIcon,
} from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { SalesChart } from "../../components/dashboard/SalesChart";
import { RecentOrders } from "../../components/dashboard/RecentOrders";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { RecentProducts } from "../../components/dashboard/RecentProducts";
import { Badge } from "../../components/ui/Badge";

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

  return (
    <VendorLayout currentPage="dashboard">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-emerald-100 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-emerald-800">
                Vendor Dashboard
              </h1>
              <p className="text-emerald-600 mt-1">
                Overview of your store performance
              </p>
            </div>
            <Badge variant="success" className="text-sm bg-emerald-100 text-emerald-700">
              Store Active
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Revenue"
              value={`Rs. ${stats.total_revenue.toLocaleString()}`}
              change={0}
              icon={DollarSignIcon}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <MetricCard
              title="Total Orders"
              value={String(stats.total_orders)}
              change={0}
              icon={ShoppingBagIcon}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <MetricCard
              title="Products Listed"
              value={String(stats.products_listed)}
              change={0}
              icon={PackageIcon}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
            <MetricCard
              title="Pending Orders"
              value={String(stats.pending_orders)}
              change={0}
              icon={ClockIcon}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SalesChart data={salesData} />
            </div>
            <div className="space-y-6">
              <QuickActions />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <RecentOrders orders={recentOrders} />
              <RecentProducts products={recentProducts} />
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
};
