import React, { useState } from "react";
import {
  TrendingUpIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const RsIcon = ({ className }) => (
  <span className={`font-bold flex items-center justify-center ${className}`}>Rs</span>
);

const AdminReportsPage = () => {
  const [dateRange, setDateRange] = useState("this_month");

  const monthlyRevenue = [
    { month: "Jul", revenue: 68400, orders: 1245 },
    { month: "Aug", revenue: 72100, orders: 1312 },
    { month: "Sep", revenue: 81500, orders: 1489 },
    { month: "Oct", revenue: 95200, orders: 1678 },
    { month: "Nov", revenue: 112800, orders: 1923 },
    { month: "Dec", revenue: 134500, orders: 2156 },
    { month: "Jan", revenue: 120300, orders: 1987 },
  ];

  const categoryBreakdown = [
    {
      category: "Running",
      revenue: 42300,
      percentage: 28,
      color: "bg-orange-500",
    },
    {
      category: "Football",
      revenue: 54700,
      percentage: 37,
      color: "bg-blue-500",
    },
    {
      category: "Tennis",
      revenue: 15200,
      percentage: 10,
      color: "bg-yellow-500",
    },
    {
      category: "Other",
      revenue: 15300,
      percentage: 10,
      color: "bg-slate-400",
    },
  ];

  const topVendors = [
    { name: "Nike Sports Co.", revenue: 45231, orders: 892, growth: 12.5 },
    { name: "Adidas Pro", revenue: 38456, orders: 756, growth: 8.3 },
    { name: "Under Armour", revenue: 32890, orders: 645, growth: -2.1 },
    { name: "Puma Athletics", revenue: 28934, orders: 589, growth: 15.7 },
    { name: "Wilson Sports", revenue: 24567, orders: 478, growth: 6.9 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.revenue));

  return (
    <AdminLayout currentPage="reports">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Reports & Analytics
              </h1>
              <p className="text-slate-600 mt-1">
                Platform-wide performance insights
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Year</option>
              </select>


            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-slate-800">Rs. 150K</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUpIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      +18.2%
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <RsIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-slate-800">1,987</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUpIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      +12.5%
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    New Customers
                  </p>
                  <p className="text-3xl font-bold text-slate-800">342</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUpIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      +8.7%
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
