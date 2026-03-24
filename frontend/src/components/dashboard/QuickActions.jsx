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
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
          <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Operation Hub</h3>
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.href}
              className="flex items-center gap-5 p-4 rounded-lg hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100"
            >
              <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center transition-colors group-hover:bg-accent/5 group-hover:text-accent">
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none group-hover:text-accent transition-colors">{action.label}</p>
                <p className="text-[8px] font-black text-gray-400 mt-2 uppercase tracking-[0.2em]">{action.desc}</p>
              </div>

              <ChevronRightIcon className="w-3 h-3 text-gray-200 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
           <div className="bg-gray-900 rounded-lg p-6 text-white text-center relative overflow-hidden group cursor-pointer">
                <p className="text-[8px] font-black text-accent uppercase tracking-[0.2em] mb-2">Service Status</p>
                <p className="text-[10px] font-black leading-relaxed uppercase tracking-widest mb-4">Store integrity is <span className="text-accent underline decoration-2 underline-offset-4">Optimal</span></p>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded border border-white/10 transition-all">Support Desk</button>
           </div>
      </div>
    </div>
  );
}
