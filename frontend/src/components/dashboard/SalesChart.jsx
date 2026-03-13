import React from "react";
import { Card } from "../ui/Card";

export function SalesChart({ data }) {
  const chartData = data && data.length > 0 ? data : [];
  const maxSales = chartData.length > 0 ? Math.max(...chartData.map((d) => d.sales)) : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Revenue Overview</h3>
          <p className="text-sm text-slate-600">Last 7 days</p>
        </div>
      </div>

      {chartData.length === 0 || maxSales === 0 ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <p className="text-sm">No sales data yet</p>
        </div>
      ) : (
        <div className="flex items-end justify-between h-64 space-x-2">
          {chartData.map((item, index) => {
            const height = (item.sales / maxSales) * 100;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-full pb-2">
                  <div
                    className="w-full bg-gradient-to-t from-orange-600 to-orange-500 rounded-t-lg transition-all duration-500 hover:from-orange-700 hover:to-orange-600 cursor-pointer relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Rs. {item.sales.toLocaleString()}
                    </div>
                  </div>
                </div>

                <span className="text-xs text-slate-600 mt-2 font-medium">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
