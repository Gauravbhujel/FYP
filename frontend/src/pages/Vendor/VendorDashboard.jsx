import React, { useState, useEffect } from "react";
import {
  ShoppingBagIcon,
  TrendingUpIcon,
  CheckCircle2Icon,
  PieChartIcon,
  ArrowRightIcon,
  XIcon,
  BarChart3Icon,
  ActivityIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { DateRangePicker } from "../../components/dashboard/DateRangePicker";
import api from "../../api";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#ea580c', '#10b981', '#6366f1', '#f59e0b'];

export const VendorDashboard = () => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_earnings: 0,
    total_orders: 0,
  });
  const [profile, setProfile] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproval, setShowApproval] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange.start, dateRange.end]);

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
      const params = { from_date: dateRange.start, to_date: dateRange.end };
      const [profileRes, statsRes, ordersRes, salesRes, catRes] = await Promise.all([
        api.get("vendor/profile/"),
        api.get("vendor/dashboard/stats/", { params }),
        api.get("vendor/dashboard/recent-orders/"),
        api.get("vendor/dashboard/sales-chart/", { params }),
        api.get("vendor/dashboard/category-chart/", { params }),
      ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
      setSalesTrend(salesRes.data || []);
      setCategoryData(catRes.data || []);
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

  // Fallback for sales trend if empty
  const graphData = salesTrend.length > 0 ? salesTrend : [
    { day: 'Mon', sales: 0, earnings: 0 },
    { day: 'Tue', sales: 0, earnings: 0 },
    { day: 'Wed', sales: 0, earnings: 0 },
    { day: 'Thu', sales: 0, earnings: 0 },
    { day: 'Fri', sales: 0, earnings: 0 },
    { day: 'Sat', sales: 0, earnings: 0 },
    { day: 'Sun', sales: 0, earnings: 0 },
  ];

  return (
    <VendorLayout currentPage="dashboard">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
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
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
                <p className="text-sm text-gray-500 font-medium">Business Summary & Overview</p>
            </div>
            
            <DateRangePicker 
                start={dateRange.start}
                end={dateRange.end}
                onStartChange={(val) => setDateRange({...dateRange, start: val})}
                onEndChange={(val) => setDateRange({...dateRange, end: val})}
                onClear={() => setDateRange({ start: "", end: "" })}
            />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Link to="/vendor/reports">
              <button className="h-10 px-5 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-lg flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer focus:ring-2 focus:ring-accent/20 outline-none">
                <PieChartIcon size={16} className="text-gray-400" /> Reports
              </button>
            </Link>
            {stats.last_payout_date && (
              <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg flex items-center gap-2">
                <CheckCircle2Icon className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Last Payout: {stats.last_payout_date}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Sales"
            value={`Rs. ${(stats.total_revenue || 0).toLocaleString()}`}
            icon={TrendingUpIcon}
            change={stats.mom_growth || 0}
            trendLabel={dateRange.start && dateRange.end ? "vs previous period" : "vs last month"}
          />
          <MetricCard
            title="Orders in Progress"
            value={`Rs. ${(stats.pending_earnings || 0).toLocaleString()}`}
            icon={ActivityIcon}
            variant="accent"
          />
          <MetricCard
            title="Money Received"
            value={`Rs. ${(stats.paid_earnings || 0).toLocaleString()}`}
            icon={CheckCircle2Icon}
          />
        </div>

        {/* Sales Overview Chart (Full Width) */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                        <ActivityIcon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Sales Overview</h3>
                </div>
                <span className="text-xs font-medium text-gray-400 italic">
                    {dateRange.start && dateRange.end ? `${dateRange.start} to ${dateRange.end}` : 'Past 7 Days (Weekly)'}
                </span>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={graphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#6b7280' }} 
                            tickFormatter={(val) => `Rs. ${val.toLocaleString()}`} 
                        />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area 
                            type="monotone" 
                            dataKey="sales" 
                            name="Gross Sales" 
                            stroke="#ea580c" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorSales)" 
                            dot={{ r: 4, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Orders & Categories Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Overview (Bar Chart) */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <BarChart3Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Orders Overview</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-400 italic">
                        {dateRange.start && dateRange.end ? `${dateRange.start} to ${dateRange.end}` : 'Past 7 Days (Weekly)'}
                    </span>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={graphData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="orders" name="Total Orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Distribution (Pie Chart) */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <PieChartIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Category Distribution</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-400 italic">
                        {dateRange.start && dateRange.end ? 'Custom Range' : 'Overall'}
                    </span>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1 }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.length > 0 ? (
                                    categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))
                                ) : (
                                    <Cell fill="#f3f4f6" />
                                )}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
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
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
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
