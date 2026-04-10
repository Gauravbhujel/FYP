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
    <div className={`bg-white border p-6 rounded-xl flex items-start justify-between transition-all group shadow-sm hover:shadow-md ${
      variant === "accent" ? "border-accent/30" : "border-gray-100"
    }`}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">{value}</h3>

        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                isPositive
                  ? "bg-emerald-50 text-emerald-600"
                  : isNegative
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 text-gray-500"
              }`}
            >
              {isPositive && <ArrowUpRightIcon className="w-3 h-3 mr-0.5" />}
              {isNegative && <ArrowDownRightIcon className="w-3 h-3 mr-0.5" />}
              {Math.abs(change)}%
            </span>
            <span className="text-xs font-medium text-gray-400">vs last month</span>
          </div>
        )}
      </div>

      <div className={`w-12 h-12 rounded-full flex flex-shrink-0 items-center justify-center transition-transform group-hover:scale-105 ${
        variant === "accent" ? "bg-accent/10 text-accent" : "bg-gray-50 text-gray-500"
      }`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
