import React from "react";

export function SalesChart({ data }) {
  const chartData = data && data.length > 0 ? data : [];
  const maxSales = chartData.length > 0 ? Math.max(...chartData.map((d) => d.sales)) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Earnings Velocity</h3>
          <p className="text-sm font-medium text-gray-500">7-Day Performance Cycle</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
                <span className="text-xs font-semibold text-gray-600">Gross Sales</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
                <span className="text-xs font-semibold text-gray-600">Net Earning</span>
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        {chartData.length === 0 || maxSales === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <p className="text-sm font-medium text-gray-400">No activity recorded</p>
            </div>
        ) : (
            <div className="flex items-end justify-between h-full gap-4 sm:gap-8">
            {chartData.map((item, index) => {
                const height = (item.sales / maxSales) * 100;

                return (
                <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 translate-y-2 group-hover:translate-y-0 shadow-lg whitespace-nowrap">
                        Rs. {(item.earnings || 0).toLocaleString()} Net
                    </div>

                    <div className="flex items-end gap-1 w-full justify-center">
                        <div
                            className="w-full max-w-[20px] bg-gray-100 rounded-t-sm sm:rounded-t-md transition-all duration-500 cursor-pointer group-hover:bg-gray-200"
                            style={{ height: `${Math.max(height, 5)}%` }}
                        ></div>
                        <div
                            className="w-full max-w-[20px] bg-accent rounded-t-sm sm:rounded-t-md transition-all duration-500 cursor-pointer group-hover:bg-[#E65A00]"
                            style={{ height: `${Math.max(((item.earnings || 0) / maxSales) * 100, 2)}%` }}
                        ></div>
                    </div>

                    <span className="text-xs font-medium text-gray-500 mt-4 group-hover:text-gray-900 transition-colors">
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
