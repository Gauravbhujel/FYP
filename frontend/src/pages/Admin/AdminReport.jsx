import React, { useState } from "react";
import {
  TrendingUpIcon,
  ShoppingBagIcon,
  UsersIcon,
  CalendarIcon,
  ChevronDownIcon,
  BarChart3Icon,
  PieChartIcon,
  ArrowUpRightIcon,
  ZapIcon,
  GlobeIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";

const RsIcon = ({ className }) => (
  <span className={`font-black tracking-tighter ${className}`}>Rs</span>
);

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("this_month");

  const monthlyRevenue = [
    { month: "JUL", revenue: 68400, orders: 1245 },
    { month: "AUG", revenue: 72100, orders: 1312 },
    { month: "SEP", revenue: 81500, orders: 1489 },
    { month: "OCT", revenue: 95200, orders: 1678 },
    { month: "NOV", revenue: 112800, orders: 1923 },
    { month: "DEC", revenue: 134500, orders: 2156 },
    { month: "JAN", revenue: 120300, orders: 1987 },
  ];

  const categoryBreakdown = [
    {
      category: "Running",
      revenue: 42300,
      percentage: 28,
      color: "bg-indigo-500",
    },
    {
      category: "Football",
      revenue: 54700,
      percentage: 37,
      color: "bg-emerald-500",
    },
    {
      category: "Tennis",
      revenue: 15200,
      percentage: 10,
      color: "bg-amber-500",
    },
    {
      category: "Other",
      revenue: 15300,
      percentage: 25,
      color: "bg-slate-300",
    },
  ];

  const topVendors = [
    { name: "Nike Sports Co.", revenue: 45231, orders: 892, growth: 12.5 },
    { name: "Adidas Pro", revenue: 38456, orders: 756, growth: 8.3 },
    { name: "Under Armour", revenue: 32890, orders: 645, growth: -2.1 },
    { name: "Puma Athletics", revenue: 28934, orders: 589, growth: 15.7 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.revenue));

  return (
    <AdminLayout currentPage="reports">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Intelligence Hub</h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-[2px] leading-none">Diagnostic visualization of platform-wide economic vectors</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="h-11 pl-12 pr-10 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest outline-none appearance-none hover:bg-slate-50 transition-all cursor-pointer shadow-sm min-w-[180px]"
                >
                    <option value="this_month">Current Cycle</option>
                    <option value="last_month">Previous Cycle</option>
                    <option value="this_quarter">Quarterly Audit</option>
                    <option value="this_year">Annual Review</option>
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
             </div>
          </div>
        </div>

        {/* Global KPI Array */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="dashboard-card p-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ZapIcon className="w-24 h-24 text-indigo-600 -rotate-12" />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                        <TrendingUpIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Platform Yield</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-slate-800 tracking-tight">Rs. 842.5K</span>
                        <div className="flex items-center text-[11px] font-black text-emerald-500 uppercase tracking-tight bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                             +14.2% <ArrowUpRightIcon className="w-3 h-3 ml-0.5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-card p-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShoppingBagIcon className="w-24 h-24 text-emerald-600 -rotate-12" />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                        <ShoppingBagIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Transaction Volume</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-slate-800 tracking-tight">12,482</span>
                        <div className="flex items-center text-[11px] font-black text-emerald-500 uppercase tracking-tight bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                             +8.7% <ArrowUpRightIcon className="w-3 h-3 ml-0.5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-card p-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <GlobeIcon className="w-24 h-24 text-amber-600 -rotate-12" />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                        <UsersIcon className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Subject Base</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-slate-800 tracking-tight">4.2K</span>
                        <div className="flex items-center text-[11px] font-black text-emerald-500 uppercase tracking-tight bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                             +22.4% <ArrowUpRightIcon className="w-3 h-3 ml-0.5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Velocity Chart */}
            <div className="lg:col-span-2 dashboard-card p-8">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                            <BarChart3Icon className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800 tracking-tight uppercase tracking-wider">Revenue Velocity</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Historical growth projections</p>
                        </div>
                    </div>
                </div>

                <div className="h-[300px] flex items-end justify-between px-4 pb-8 border-b border-slate-50">
                    {monthlyRevenue.map((data, i) => {
                        const height = (data.revenue / maxRevenue) * 100;
                        return (
                            <div key={i} className="relative flex flex-col items-center group w-full">
                                <div 
                                    className="w-8 md:w-12 bg-indigo-500/10 group-hover:bg-indigo-500 rounded-t-xl transition-all duration-500 relative"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">
                                        Rs. {(data.revenue/1000).toFixed(1)}K
                                    </div>
                                </div>
                                <span className="absolute -bottom-8 text-[10px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{data.month}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Categorical Distribution */}
            <div className="dashboard-card p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                        <PieChartIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-800 tracking-tight uppercase tracking-wider">Segment Share</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Revenue categorical split</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {categoryBreakdown.map((cat, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{cat.category}</span>
                                <span className="text-[11px] font-black text-indigo-600">{cat.percentage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${cat.color} rounded-full transition-all duration-1000`} 
                                    style={{ width: `${cat.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-10 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1 leading-none">Intelligence Insight</p>
                    <p className="text-[11px] font-bold text-emerald-600/80 leading-relaxed uppercase tracking-tighter">Segment "Football" shows 37% dominance in current cycle.</p>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
