import React, { useState, useEffect } from "react";
import {
  UsersIcon,
  StoreIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  BarChart3Icon,
  BellIcon,
  PieChartIcon,
  ActivityIcon,
  ClockIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { DateRangePicker } from "../../components/dashboard/DateRangePicker";
import { Link } from "react-router-dom";
import api from "../../api";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

// Chart data configurations
// Using accent color (#ea580c) for primary chart elements
const PIE_COLORS = ['#ea580c', '#10B981', '#F59E0B', '#8B5CF6'];

const AdminDashboard = () => {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    active_vendors: 0,
    pending_approvals: 0,
    total_revenue: 0,
    vendor_categories: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange.start, dateRange.end]);

  const fetchDashboardData = async () => {
    try {
      const params = { from_date: dateRange.start, to_date: dateRange.end };
      const [pendingRes, statsRes, activitiesRes] = await Promise.all([
        api.get("admin/vendors/pending/"),
        api.get("admin/dashboard/stats/", { params }),
        api.get("admin/dashboard/activities/"),
      ]);
      
      setPendingVendors(pendingRes.data);
      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorAction = async (vendorId, action) => {
    try {
      await api.post("admin/vendors/update-status/", { 
        vendor_id: vendorId, 
        action 
      });
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating vendor status:", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout currentPage="dashboard">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="dashboard">
      <div className="w-full space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
        
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 font-medium">
                <ClockIcon className="w-4 h-4" /> Updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            
            <DateRangePicker 
                start={dateRange.start}
                end={dateRange.end}
                onStartChange={(val) => setDateRange({...dateRange, start: val})}
                onEndChange={(val) => setDateRange({...dateRange, end: val})}
                onClear={() => setDateRange({ start: "", end: "" })}
            />
          </div>
          
          <Link to="/admin/reports">
            <button className="h-11 px-6 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-all hover:bg-gray-50 hover:text-accent hover:border-accent/30 flex items-center gap-2 shadow-sm whitespace-nowrap focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer">
              <BarChart3Icon size={18} className="text-accent" /> View Detailed Reports
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`Rs. ${stats.total_revenue.toLocaleString()}`}
            icon={TrendingUpIcon}
            variant="accent"
            change={12.5}
          />
          <MetricCard
            title="Total Orders"
            value={String(stats.total_orders)}
            icon={ShoppingBagIcon}
            change={8.2}
          />
          <MetricCard
            title="Registered Users"
            value={String(stats.total_users)}
            icon={UsersIcon}
            change={4.1}
          />
          <MetricCard
            title="Active Vendors"
            value={String(stats.active_vendors || 0)}
            icon={StoreIcon}
            change={-2.4}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Overview */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Revenue & Orders Trends</h2>
                        <p className="text-xs text-gray-500 mt-1">Platform performance for selected period</p>
                    </div>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.revenue_trend || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `Rs${val}`} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <RechartsTooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#ea580c" strokeWidth={3} dot={{ r: 4, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#10B981" strokeWidth={3} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Vendor Category Breakdown */}
            <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                <div className="mb-4">
                    <h2 className="text-base font-bold text-gray-900">Vendor Categories</h2>
                    <p className="text-xs text-gray-500 mt-1">Distribution across platform</p>
                </div>
                <div className="h-60 w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.vendor_categories || []}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {(stats.vendor_categories || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>

        {/* Bottom Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Approvals Block */}
            <div className="lg:col-span-8">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 shadow-sm">
                                <AlertCircleIcon className="w-4 h-4" />
                            </div>
                            <h2 className="text-base font-bold text-gray-900">Pending Approvals</h2>
                        </div>
                        <span className="px-2.5 py-1 bg-white text-gray-600 text-xs font-semibold rounded-md border border-gray-200 shadow-sm">
                            {pendingVendors.length} Awaiting
                        </span>
                    </div>

                    <div className="p-6 flex-1">
                        {pendingVendors.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2Icon className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">Queue is empty</h3>
                                <p className="text-xs text-gray-500">All vendors have been processed.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingVendors.map((vendor) => (
                                    <div key={vendor.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:border-accent/30 hover:shadow-md transition-all gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center font-bold text-lg shadow-sm border border-accent/20">
                                                {vendor.store_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{vendor.store_name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{vendor.owner_name} • Requested Access</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button 
                                                onClick={() => handleVendorAction(vendor.id, "approve")}
                                                className="flex-1 sm:flex-none h-9 px-4 bg-accent hover:opacity-90 text-white font-medium text-xs rounded-md transition-all focus:ring-2 focus:ring-accent/20 shadow-sm cursor-pointer"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleVendorAction(vendor.id, "reject")}
                                                className="flex-1 sm:flex-none h-9 px-4 bg-white hover:bg-rose-50 text-rose-600 border border-gray-200 hover:border-rose-200 font-medium text-xs rounded-md transition-all cursor-pointer"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <Link to="/admin/vendors" className="text-sm font-medium text-accent hover:opacity-80 flex items-center justify-center gap-1.5 transition-colors">
                            Manage All Vendors <ArrowRightIcon size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Activity Sidebar */}
            <div className="lg:col-span-4">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shadow-sm">
                            <ActivityIcon className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
                    </div>
 
                    <div className="p-6 flex-1">
                        <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
                            {recentActivities.length > 0 ? (
                                recentActivities.map((act, i) => (
                                    <div key={i} className="relative pl-10 group">
                                        <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full border-4 border-white ${act.color || 'bg-accent'} flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-110`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 leading-tight">{act.action}</p>
                                        <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-8">No recent activity found.</p>
                            )}
                        </div>
                    </div>
 
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <Link 
                            to="/admin/activity-logs"
                            className="w-full h-10 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                        >
                            View Full Logs <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
            
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
