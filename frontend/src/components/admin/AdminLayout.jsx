import React from "react";
import {
  LayoutDashboardIcon,
  UsersIcon,
  StoreIcon,
  PackageIcon,
  ShoppingBagIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  ShieldIcon,
} from "lucide-react";

export function AdminLayout({ children, currentPage }) {
  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboardIcon, id: "dashboard" },
    { name: "Users", href: "/admin/users", icon: UsersIcon, id: "users" },
    { name: "Vendors", href: "/admin/vendors", icon: StoreIcon, id: "vendors" },
    { name: "Products", href: "/admin/products", icon: PackageIcon, id: "products" },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBagIcon, id: "orders" },
    { name: "Reports", href: "/admin/reports", icon: BarChart3Icon, id: "reports" },
    { name: "Settings", href: "/admin/settings", icon: SettingsIcon, id: "settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-[#f0fdf4]">
      {/* Sidebar - Instagram Style Collapsible - Green Theme */}
      <aside className="group fixed inset-y-0 left-0 z-50 w-20 bg-white border-r border-emerald-100 flex flex-col transition-all duration-300 ease-in-out hover:w-64 overflow-hidden">
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-transparent group-hover:border-emerald-100">
          {/* Icon only default */}
          <div className="min-w-[32px] flex justify-center group-hover:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <ShieldIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          {/* Full Logo on Hover */}
          <div className="hidden group-hover:flex items-center whitespace-nowrap overflow-hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
              <ShieldIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-800">Admin Panel</h2>
              <p className="text-xs text-emerald-500">GearUpNepal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group-hover:px-4 ${isActive
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
              >
                <div className="min-w-[24px] flex justify-center">
                  <item.icon
                    className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? "stroke-[2.5px] text-emerald-600" : "stroke-2"
                      }`}
                  />
                </div>
                <span
                  className={`ml-4 text-base font-medium whitespace-nowrap overflow-hidden hidden group-hover:block transition-opacity duration-300 ${isActive ? "font-semibold" : ""
                    }`}
                >
                  {item.name}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-4 border-t border-emerald-100 space-y-2">
          {/* Back to Store */}
          <a
            href="/"
            className="flex items-center w-full p-3 rounded-lg transition-all duration-200 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 group-hover:px-4"
          >
            <div className="min-w-[24px] flex justify-center">
              <LayoutDashboardIcon className="w-6 h-6 stroke-2" />
            </div>
            <span className="ml-4 text-base font-medium whitespace-nowrap overflow-hidden hidden group-hover:block transition-opacity duration-300">
              Back to Store
            </span>
          </a>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50 group-hover:px-4"
          >
            <div className="min-w-[24px] flex justify-center">
              <LogOutIcon className="w-6 h-6 stroke-2" />
            </div>
            <span className="ml-4 text-base font-medium whitespace-nowrap overflow-hidden hidden group-hover:block transition-opacity duration-300">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-20 flex flex-col overflow-hidden transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
