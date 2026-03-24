import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboardIcon,
  UsersIcon,
  StoreIcon,
  PackageIcon,
  ShoppingBagIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  ShieldCheckIcon,
  BellIcon,
  SearchIcon,
  ChevronRightIcon,
  MenuIcon,
  XIcon,
  GlobeIcon
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function AdminLayout({ children, currentPage }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminData, setAdminData] = useState({ name: "Admin User", email: "admin@gearup.com" });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboardIcon, id: "dashboard" },
    { name: "Users", href: "/admin/users", icon: UsersIcon, id: "users" },
    { name: "Vendors", href: "/admin/vendors", icon: StoreIcon, id: "vendors" },
    { name: "Products", href: "/admin/products", icon: PackageIcon, id: "products" },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBagIcon, id: "orders" },
    { name: "Analytics", href: "/admin/reports", icon: BarChart3Icon, id: "reports" },
    { name: "Settings", href: "/admin/settings", icon: SettingsIcon, id: "settings" },
  ];

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

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans">
      {/* Light Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-60" : "w-20"
        } flex flex-col lg:static`}
      >
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <ShieldCheckIcon className="w-6 h-6 text-accent" />
             </div>
             <div className={`transition-all duration-300 ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 invisible w-0"}`}>
                <h1 className="text-gray-900 font-black text-lg tracking-tight leading-none uppercase">GearUp</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Management</p>
             </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-8 space-y-1.5 overflow-y-auto">
          <p className={`px-4 text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            Main Console
          </p>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center group h-12 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-[#F5F5F5] text-accent font-black" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                    isActive ? "text-accent" : "group-hover:text-gray-900"
                }`}>
                    <item.icon className="w-5 h-5" />
                </div>
                <span className={`ml-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 invisible w-0"
                }`}>
                  {item.name}
                </span>
                {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1 h-1 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 space-y-2">
           <Link 
              to="/" 
              className={`flex items-center h-12 px-3 rounded-lg text-gray-400 hover:text-gray-900 transition-all ${
                isSidebarOpen ? "" : "justify-center"
              }`}
            >
                <GlobeIcon className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                    isSidebarOpen ? "opacity-100" : "opacity-0 invisible w-0"
                }`}>
                    Public Store
                </span>
           </Link>
           <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center h-10 rounded-lg hover:bg-gray-50 text-gray-400 transition-all border-none cursor-pointer"
            >
              {isSidebarOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5 transition-transform hover:scale-110" />}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "ml-60 lg:ml-0" : "ml-20 lg:ml-0"}`}>
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-40 px-6 flex items-center justify-between">
           {/* Left: Search */}
           <div className="flex-1 max-w-xl">
              <div className="relative group">
                 <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all placeholder:text-gray-300 shadow-sm"
                 />
              </div>
           </div>

           {/* Right: Actions & Profile */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <button className="p-2.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all relative group border-none bg-transparent cursor-pointer">
                      <BellIcon className="w-4 h-4" />
                      <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent rounded-full border-2 border-white" />
                  </button>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 p-1.5 pl-3 hover:bg-slate-100/50 rounded-2xl transition-all border-none cursor-pointer"
                  >
                      <div className="flex flex-col items-end text-right hidden sm:flex">
                         <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">System Admin</span>
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Super User</span>
                      </div>
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-black text-xs transition-transform group-hover:scale-95">
                          AD
                      </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-4 w-60 bg-white border border-gray-200 rounded-xl shadow-2xl shadow-black/5 overflow-hidden py-2 animate-fade-in z-50">
                        <div className="px-6 py-4 border-b border-gray-50">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Session Account</p>
                            <p className="text-xs font-black text-gray-900 truncate tracking-tight">{adminData.email}</p>
                        </div>
                        <Link to="/admin/settings" className="flex items-center px-6 py-3 text-[10px] font-black text-gray-500 hover:bg-gray-50 uppercase tracking-widest hover:text-gray-900 transition-all">
                            <SettingsIcon className="w-3.5 h-3.5 mr-4" /> System Settings
                        </Link>
                        <div className="h-px bg-gray-50 my-1 mx-4" />
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center px-6 py-3 text-[10px] font-black text-rose-500 hover:bg-rose-50 transition-all uppercase tracking-widest border-none cursor-pointer"
                        >
                            <LogOutIcon className="w-3.5 h-3.5 mr-4" /> Log Out Platform
                        </button>
                    </div>
                  )}
              </div>
           </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
