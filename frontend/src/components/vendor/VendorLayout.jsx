import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutGridIcon,
  PackageIcon,
  ShoppingBagIcon,
  SettingsIcon,
  StoreIcon,
  BellIcon,
  ChevronDownIcon,
  BarChart3Icon,
  TrendingUpIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  MessageSquareIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import { useChatNotifications } from "../../hooks/useChatNotifications";

export function VendorLayout({ children, currentPage }) {
  const [vendor, setVendor] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { unreadCount } = useChatNotifications();

  useEffect(() => {
    const fetchVendorProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("vendor/profile/");
        const data = response.data;
        if (data.status === 'suspended') {
          alert("Your vendor account has been suspended by the admin.");
          handleLogout();
          return;
        }
        setVendor(data);
      } catch (error) {
        console.error("Error fetching vendor profile:", error);
      }
    };

    fetchVendorProfile();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { icon: LayoutGridIcon, label: "Overview", href: "/vendor/dashboard", id: "dashboard", restrict: false },
    { icon: PackageIcon, label: "Products", href: "/vendor/products", id: "products", restrict: true },
    { icon: ShoppingBagIcon, label: "Orders", href: "/vendor/orders", id: "orders", restrict: true },
    { icon: BarChart3Icon, label: "Reports", href: "/vendor/reports", id: "reports", restrict: true },
    { icon: TrendingUpIcon, label: "Earnings", href: "/vendor/earnings", id: "earnings", restrict: true },
    { icon: MessageSquareIcon, label: "Messages", href: "/chat", id: "chat", restrict: false, badge: unreadCount },
    { icon: SettingsIcon, label: "Store Profile", href: "/vendor/settings", id: "settings", restrict: false },
  ].filter(item => {
    if (!item.restrict) return true;
    return vendor?.status === "approved";
  });

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-sm ${
          isSidebarOpen ? "w-64" : "w-20"
        } lg:static`}
      >
        <div className="flex flex-col h-full font-medium text-sm text-gray-700">
          {/* Sidebar Header */}
          <div className="h-20 flex items-center px-6 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 bg-accent/10 rounded-xl">
                <StoreIcon className="w-5 h-5 text-accent" />
              </div>
              <div className={`transition-opacity duration-300 flex flex-col justify-center ${isSidebarOpen ? "opacity-100" : "opacity-0 invisible overflow-hidden"}`}>
                <h1 className="text-gray-900 font-bold text-lg tracking-tight leading-none">GearUp</h1>
                <p className="text-xs text-gray-500 mt-1">Vendor Central</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center h-11 px-3 rounded-lg transition-all group relative ${
                  currentPage === item.id
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${currentPage === item.id ? "text-accent" : "text-gray-400 group-hover:text-gray-700"}`} />
                <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible w-0"}`}>
                  {item.label}
                </span>
                
                {item.badge > 0 && isSidebarOpen ? (
                  <div className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                    {item.badge}
                  </div>
                ) : null}
                {item.badge > 0 && !isSidebarOpen ? (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                ) : null}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center h-10 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              {isSidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-6 lg:px-8 flex items-center justify-between shadow-sm">
          {/* Left Side: Mobile Menu Button + Breadcrumb/Search */}
          <div className="flex items-center gap-6 flex-1">
            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MenuIcon className="w-5 h-5" />
            </button>
            <div className="hidden md:flex flex-1" />
          </div>

          {/* Right Side: Notifications + Profile */}
          <div className="flex items-center gap-4">


            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 transition-all group hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent to-[#ff8c42] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {vendor?.store_name?.charAt(0) || "M"}
                </div>
                <div className="flex flex-col items-start hidden sm:flex">
                  <span className="text-sm font-semibold text-gray-800 leading-tight">
                    {vendor?.store_name || "Merchant"}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Store Owner</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg shadow-black/5 overflow-hidden py-1 animate-fade-in z-50">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-semibold text-gray-900 truncate">{vendor?.store_name || "Merchant"}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{vendor?.email}</p>
                  </div>
                  <div className="p-2 cursor-pointer">
                    <Link to="/vendor/settings" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <SettingsIcon className="w-4 h-4 mr-3 text-gray-400" /> Store Profile
                    </Link>
                  </div>
                  <div className="h-px bg-gray-100 mx-2"></div>
                  <div className="p-2 cursor-pointer">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOutIcon className="w-4 h-4 mr-3 text-red-500" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>

  );
}
