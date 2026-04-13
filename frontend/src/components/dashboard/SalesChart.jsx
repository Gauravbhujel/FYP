import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-2xl">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label} Statistics</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs font-medium text-gray-300">Gross Sales</span>
            <span className="text-xs font-bold text-white">Rs. {payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs font-medium text-accent">Net Earning</span>
            <span className="text-xs font-bold text-white">Rs. {payload[1].value.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-700/50 flex items-center justify-between">
            <span className="text-[10px] font-medium text-gray-500 italic">Margin</span>
            <span className="text-[10px] font-bold text-emerald-400">
                {payload[0].value > 0 ? ((payload[1].value / payload[0].value) * 100).toFixed(1) : 0}%
            </span>
        </div>
      </div>
    );
  }
  return null;
};

export function SalesChart({ data }) {
  const chartData = data && data.length > 0 ? data : [];
  const hasData = chartData.some(d => d.sales > 0 || d.earnings > 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full flex flex-col shadow-sm group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-accent transition-colors">Earnings Velocity</h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">7-Day Performance Cycle</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-100"></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Gross</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Net</span>
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-[280px] w-full">
        {!hasData ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2 border-2 border-dashed border-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                <BarChart className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">No activity recorded</p>
            </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={chartData} 
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    barGap={4}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f9fafb" />
                    <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                        tickFormatter={(value) => `Rs. ${value.toLocaleString()}`}
                        domain={[0, 'dataMax + 50']}
                    />
                    <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ fill: '#f9fafb', radius: 8 }}
                        animationDuration={300}
                    />
                    <Bar 
                        dataKey="sales" 
                        name="Gross Sales" 
                        fill="#f3f4f6" 
                        radius={[4, 4, 0, 0]} 
                        animationBegin={0}
                        animationDuration={1500}
                        barSize={14}
                    />
                    <Bar 
                        dataKey="earnings" 
                        name="Net Earning" 
                        fill="#ff6b00" 
                        radius={[4, 4, 0, 0]} 
                        animationBegin={300}
                        animationDuration={1500}
                        barSize={14}
                    />
                </BarChart>
            </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
