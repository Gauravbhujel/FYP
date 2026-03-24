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
      <div className="w-full space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Intelligence Hub</h1>
            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[3px] leading-none">Diagnostic visualization of platform-wide economic vectors</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="h-11 pl-12 pr-10 bg-white border border-gray-200 rounded text-[10px] font-black text-gray-900 uppercase tracking-widest outline-none appearance-none hover:bg-gray-50 transition-all cursor-pointer shadow-sm min-w-[200px]"
                >
                    <option value="this_month">Current Cycle</option>
                    <option value="last_month">Previous Cycle</option>
                    <option value="this_quarter">Quarterly Audit</option>
                    <option value="this_year">Annual Review</option>
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>
          </div>
        </div>

        {/* Global KPI Array */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center">
                            <TrendingUpIcon className="w-5 h-5 text-accent" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Platform Yield</p>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-gray-900 tracking-tight">Rs. 842.5K</span>
                        <div className="flex items-center text-[9px] font-black text-emerald-600 uppercase tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                             +14.2%
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center">
                            <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Total Orders</p>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-gray-900 tracking-tight">12,482</span>
                        <div className="flex items-center text-[9px] font-black text-emerald-600 uppercase tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                             +8.7%
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Identity Base</p>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-gray-900 tracking-tight">4.2K</span>
                        <div className="flex items-center text-[9px] font-black text-emerald-600 uppercase tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                             +22.4%
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Velocity Chart */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center">
                            <BarChart3Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 tracking-tight uppercase">Revenue Velocity</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Historical growth projections</p>
                        </div>
                    </div>
                </div>

                <div className="h-[300px] flex items-end justify-between px-4 pb-10 border-b border-gray-50">
                    {monthlyRevenue.map((data, i) => {
                        const height = (data.revenue / maxRevenue) * 100;
                        return (
                            <div key={i} className="relative flex flex-col items-center group w-full">
                                <div 
                                    className="w-8 md:w-12 bg-[#F5F5F5] group-hover:bg-accent transition-all duration-300 relative rounded-t"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-gray-900 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-xl">
                                        Rs. {(data.revenue/1000).toFixed(1)}K
                                    </div>
                                </div>
                                <span className="absolute -bottom-10 text-[8px] font-black text-gray-400 group-hover:text-accent transition-colors uppercase tracking-widest">{data.month}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Categorical Distribution */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center">
                        <PieChartIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-900 tracking-tight uppercase">Segment Share</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Revenue categorical split</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {categoryBreakdown.map((cat, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{cat.category}</span>
                                <span className="text-[10px] font-black text-accent">{cat.percentage}%</span>
                            </div>
                            <div className="h-1 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${cat.category === 'Football' ? 'bg-accent' : 'bg-gray-300'} rounded-full transition-all duration-1000`} 
                                    style={{ width: `${cat.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 p-5 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Intelligence Insight</p>
                    <p className="text-[10px] font-black text-gray-900 leading-relaxed uppercase tracking-tight">Segment "Football" shows 37% dominance in current cycle.</p>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
