import React from "react";
import {
  PlusIcon,
  PackageIcon,
  SettingsIcon,
  BarChart3Icon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";

export function QuickActions() {
  const actions = [
    {
      icon: PlusIcon,
      label: "Add Product",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/vendor/AddProduct",
    },
    {
      icon: PackageIcon,
      label: "Manage Orders",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/vendor/orders",
    },
    {
      icon: BarChart3Icon,
      label: "View Analytics",
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/vendor/analytics",
    },
    {
      icon: SettingsIcon,
      label: "Store Settings",
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      href: "/vendor/settings",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>

      <div className="space-y-2">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <Link
              key={index}
              to={action.href}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>

              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
