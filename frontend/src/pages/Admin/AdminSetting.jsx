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
      <div className="w-full space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">System Console</h1>
            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[3px] leading-none">Global platform configuration and security parameters</p>
          </div>
          <button 
            onClick={handleSave}
            className="h-11 px-8 flex items-center gap-3 bg-accent text-white rounded font-black text-[10px] uppercase tracking-widest shadow-sm cursor-pointer border-none transition-all hover:bg-[#EA580C] hover:scale-[1.02] active:scale-95"
          >
            <SaveIcon className="w-4 h-4" /> Commit Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Navigation / Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
                    <button className="w-full flex items-center gap-4 px-5 py-4 bg-[#F5F5F5] text-accent rounded transition-all border-none cursor-pointer">
                        <GlobeIcon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Platform Core</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-5 py-4 bg-transparent text-gray-400 rounded transition-all border-none cursor-pointer">
                        <CreditCardIcon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Economic Logic</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-5 py-4 bg-transparent text-gray-400 rounded transition-all border-none cursor-pointer">
                        <BellIcon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Alert Protocols</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-5 py-4 bg-transparent text-gray-400 rounded transition-all border-none cursor-pointer">
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Security Layer</span>
                    </button>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 border-none shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                            <CpuIcon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Health</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Uptime Velocity</span>
                            <span className="text-[10px] font-black text-emerald-400 tracking-widest">99.98%</span>
                        </div>
                        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-[99%] bg-emerald-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Config Panels */}
            <div className="lg:col-span-2 space-y-8">
                {/* General Panel */}
                <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center">
                            <GlobeIcon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase">Platform Identity</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Foundational platform persona</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Platform ID</label>
                                <input 
                                    type="text" 
                                    name="siteName"
                                    value={platformSettings.siteName}
                                    onChange={handlePlatformChange}
                                    className="w-full h-11 px-5 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-accent/5 focus:bg-white focus:border-accent transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Official Tagline</label>
                                <input 
                                    type="text" 
                                    name="tagline"
                                    value={platformSettings.tagline}
                                    onChange={handlePlatformChange}
                                    className="w-full h-11 px-5 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-accent/5 focus:bg-white focus:border-accent transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Security Response Email</label>
                            <input 
                                type="email" 
                                name="supportEmail"
                                value={platformSettings.supportEmail}
                                onChange={handlePlatformChange}
                                className="w-full h-11 px-5 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-accent/5 focus:bg-white focus:border-accent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Financial Panel */}
                <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center">
                            <CreditCardIcon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase">Economic Logic</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Commission and payout protocols</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Platform Fee (%)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="defaultRate"
                                    value={commissionSettings.defaultRate}
                                    onChange={handleCommissionChange}
                                    className="w-full h-11 px-5 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-accent/5 focus:bg-white focus:border-accent transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">%</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Payout Floor (Rs)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="minimumPayout"
                                    value={commissionSettings.minimumPayout}
                                    onChange={handleCommissionChange}
                                    className="w-full h-11 px-5 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-400 uppercase tracking-widest">NPR</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white border text-rose-600 border-rose-100 rounded-lg p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-rose-50 rounded flex items-center justify-center">
                            <AlertTriangleIcon className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-rose-600 uppercase">Restricted Directives</p>
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">High-impact administrative actions</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-rose-50/30 rounded border border-rose-100">
                        <div className="max-w-md">
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2">Ecosystem Suspension</p>
                            <p className="text-[9px] font-black text-rose-500/60 leading-relaxed uppercase tracking-widest">Instantly toggle maintenance state. All public-facing nodes will redirect to the lock screen.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={maintenanceMode}
                                onChange={() => setMaintenanceMode(!maintenanceMode)}
                                className="sr-only peer" 
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
