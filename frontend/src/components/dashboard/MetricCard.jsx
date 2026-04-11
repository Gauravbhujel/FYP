import React from "react";
import { ArrowUpRightIcon, ArrowDownRightIcon } from "lucide-react";

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  variant = "default",
}) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={`bg-white border rounded-xl p-6 flex flex-col justify-between transition-all duration-300 group shadow-[0px_2px_8px_0px_rgba(99,99,99,0.1)] hover:shadow-[0px_4px_16px_0px_rgba(99,99,99,0.15)] ${
      variant === "accent" ? "border-accent/30" : "border-gray-200"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-600">{title}</p>
        <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center transition-transform group-hover:scale-105 ${
          variant === "accent" ? "bg-accent/10 text-accent" : "bg-blue-50 text-blue-600"
        }`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div>
        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">{value}</h3>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ${
                isPositive
                  ? "bg-emerald-50 text-emerald-600"
                  : isNegative
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {isPositive && <ArrowUpRightIcon className="w-3.5 h-3.5 mr-0.5" />}
              {isNegative && <ArrowDownRightIcon className="w-3.5 h-3.5 mr-0.5" />}
              {Math.abs(change)}%
            </span>
            <span className="text-xs font-medium text-gray-500">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
}
