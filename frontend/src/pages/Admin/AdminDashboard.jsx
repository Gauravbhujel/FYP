import React, { useState, useEffect } from "react";
import {
  UsersIcon,
  StoreIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  XCircleIcon,
  BanknoteIcon,
  BarChart3Icon,
  BellIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { Link } from "react-router-dom";
import api from "../../api";

const AdminDashboard = () => {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [stats, setStats] = useState({
    total_users: 0,
    active_vendors: 0,
    pending_approvals: 0,
    total_revenue: 0,
    total_commission: 0,
    total_orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pendingRes, statsRes, topRes, activitiesRes, ordersRes, reportsRes] = await Promise.all([
        api.get("admin/vendors/pending/"),
        api.get("admin/dashboard/stats/"),
        api.get("admin/dashboard/top-vendors/"),
        api.get("admin/dashboard/activities/"),
        api.get("admin/orders/list/"),
        api.get("admin/dashboard/reports/")
      ]);
      
      setPendingVendors(pendingRes.data);
      setStats(statsRes.data);
      setTopVendors(topRes.data);
      setRecentActivities(activitiesRes.data);
      setOrders(ordersRes.data.slice(0, 5));
      setReportData(reportsRes.data);
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="dashboard">
      <div className="w-full space-y-8 animate-fade-in pb-12">
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">System Console</h1>
            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[3px] leading-none">Global Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-2 rounded-lg flex items-center gap-3 border border-gray-300 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Platform Live</span>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue"
            value={`Rs. ${stats.total_revenue.toLocaleString()}`}
            icon={TrendingUpIcon}
          />
          <MetricCard
            title="Admin Earnings (5%)"
            value={`Rs. ${(stats.total_commission || 0).toLocaleString()}`}
            icon={CheckCircle2Icon}
          />
          <MetricCard
            title="Total Vendor Payout"
            value={`Rs. ${(stats.total_revenue - stats.total_commission).toLocaleString()}`}
            icon={BanknoteIcon}
          />
          <MetricCard
            title="Total Orders"
            value={String(stats.total_orders)}
            icon={ShoppingBagIcon}
          />
        </div>

        {/* Main Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Approvals Block */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                                <AlertCircleIcon className="w-5 h-5" />
                            </div>
                            <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">Pending Approvals</h2>
                        </div>
                        <span className="px-3 py-1 bg-[#F5F5F5] text-gray-900 text-[10px] font-black rounded uppercase tracking-widest border border-gray-300">{pendingVendors.length} Awaiting</span>
                    </div>

                    <div className="space-y-4">
                        {pendingVendors.length === 0 ? (
                            <div className="py-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
                                <CheckCircle2Icon className="w-8 h-8 text-gray-200 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Queue is currently empty</p>
                            </div>
                        ) : (
                            pendingVendors.map((vendor) => (
                                <div key={vendor.id} className="group flex items-center justify-between p-5 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-lg transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm border border-gray-300 uppercase">
                                            {vendor.store_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 tracking-tight leading-none uppercase text-xs">{vendor.store_name}</p>
                                            <p className="text-[8px] font-black text-gray-400 mt-2 uppercase tracking-widest">{vendor.owner_name} • System Registry</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleVendorAction(vendor.id, "approve")}
                                            className="h-9 px-4 bg-accent hover:bg-[#EA580C] text-white font-black text-[9px] rounded transition-all cursor-pointer border-none uppercase tracking-widest hover:scale-[1.02] active:scale-95"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleVendorAction(vendor.id, "reject")}
                                            className="h-9 px-4 bg-white hover:bg-rose-50 text-rose-500 font-black text-[9px] rounded transition-all cursor-pointer border border-gray-300 hover:border-rose-100 uppercase tracking-widest hover:scale-[1.02] active:scale-95"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Vendors Table */}
                <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">Top Performing Vendors</h2>
                        <button className="text-[9px] font-black text-accent uppercase tracking-widest transition-all border-none bg-transparent cursor-pointer hover:text-[#EA580C] hover:underline hover:scale-[1.02] active:scale-95">Analyze Full Report</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-left">
                                <tr>
                                    <th className="pb-4 border-b border-gray-300">Vendor Store</th>
                                    <th className="pb-4 border-b border-gray-300">Gross Sales</th>
                                    <th className="pb-4 border-b border-gray-300 text-center text-accent">Comm.</th>
                                    <th className="pb-4 border-b border-gray-300 text-right text-emerald-600">Payout</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300">
                                {topVendors.map((vendor, index) => (
                                    <tr key={index} className="group transition-colors">
                                        <td className="py-5">
                                            <p className="text-xs font-black text-gray-900 tracking-tight leading-none uppercase">{vendor.name}</p>
                                            <p className="text-[8px] font-black text-gray-400 mt-2 uppercase tracking-wider">{vendor.orders} total orders</p>
                                        </td>
                                        <td className="py-5">
                                            <span className="text-xs font-black text-gray-900 tracking-tight">Rs. {vendor.revenue.toLocaleString()}</span>
                                        </td>
                                        <td className="py-5 text-center">
                                            <span className="text-[10px] font-black text-accent tracking-widest">Rs. {(vendor.commission || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="py-5 text-right">
                                            <span className="text-[10px] font-black text-emerald-600 tracking-widest">Rs. {(vendor.payout || 0).toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Revenue Velocity Chart Section */}
                {reportData && (
                    <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center">
                                    <BarChart3Icon className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-gray-900 tracking-[2px] uppercase">Revenue & Commission Velocity</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Historical comparative trends</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[250px] flex items-end justify-between px-4 pb-10 border-b border-gray-200">
                            {reportData.monthly_revenue.map((data, i) => {
                                const maxRev = Math.max(...reportData.monthly_revenue.map(d => d.revenue)) || 1;
                                const heightRev = (data.revenue / maxRev) * 100;
                                const heightComm = (data.commission / maxRev) * 100;
                                return (
                                    <div key={i} className="relative flex flex-col items-center group w-full">
                                        <div className="flex items-end gap-1 w-full justify-center">
                                            <div 
                                                className="w-4 md:w-6 bg-[#F5F5F5] hover:bg-emerald-500 transition-all duration-300 relative rounded-t group/rev"
                                                style={{ height: `${heightRev}%` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/rev:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-gray-900 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-xl z-10">
                                                    Rev: Rs. {(data.revenue/1000).toFixed(1)}K
                                                </div>
                                            </div>
                                            <div 
                                                className="w-4 md:w-6 bg-accent/20 hover:bg-accent transition-all duration-300 relative rounded-t group/comm"
                                                style={{ height: `${heightComm}%` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/comm:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-accent text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-xl z-10">
                                                    Comm: Rs. {(data.commission/1000).toFixed(1)}K
                                                </div>
                                            </div>
                                        </div>
                                        <span className="absolute -bottom-10 text-[8px] font-black text-gray-400 group-hover:text-accent transition-colors uppercase tracking-widest">{data.month}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Earnings Breakdown Table */}
                <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">Revenue & Commission Breakdown</h2>
                        <Link to="/admin/orders" className="text-[9px] font-black text-accent uppercase tracking-widest transition-all border-none bg-transparent cursor-pointer hover:text-[#EA580C] hover:underline hover:scale-[1.02] active:scale-95 text-decoration-none">View All Orders</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#F5F5F5] border-b border-gray-200 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-4 py-3 border-b border-gray-300">Order ID</th>
                                    <th className="px-4 py-3 border-b border-gray-300">Customer</th>
                                    <th className="px-4 py-3 border-b border-gray-300">Vendor</th>
                                    <th className="px-4 py-3 border-b border-gray-300 tracking-tight">Total Amount</th>
                                    <th className="px-4 py-3 border-b border-gray-300 text-rose-500 tracking-tight">Admin Comm (5%)</th>
                                    <th className="px-4 py-3 border-b border-gray-300 text-emerald-600 tracking-tight">Vendor Earning</th>
                                    <th className="px-4 py-3 border-b border-gray-300 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-[11px] font-bold text-gray-800">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-4 py-4 text-[10px] uppercase font-black">{order.id}</td>
                                        <td className="px-4 py-4 truncate max-w-[100px]">{order.customer?.name}</td>
                                        <td className="px-4 py-4 text-[10px] text-gray-500 uppercase font-black">{order.vendor?.store_name}</td>
                                        <td className="px-4 py-4 tracking-tight text-gray-900">Rs. {(order.amount || 0).toLocaleString()}</td>
                                        <td className="px-4 py-4 tracking-tight text-rose-500">Rs. {(order.commission || 0).toLocaleString()}</td>
                                        <td className="px-4 py-4 tracking-tight text-emerald-600 font-black">Rs. {(order.vendor_earning || 0).toLocaleString()}</td>
                                        <td className="px-4 py-4 text-right">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Activity Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                            <BellIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">Recent Activity</h2>
                    </div>
 
                    <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-gray-300">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((act, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className={`absolute left-0 top-1 w-10 h-10 rounded border-4 border-white ${act.color} flex items-center justify-center text-white scale-75 shadow-sm`}>
                                        <div className="w-1 h-1 rounded-full bg-white" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-900 leading-tight uppercase tracking-tight">{act.action}</p>
                                    <p className="text-[8px] font-black text-gray-400 mt-2 uppercase tracking-widest">{act.time}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] font-black text-gray-400 pl-10 uppercase tracking-widest">No recent activity found.</p>
                        )}
                    </div>
 
                    <Link 
                        to="/admin/activity-logs"
                        className="w-full mt-8 py-3 bg-[#F5F5F5] hover:bg-gray-100 text-gray-900 font-black text-[9px] rounded transition-all border border-gray-300 cursor-pointer uppercase tracking-widest flex items-center justify-center gap-2 no-underline hover:scale-[1.01] active:scale-[0.98]"
                    >
                        View Full Logs <ArrowRightIcon className="w-3 h-3" />
                    </Link>
                </div>

                {/* Efficiency Score */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">System Health</p>
                     <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">Operational 99.9%</h3>
                     <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
                        <div className="w-[99%] h-full bg-accent shadow-[0_0_15px_rgba(255,107,0,0.5)]" />
                     </div>
                     <p className="text-[10px] font-black text-gray-400 leading-relaxed uppercase tracking-widest">Performance Optimal • Low Latency</p>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
