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
import { useAuth } from "../../context/AuthContext";

export function VendorLayout({ children, currentPage }) {
  const [vendor, setVendor] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

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
    logout();
    navigate("/");
  };

  const navItems = [
    { icon: LayoutGridIcon, label: "Overview", href: "/vendor/dashboard", id: "dashboard" },
    { icon: PackageIcon, label: "Products", href: "/vendor/products", id: "products" },
    { icon: ShoppingBagIcon, label: "Orders", href: "/vendor/orders", id: "orders" },
    { icon: BarChart3Icon, label: "Analytics", href: "/vendor/dashboard", id: "analytics" },
    { icon: TrendingUpIcon, label: "Earnings", href: "/vendor/dashboard", id: "earnings" },
    { icon: SettingsIcon, label: "Store Profile", href: "/vendor/settings", id: "settings" },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        } lg:static`}
      >
        <div className="flex flex-col h-full uppercase tracking-widest font-black text-[10px]">
          {/* Sidebar Header */}
          <div className="h-20 flex items-center px-6 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <StoreIcon className="w-5 h-5 text-accent" />
              </div>
              <div className={`transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 invisible overflow-hidden"}`}>
                <h1 className="text-gray-900 font-black text-sm tracking-tighter uppercase leading-none">GearUp</h1>
                <p className="text-[8px] text-gray-400 uppercase tracking-[0.2em] leading-none mt-1">Vendor Console</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center h-12 px-4 rounded-lg transition-all group ${
                  currentPage === item.id
                    ? "bg-[#F5F5F5] text-accent"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${currentPage === item.id ? "text-accent" : "text-gray-300 group-hover:text-gray-900"}`} />
                <span className={`ml-4 transition-all duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible w-0"}`}>
                  {item.label}
                </span>
                {currentPage === item.id && isSidebarOpen && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-accent"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-100">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center h-10 rounded-lg hover:bg-gray-50 transition-colors text-gray-400"
            >
              {isSidebarOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
          {/* Left Side: Mobile Menu Button + Breadcrumb/Search */}
          <div className="flex items-center gap-6 flex-1">
            <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <MenuIcon className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center max-w-sm w-full relative group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-widest focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-400 shadow-sm"
              />
            </div>
          </div>

          {/* Right Side: Notifications + Profile */}
          <div className="flex items-center gap-6">
            <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg relative transition-all">
              <BellIcon className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent rounded-full border-2 border-white"></span>
            </button>

            <div className="h-6 w-px bg-gray-100"></div>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-4 transition-all group"
              >
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">
                    {vendor?.store_name || "Merchant"}
                  </span>
                  <span className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Store Owner</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-xs transition-transform group-hover:scale-95">
                  {vendor?.store_name?.charAt(0) || "M"}
                </div>
                <ChevronDownIcon className={`w-3 h-3 text-gray-300 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-4 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl shadow-black/10 overflow-hidden py-2 animate-fade-in">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Authenticated Account</p>
                    <p className="text-xs font-black text-gray-900 truncate tracking-tight">{vendor?.email}</p>
                  </div>
                  <Link to="/vendor/settings" className="flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <SettingsIcon className="w-3.5 h-3.5 mr-4" /> Store Profile
                  </Link>
                  <div className="h-px bg-gray-50 mx-4 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOutIcon className="w-3.5 h-3.5 mr-4" /> Log Out Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-y-auto bg-[#F5F5F5] p-6 lg:p-12">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>

  );
}
