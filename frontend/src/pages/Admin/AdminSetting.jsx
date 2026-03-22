import React, { useState } from "react";
import {
  GlobeIcon,
  WrenchIcon,
  SaveIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  HardDriveIcon,
  CpuIcon,
  AlertTriangleIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";

const RsIcon = ({ className }) => (
  <span className={`font-black tracking-tighter ${className}`}>Rs</span>
);

export default function AdminSettingsPage() {
  const [platformSettings, setPlatformSettings] = useState({
    siteName: "GearUp Nepal",
    tagline: "Premium Sports Equipment Marketplace",
    supportEmail: "ops@gearupnepal.com",
    contactPhone: "+977 1 4422XXX",
  });

  const [commissionSettings, setCommissionSettings] = useState({
    defaultRate: "10",
    payoutSchedule: "biweekly",
    minimumPayout: "5000",
    payoutMethod: "bank_transfer",
  });

  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handlePlatformChange = (e) => {
    setPlatformSettings({
      ...platformSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleCommissionChange = (e) => {
    setCommissionSettings({
      ...commissionSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Mock save logic
    // In a real app, you'd call api.post('/admin/settings/update', ...)
    alert("System directives updated successfully.");
  };

  return (
    <AdminLayout currentPage="settings">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Console</h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-[2px] leading-none">Global platform configuration and security parameters</p>
          </div>
          <button 
            onClick={handleSave}
            className="h-12 px-8 flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer border-none"
          >
            <SaveIcon className="w-4 h-4" /> Commit Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Navigation / Sidebar */}
            <div className="lg:col-span-1 space-y-4">
                <div className="dashboard-card p-2">
                    <button className="w-full flex items-center gap-4 px-5 py-4 bg-slate-50 text-indigo-600 rounded-xl border-none cursor-pointer">
                        <GlobeIcon className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">General Identity</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-5 py-4 bg-transparent text-slate-400 hover:bg-slate-50 rounded-xl transition-all border-none cursor-pointer">
                        <CreditCardIcon className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Financial Logic</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-5 py-4 bg-transparent text-slate-400 hover:bg-slate-50 rounded-xl transition-all border-none cursor-pointer">
                        <BellIcon className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Alert Protocols</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-5 py-4 bg-transparent text-slate-400 hover:bg-slate-50 rounded-xl transition-all border-none cursor-pointer">
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Infrastructure</span>
                    </button>
                </div>

                <div className="dashboard-card p-6 bg-slate-900 border-none">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                            <CpuIcon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Health</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Uptime</span>
                            <span className="text-[10px] font-black text-emerald-400 tracking-widest">99.98%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full w-[99%] bg-emerald-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Config Panels */}
            <div className="lg:col-span-2 space-y-8">
                {/* General Panel */}
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <GlobeIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800 uppercase tracking-wider">General Identity</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Foundational platform persona</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Platform ID</label>
                                <input 
                                    type="text" 
                                    name="siteName"
                                    value={platformSettings.siteName}
                                    onChange={handlePlatformChange}
                                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Official Tagline</label>
                                <input 
                                    type="text" 
                                    name="tagline"
                                    value={platformSettings.tagline}
                                    onChange={handlePlatformChange}
                                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Security Response Email</label>
                            <input 
                                type="email" 
                                name="supportEmail"
                                value={platformSettings.supportEmail}
                                onChange={handlePlatformChange}
                                className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                {/* Financial Panel */}
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                            <CreditCardIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800 uppercase tracking-wider">Financial Logic</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Commission and payout protocols</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Platform Fee (%)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="defaultRate"
                                    value={commissionSettings.defaultRate}
                                    onChange={handleCommissionChange}
                                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Payout Floor (Rs)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="minimumPayout"
                                    value={commissionSettings.minimumPayout}
                                    onChange={handleCommissionChange}
                                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">NPR</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="dashboard-card p-8 border-rose-100 bg-rose-50/30">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                            <AlertTriangleIcon className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-rose-600 uppercase tracking-wider">Restricted Directives</p>
                            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-1">High-impact administrative actions</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-rose-100 shadow-sm">
                        <div className="max-w-md">
                            <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Ecosystem Suspension</p>
                            <p className="text-[11px] font-bold text-slate-400 leading-relaxed">Instantly toggle maintenance state. All public-facing nodes will redirect to the lock screen.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={maintenanceMode}
                                onChange={() => setMaintenanceMode(!maintenanceMode)}
                                className="sr-only peer" 
                            />
                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500 shadow-inner"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
