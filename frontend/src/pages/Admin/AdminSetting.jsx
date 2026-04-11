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
  <span className={`font-bold ${className}`}>Rs</span>
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
      <div className="w-full space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Console</h1>
            <p className="text-sm text-gray-500 mt-1">Global platform configuration and security parameters</p>
          </div>
          <button 
            onClick={handleSave}
            className="h-10 px-6 flex items-center gap-2 bg-accent text-white rounded-lg font-semibold text-sm shadow-sm cursor-pointer hover:bg-opacity-90 hover:scale-[1.02] active:scale-95 transition-all border-none"
          >
            <SaveIcon className="w-4 h-4" /> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Navigation / Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-accent/5 text-accent rounded-lg transition-all border-none cursor-pointer font-semibold shadow-sm">
                        <GlobeIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Platform Core</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent text-gray-600 rounded-lg transition-all border-none cursor-pointer hover:bg-gray-50 font-medium">
                        <CreditCardIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Economic Logic</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent text-gray-600 rounded-lg transition-all border-none cursor-pointer hover:bg-gray-50 font-medium">
                        <BellIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Alert Protocols</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent text-gray-600 rounded-lg transition-all border-none cursor-pointer hover:bg-gray-50 font-medium">
                        <ShieldCheckIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Security Layer</span>
                    </button>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border-none shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                            <CpuIcon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-sm font-bold text-gray-100">System Health</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-400">Uptime Velocity</span>
                            <span className="font-bold text-emerald-400">99.98%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-[99%] bg-emerald-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Config Panels */}
            <div className="lg:col-span-2 space-y-6">
                {/* General Panel */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
                    <div className="flex items-start md:items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <GlobeIcon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900">Platform Identity</p>
                            <p className="text-sm text-gray-500 mt-1">Foundational platform persona and contact details</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Platform ID</label>
                                <input 
                                    type="text" 
                                    name="siteName"
                                    value={platformSettings.siteName}
                                    onChange={handlePlatformChange}
                                    className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder-gray-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Official Tagline</label>
                                <input 
                                    type="text" 
                                    name="tagline"
                                    value={platformSettings.tagline}
                                    onChange={handlePlatformChange}
                                    className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Security Response Email</label>
                            <input 
                                type="email" 
                                name="supportEmail"
                                value={platformSettings.supportEmail}
                                onChange={handlePlatformChange}
                                className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Financial Panel */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
                    <div className="flex items-start md:items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CreditCardIcon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900">Economic Logic</p>
                            <p className="text-sm text-gray-500 mt-1">Commission rates and vendor payout protocols</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Platform Fee (%)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="defaultRate"
                                    value={commissionSettings.defaultRate}
                                    onChange={handleCommissionChange}
                                    className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder-gray-400"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Payout Floor Limit</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="minimumPayout"
                                    value={commissionSettings.minimumPayout}
                                    onChange={handleCommissionChange}
                                    className="w-full h-10 pl-10 pr-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder-gray-400"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">Rs.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white border border-rose-200 rounded-xl p-6 md:p-8 shadow-sm">
                    <div className="flex items-start md:items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AlertTriangleIcon className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-rose-600">Restricted Directives</p>
                            <p className="text-sm text-rose-400 mt-1">High-impact administrative actions</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-rose-50/50 rounded-xl border border-rose-100">
                        <div className="max-w-md">
                            <p className="text-sm font-bold text-rose-900 mb-1">Ecosystem Suspension (Maintenance)</p>
                            <p className="text-xs font-medium text-rose-600/80 leading-relaxed">Instantly toggle maintenance state. All public-facing nodes will redirect to the lock screen.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input 
                                type="checkbox" 
                                checked={maintenanceMode}
                                onChange={() => setMaintenanceMode(!maintenanceMode)}
                                className="sr-only peer" 
                            />
                            <div className="w-14 h-7 bg-rose-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-rose-500 shadow-inner"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
