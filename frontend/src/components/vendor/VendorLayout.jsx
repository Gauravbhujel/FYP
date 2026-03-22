import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutGridIcon,
  PackageIcon,
  ShoppingBagIcon,
  SettingsIcon,
  StoreIcon,
  BellIcon,
  SearchIcon,
  ChevronDownIcon,
  BarChart3Icon,
  TrendingUpIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

export function VendorLayout({ children, currentPage }) {
  const [vendor, setVendor] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
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
            handleLogout();
            return;
          }
          setVendor(data);
        }
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
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutGridIcon, label: "Dashboard", href: "/vendor/dashboard", id: "dashboard" },
    { icon: PackageIcon, label: "Products", href: "/vendor/products", id: "products" },
    { icon: ShoppingBagIcon, label: "Orders", href: "/vendor/orders", id: "orders" },
    { icon: BarChart3Icon, label: "Analytics", href: "/vendor/dashboard", id: "analytics" },
    { icon: TrendingUpIcon, label: "Earnings", href: "/vendor/dashboard", id: "earnings" },
    { icon: SettingsIcon, label: "Settings", href: "/vendor/settings", id: "settings" },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-[#0f172a] text-slate-300 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        } lg:static`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <StoreIcon className="w-5 h-5 text-white" />
              </div>
              <div className={`transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 invisible overflow-hidden"}`}>
                <h1 className="text-white font-bold text-lg whitespace-nowrap">GearUp Nepal</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">Vendor Console</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center h-11 px-3 rounded-lg transition-colors group ${
                  currentPage === item.id
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${currentPage === item.id ? "text-white" : "text-slate-400 group-hover:text-emerald-400"}`} />
                <span className={`ml-3 font-medium transition-all duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible w-0 overflow-hidden"}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center h-10 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {isSidebarOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 glass-nav sticky top-0 z-40 px-4 flex items-center justify-between">
          {/* Left Side: Mobile Menu Button + Breadcrumb/Search */}
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center max-w-md w-full relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search orders, products..." 
                className="w-full h-10 pl-10 pr-4 bg-slate-100/50 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Right Side: Notifications + Profile */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative transition-colors">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>

            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-semibold text-slate-800 leading-tight">
                    {vendor?.store_name || "Merchant"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Verified Seller</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs ring-2 ring-emerald-500/10">
                  {vendor?.store_name?.charAt(0) || "M"}
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden py-1">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Account</p>
                    <p className="text-sm font-medium text-slate-800 truncate">{vendor?.email}</p>
                  </div>
                  <Link to="/vendor/settings" className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <SettingsIcon className="w-4 h-4 mr-3" /> Store Settings
                  </Link>
                  <div className="h-px bg-slate-50 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <LogOutIcon className="w-4 h-4 mr-3" /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
