import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutGridIcon,
  PackageIcon,
  ShoppingBagIcon,
  SettingsIcon,
  StoreIcon,
} from "lucide-react";

const RsIcon = ({ className }) => (
  <span className={`font-bold flex items-center justify-center ${className}`}>Rs</span>
);

export function VendorLayout({ children, currentPage }) {
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const fetchVendorProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/vendor/profile/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'suspended') {
            alert("Your vendor account has been suspended by the admin.");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("isAuthenticated");
            window.location.href = "/login";
            return;
          }
          setVendor(data);
        } else {
          console.error("Failed to fetch vendor profile");
        }
      } catch (error) {
        console.error("Error fetching vendor profile:", error);
      }
    };

    fetchVendorProfile();
  }, []);

  const navItems = [
    { icon: LayoutGridIcon, label: "Dashboard", href: "/vendor/dashboard", id: "dashboard" },
    { icon: PackageIcon, label: "Products", href: "/vendor/products", id: "products" },
    { icon: ShoppingBagIcon, label: "Orders", href: "/vendor/orders", id: "orders" },
    { icon: RsIcon, label: "Earnings", href: "/vendor/earnings", id: "earnings" },
    { icon: SettingsIcon, label: "Settings", href: "/vendor/settings", id: "settings" },
  ];

  return (
    <div className="flex h-screen bg-[#f0fdf4]">
      {/* Sidebar - Instagram Style Collapsible - Green Theme */}
      <aside className="group fixed inset-y-0 left-0 z-50 w-20 bg-white border-r border-emerald-100 flex flex-col transition-all duration-300 ease-in-out hover:w-64 overflow-hidden">
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-transparent group-hover:border-emerald-100">
          {/* Icon only default */}
          <div className="min-w-[32px] flex justify-center group-hover:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <StoreIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          {/* Full Logo on Hover */}
          <div className="hidden group-hover:flex items-center whitespace-nowrap overflow-hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
              <StoreIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-800">Vendor Panel</h2>
              <p className="text-xs text-emerald-500">GearUpNepal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={currentPage === item.id}
            />
          ))}
        </nav>

        {/* Bottom Profile Section */}
        <div className="px-3 py-4 border-t border-emerald-100">
          <div className="flex items-center w-full p-3 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors group-hover:px-4">
            <div className="w-10 h-10 min-w-[40px] rounded-full bg-emerald-100 flex items-center justify-center">
              <StoreIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="hidden group-hover:block overflow-hidden ml-3">
              <p className="text-sm font-medium text-emerald-800 truncate">
                {vendor?.store_name || "My Store"}
              </p>
              <p className="text-xs text-emerald-500">View Profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-20 flex flex-col overflow-hidden transition-all duration-300">
        {children}
      </div>
    </div>
  );
}

// Internal Sidebar Item Component
const SidebarItem = ({ icon: Icon, label, active, href }) => (
  <Link
    to={href}
    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group-hover:px-4 ${
      active
        ? "text-emerald-700 bg-emerald-50"
        : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
    }`}
  >
    <div className="min-w-[24px] flex justify-center">
      <Icon
        className={`w-6 h-6 transition-transform group-hover:scale-110 ${active ? "stroke-[2.5px] text-emerald-600" : "stroke-2"}`}
      />
    </div>
    <span
      className={`ml-4 text-base font-medium whitespace-nowrap overflow-hidden hidden group-hover:block transition-opacity duration-300 ${active ? "font-semibold" : ""}`}
    >
      {label}
    </span>
  </Link>
);
