import React, { useState, useEffect } from "react";
import {
  UsersIcon,
  StoreIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  BellIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  XCircleIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { MetricCard } from "../../components/dashboard/MetricCard";
import api from "../../api";

const AdminDashboard = () => {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    active_vendors: 0,
    pending_approvals: 0,
    total_revenue: 0,
    total_orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pendingRes, statsRes, topRes] = await Promise.all([
        api.get("admin/vendors/pending/"),
        api.get("admin/dashboard/stats/"),
        api.get("admin/dashboard/top-vendors/")
      ]);
      
      setPendingVendors(pendingRes.data);
      setStats(statsRes.data);
      setTopVendors(topRes.data);
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
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Control</h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-[2px] leading-none">GearUp Nepal Global Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-emerald-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Platform Live</span>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`Rs. ${stats.total_revenue.toLocaleString()}`}
            icon={TrendingUpIcon}
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-50"
          />
          <MetricCard
            title="Partners"
            value={String(stats.active_vendors)}
            icon={StoreIcon}
            iconColor="text-indigo-600"
            iconBgColor="bg-indigo-50"
          />
          <MetricCard
            title="Global Orders"
            value={String(stats.total_orders)}
            icon={ShoppingBagIcon}
            iconColor="text-amber-600"
            iconBgColor="bg-amber-50"
          />
          <MetricCard
            title="User Base"
            value={String(stats.total_users)}
            icon={UsersIcon}
            iconColor="text-rose-600"
            iconBgColor="bg-rose-50"
          />
        </div>

        {/* Main Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Approvals Block */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                <div className="dashboard-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                <AlertCircleIcon className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-800 tracking-tight">Pending Approvals</h2>
                        </div>
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-widest">{pendingVendors.length} Awaiting</span>
                    </div>

                    <div className="space-y-4">
                        {pendingVendors.length === 0 ? (
                            <div className="py-12 text-center">
                                <CheckCircle2Icon className="w-12 h-12 text-emerald-100 mx-auto mb-4" />
                                <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Queue is currently empty</p>
                            </div>
                        ) : (
                            pendingVendors.map((vendor) => (
                                <div key={vendor.id} className="group flex items-center justify-between p-5 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 rounded-[1.5rem] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sm font-black text-slate-400 shadow-sm border border-slate-100">
                                            {vendor.store_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 tracking-tight leading-none">{vendor.store_name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{vendor.owner_name} • Registered just now</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleVendorAction(vendor.id, "approve")}
                                            className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] rounded-xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer border-none uppercase tracking-widest"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleVendorAction(vendor.id, "reject")}
                                            className="h-10 px-4 bg-white hover:bg-rose-50 text-rose-500 font-black text-[10px] rounded-xl transition-all cursor-pointer border border-slate-100 hover:border-rose-100 uppercase tracking-widest"
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
                <div className="dashboard-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-black text-slate-800 tracking-tight text-[14px] uppercase tracking-[2px]">Top Performing Partners</h2>
                        <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer">Analyze Report</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                                <tr>
                                    <th className="pb-4 font-black">Partner Store</th>
                                    <th className="pb-4 font-black">Gross Revenue</th>
                                    <th className="pb-4 font-black text-center">Volume</th>
                                    <th className="pb-4 font-black text-right">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {topVendors.map((vendor, index) => (
                                    <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5">
                                            <p className="text-sm font-black text-slate-800 tracking-tight leading-none">{vendor.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Official Verified Merch</p>
                                        </td>
                                        <td className="py-5">
                                            <span className="text-sm font-black text-emerald-600 tracking-tight">Rs. {vendor.revenue.toLocaleString()}</span>
                                        </td>
                                        <td className="py-5 text-center">
                                            <span className="text-xs font-bold text-slate-600 px-3 py-1 bg-slate-100 rounded-lg">{vendor.orders} Orders</span>
                                        </td>
                                        <td className="py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-sm font-black text-amber-500">{vendor.rating}</span>
                                                <span className="text-amber-300">★</span>
                                            </div>
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
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <BellIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-black text-slate-800 tracking-tight">Recent Activity</h2>
                    </div>

                    <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                        {[
                            { type: "vendor", action: "Nike Sports added 5 products", time: "2h ago", color: "bg-indigo-500" },
                            { type: "order", action: "Order #ORD-1240 completed", time: "3h ago", color: "bg-emerald-500" },
                            { type: "user", action: "12 new customer registrations", time: "5h ago", color: "bg-amber-500" },
                            { type: "vendor", action: "Adidas Pro updated info", time: "6h ago", color: "bg-rose-500" },
                        ].map((act, i) => (
                            <div key={i} className="relative pl-10">
                                <div className={`absolute left-0 top-1 w-10 h-10 rounded-xl border-4 border-white ${act.color} flex items-center justify-center text-white scale-75 shadow-sm`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                </div>
                                <p className="text-xs font-black text-slate-700 leading-tight">{act.action}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{act.time}</p>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 font-black text-[10px] rounded-xl transition-all border-none cursor-pointer uppercase tracking-widest flex items-center justify-center gap-2">
                        View Full Logs <ArrowRightIcon className="w-3 h-3" />
                    </button>
                </div>

                {/* Efficiency Score */}
                <div className="dashboard-card p-8 bg-indigo-600 text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                     <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">System Health</p>
                     <h3 className="text-2xl font-black text-white mb-4 tracking-tighter">Operational 99.9%</h3>
                     <div className="w-full h-1.5 bg-indigo-800 rounded-full overflow-hidden mb-4">
                        <div className="w-[99%] h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                     </div>
                     <p className="text-xs font-bold text-indigo-100 leading-relaxed">System performance is optimal. All API endpoints responding within 45ms.</p>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
