import React from "react";
import {
  UsersIcon,
  StoreIcon,
  ShoppingBagIcon,
  DollarSignIcon,
  TrendingUpIcon,
  AlertCircleIcon,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const AdminDashboard = () => {
  const [pendingVendors, setPendingVendors] = React.useState([]);
  const [topVendors, setTopVendors] = React.useState([]);
  const [stats, setStats] = React.useState({
    total_users: 0,
    active_vendors: 0,
    pending_approvals: 0,
    total_revenue: 0,
    total_orders: 0,
  });

  React.useEffect(() => {
    fetchPendingVendors();
    fetchStats();
    fetchTopVendors();
  }, []);

  const fetchPendingVendors = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/vendors/pending/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setPendingVendors(data);
      }
    } catch (error) {
      console.error("Error fetching pending vendors:", error);
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/dashboard/stats/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchTopVendors = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/dashboard/top-vendors/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTopVendors(data);
      }
    } catch (error) {
      console.error("Error fetching top vendors:", error);
    }
  };

  const handleVendorAction = async (vendorId, action) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/vendors/update-status/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ vendor_id: vendorId, action }),
        },
      );

      if (response.ok) {
        alert(`Vendor ${action}d successfully`);
        fetchPendingVendors(); // Refresh list
        fetchStats(); // Refresh stats
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const recentActivity = [
    {
      type: "vendor",
      action: "Nike Sports Co. added 5 new products",
      time: "2 hours ago",
    },
    {
      type: "order",
      action: "Order #ORD-1240 completed - Rs. 299.99",
      time: "3 hours ago",
    },
    {
      type: "user",
      action: "12 new customer registrations",
      time: "5 hours ago",
    },
    {
      type: "vendor",
      action: "Adidas Pro updated store information",
      time: "6 hours ago",
    },
    {
      type: "alert",
      action: "Low stock alert: 3 products below threshold",
      time: "8 hours ago",
    },
  ];

  /* 
  Removed hardcoded topVendors as it is now fetched from backend
  */

  return (
    <AdminLayout currentPage="dashboard">
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-emerald-100 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-emerald-800">
                Admin Dashboard
              </h1>
              <p className="text-emerald-600 mt-1">
                Platform overview and management
              </p>
            </div>
            <Badge variant="success" className="text-sm bg-emerald-100 text-emerald-700">
              System Healthy
            </Badge>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Revenue"
              value={stats.total_revenue > 0 ? `Rs. ${stats.total_revenue.toLocaleString()}` : "Rs. 0"}
              change={0}
              icon={DollarSignIcon}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <MetricCard
              title="Active Vendors"
              value={String(stats.active_vendors)}
              change={0}
              icon={StoreIcon}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <MetricCard
              title="Total Orders"
              value={String(stats.total_orders)}
              change={0}
              icon={ShoppingBagIcon}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
            <MetricCard
              title="Total Users"
              value={String(stats.total_users)}
              change={0}
              icon={UsersIcon}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Platform Health
                </h3>
                <TrendingUpIcon className="w-5 h-5 text-green-600" />
              </div>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Revenue Breakdown
                </h3>
                <select className="px-3 py-1 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <AlertCircleIcon className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-slate-800">
                    Pending Approvals
                  </h3>
                </div>
                <Badge variant="warning">{pendingVendors.length}</Badge>
              </div>
              <div className="space-y-4">
                {pendingVendors.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No pending approvals.
                  </p>
                ) : (
                  pendingVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {vendor.store_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {vendor.owner_name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            handleVendorAction(vendor.id, "approve")
                          }
                          className="!py-1 !px-3 bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleVendorAction(vendor.id, "reject")
                          }
                          className="!py-1 !px-3 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Recent Activity
              </h3>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Top Performing Vendors
            </h3>
            <table className="w-full">
              <tbody>
                {topVendors.map((vendor, index) => (
                  <tr key={index}>
                    <td className="py-4 text-sm font-medium text-slate-800">
                      {vendor.name}
                    </td>
                    <td className="py-4 text-sm font-semibold text-green-600">
                      Rs. {vendor.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 text-sm text-slate-700">
                      {vendor.orders}
                    </td>
                    <td className="py-4 text-sm font-semibold">
                      {vendor.rating} ★
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
