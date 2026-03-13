import React from "react";
import { Card } from "../ui/Card";

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-orange-600",
  iconBgColor = "bg-orange-100",
}) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>

          <p className="text-3xl font-bold text-slate-800 mb-2">{value}</p>

          {change !== undefined && (
            <div className="flex items-center space-x-1">
              <span
                className={`text-sm font-semibold ${
                  isPositive
                    ? "text-green-600"
                    : isNegative
                      ? "text-red-600"
                      : "text-slate-600"
                }`}
              >
                {isPositive && "+"}
                {change}%
              </span>
              <span className="text-sm text-slate-500">vs last month</span>
            </div>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}
