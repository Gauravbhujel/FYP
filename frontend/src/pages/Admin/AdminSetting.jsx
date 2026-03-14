import React, { useState } from "react";
import {
  GlobeIcon,
  WrenchIcon,
  SaveIcon,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const RsIcon = ({ className }) => (
  <span className={`font-bold flex items-center justify-center ${className}`}>Rs</span>
);

const AdminSettingsPage = () => {
  const [platformSettings, setPlatformSettings] = useState({
    siteName: "SportHub",
    tagline: "Premium Sports Equipment Marketplace",
    supportEmail: "support@sporthub.com",
    contactPhone: "+1 (555) 000-1234",
  });

  const [commissionSettings, setCommissionSettings] = useState({
    defaultRate: "10",
    payoutSchedule: "biweekly",
    minimumPayout: "50",
    payoutMethod: "bank_transfer",
  });

  const [notifications, setNotifications] = useState({
    newVendor: true,
    newOrder: true,
    lowStock: true,
    vendorPayout: true,
    userReport: true,
    systemAlerts: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: "30",
    loginAttempts: "5",
    ipWhitelist: false,
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

  const handleNotificationToggle = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handleSave = () => {
    console.log("Settings saved:", {
      platformSettings,
      commissionSettings,
      notifications,
      security,
      maintenanceMode,
    });
  };

  return (
    <AdminLayout currentPage="settings">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Platform Settings
              </h1>
              <p className="text-slate-600 mt-1">
                Configure your marketplace preferences
              </p>
            </div>


          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* General Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <GlobeIcon className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-slate-800">
                General Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={platformSettings.siteName}
                  onChange={handlePlatformChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={platformSettings.tagline}
                  onChange={handlePlatformChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </Card>

          {/* Commission Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <RsIcon className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-slate-800">
                Commission & Payouts
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Default Commission Rate (%)
                </label>
                <input
                  type="number"
                  name="defaultRate"
                  value={commissionSettings.defaultRate}
                  onChange={handleCommissionChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Minimum Payout (Rs)
                </label>
                <input
                  type="number"
                  name="minimumPayout"
                  value={commissionSettings.minimumPayout}
                  onChange={handleCommissionChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </Card>

          {/* Maintenance Mode */}
          <Card className="p-6 border-2 border-red-200">
            <div className="flex items-center space-x-2 mb-6">
              <WrenchIcon className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-slate-800">Danger Zone</h2>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">Maintenance Mode</p>
                <p className="text-sm text-red-600">
                  When enabled the platform will be unavailable
                </p>
              </div>

              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={() => setMaintenanceMode(!maintenanceMode)}
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3 px-6 pb-8">
            <Button
              variant="outline"
              size="md"
              className="px-6 py-2.5 rounded-lg font-semibold border-slate-300 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
              onClick={() => window.location.reload()}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex items-center space-x-2 bg-primary hover:bg-secondary text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 border-none"
              onClick={handleSave}
            >
              <SaveIcon className="w-5 h-5" />
              <span>Save All Changes</span>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
