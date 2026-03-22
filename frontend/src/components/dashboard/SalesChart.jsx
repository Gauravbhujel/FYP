import React from "react";

export function SalesChart({ data }) {
  const chartData = data && data.length > 0 ? data : [];
  const maxSales = chartData.length > 0 ? Math.max(...chartData.map((d) => d.sales)) : 0;

  return (
    <div className="dashboard-card p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Revenue Overview</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Last 7 days performance</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Sales</span>
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-[280px]">
        {chartData.length === 0 || maxSales === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <p className="text-sm font-medium">No sales activity tracked yet</p>
            </div>
        ) : (
            <div className="flex items-end justify-between h-full gap-3 sm:gap-6">
            {chartData.map((item, index) => {
                const height = (item.sales / maxSales) * 100;

                return (
                <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 shadow-xl translate-y-2 group-hover:translate-y-0">
                        Rs. {item.sales.toLocaleString()}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>

                    <div
                        className="w-full max-w-[40px] bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-xl transition-all duration-500 cursor-pointer shadow-lg shadow-emerald-500/10 group-hover:shadow-emerald-500/30 group-hover:scale-x-105"
                        style={{ height: `${Math.max(height, 5)}%` }}
                    ></div>

                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-4 group-hover:text-emerald-600 transition-colors">
                        {item.day}
                    </span>
                </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
}
