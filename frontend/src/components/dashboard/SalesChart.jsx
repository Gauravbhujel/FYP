import React from "react";

export function SalesChart({ data }) {
  const chartData = data && data.length > 0 ? data : [];
  const maxSales = chartData.length > 0 ? Math.max(...chartData.map((d) => d.sales)) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-sm font-black text-gray-900 tracking-tighter uppercase mb-2">Revenue Activity</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">7-Day Performance Cycle</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Revenue</span>
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        {chartData.length === 0 || maxSales === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">No activity recorded</p>
            </div>
        ) : (
            <div className="flex items-end justify-between h-full gap-4 sm:gap-8">
            {chartData.map((item, index) => {
                const height = (item.sales / maxSales) * 100;

                return (
                <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 uppercase tracking-widest translate-y-2 group-hover:translate-y-0">
                        Rs. {item.sales.toLocaleString()}
                    </div>

                    <div
                        className="w-full max-w-[48px] bg-accent rounded-t sm:rounded-t-md transition-all duration-500 cursor-pointer group-hover:bg-[#E65A00]"
                        style={{ height: `${Math.max(height, 5)}%` }}
                    ></div>

                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-6 group-hover:text-gray-900 transition-colors">
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
