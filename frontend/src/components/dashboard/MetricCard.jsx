import React from "react";

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-gray-900",
}) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white border border-gray-200 p-8 rounded-lg flex items-start justify-between transition-all group shadow-sm hover:shadow-md hover:border-gray-300 hover:-translate-y-1">
      <div className="flex-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">{value}</h3>

        {change !== undefined && (
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                isPositive
                  ? "bg-green-50 text-green-600"
                  : isNegative
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 text-gray-500"
              }`}
            >
              {isPositive && "+"}
              {change}%
            </span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Growth</span>
          </div>
        )}
      </div>

      <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all" />
      </div>
    </div>
  );
}
