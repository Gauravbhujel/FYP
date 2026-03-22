import React from "react";

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-emerald-600",
  iconBgColor = "bg-emerald-50",
}) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="dashboard-card p-6 flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{value}</h3>

        {change !== undefined && (
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                isPositive
                  ? "bg-emerald-100 text-emerald-700"
                  : isNegative
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {isPositive && "+"}
              {change}%
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">vs last month</span>
          </div>
        )}
      </div>

      <div
        className={`w-12 h-12 rounded-2xl ${iconBgColor} flex items-center justify-center flex-shrink-0 shadow-inner`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  );
}
