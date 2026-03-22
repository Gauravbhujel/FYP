import React from "react";
import {
  PlusIcon,
  PackageIcon,
  SettingsIcon,
  BarChart3Icon,
  ChevronRightIcon
} from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  const actions = [
    {
      icon: PlusIcon,
      label: "List Product",
      desc: "Ready to sell something new?",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      href: "/vendor/AddProduct",
    },
    {
      icon: PackageIcon,
      label: "Ship Orders",
      desc: "Check your pending shipments",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      href: "/vendor/orders",
    },
    {
      icon: BarChart3Icon,
      label: "Analytics",
      desc: "Track your store performance",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      href: "/vendor/dashboard",
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      desc: "Manage your store profile",
      color: "text-slate-500",
      bgColor: "bg-slate-50",
      href: "/vendor/settings",
    },
  ];

  return (
    <div className="dashboard-card p-8">
      <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Operation Hub</h3>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.href}
              className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
            >
              <div className={`w-12 h-12 rounded-2xl ${action.bgColor} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className={`w-6 h-6 ${action.color} stroke-[2.5px]`} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-black text-slate-800 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{action.label}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{action.desc}</p>
              </div>

              <ChevronRightIcon className="w-4 h-4 text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-50">
           <div className="bg-slate-900 rounded-3xl p-6 text-white text-center relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-900/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Premium Benefit</p>
                <p className="text-xs font-bold leading-relaxed mb-4">Your store is currently operating at <span className="text-emerald-400">Peak Performance</span></p>
                <button className="w-full h-10 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer">View Upgrade Options</button>
           </div>
      </div>
    </div>
  );
}
