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

export function AdminLayout({ children, currentPage }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminData, setAdminData] = useState({ name: "Admin User", email: "admin@gearup.com" });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50/50">
      {/* Dark Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-[#0f172a] text-slate-400 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col shadow-2xl shadow-slate-900/40`}
      >
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
                <ShieldCheckIcon className="w-6 h-6 stroke-[2.5px]" />
             </div>
             <div className={`transition-all duration-300 ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 invisible w-0"}`}>
                <h1 className="text-white font-black text-lg tracking-tight leading-none">GearUp</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Management</p>
             </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-8 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <p className={`px-4 text-[10px] font-black text-slate-600 uppercase tracking-[2px] mb-4 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            Main Console
          </p>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center group h-12 px-3 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? "bg-indigo-500/10 text-white shadow-sm" 
                    : "hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                    isActive ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "group-hover:bg-slate-700"
                }`}>
                    <item.icon className={`w-5 h-5 ${isActive ? "stroke-[3px]" : "stroke-2"}`} />
                </div>
                <span className={`ml-3 font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                    isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 invisible w-0"
                }`}>
                  {item.name}
                </span>
                {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-glow" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/50 space-y-2">
           <Link 
              to="/" 
              className={`flex items-center h-12 px-3 rounded-2xl text-slate-500 hover:text-white transition-all ${
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
              className="w-full flex items-center justify-center h-10 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-500 hover:text-white transition-all border-none cursor-pointer"
            >
              {isSidebarOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5 transition-transform hover:scale-110" />}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Top Navbar */}
        <header className="h-20 glass-nav sticky top-0 z-40 px-8 flex items-center justify-between">
           {/* Left: Search */}
           <div className="flex-1 max-w-xl">
              <div className="relative group">
                 <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search anything across the platform..." 
                    className="w-full h-12 pl-12 pr-4 bg-slate-100/50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                 />
              </div>
           </div>

           {/* Right: Actions & Profile */}
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <button className="p-3 text-slate-400 hover:bg-slate-100/50 hover:text-indigo-500 rounded-2xl transition-all relative group">
                      <BellIcon className="w-5 h-5" />
                      <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform" />
                  </button>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 p-1.5 pl-3 hover:bg-slate-100/50 rounded-2xl transition-all border-none cursor-pointer"
                  >
                      <div className="flex flex-col items-end text-right hidden sm:flex">
                         <span className="text-sm font-black text-slate-800 leading-none">System Admin</span>
                         <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter mt-1">Super User</span>
                      </div>
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20 ring-2 ring-white transition-transform active:scale-95">
                          AD
                      </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-4 w-60 bg-white border border-slate-100 rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden py-2 animate-fade-down z-50">
                        <div className="px-5 py-4 border-b border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Account</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{adminData.email}</p>
                        </div>
                        <Link to="/admin/settings" className="flex items-center px-5 py-3.5 text-sm font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">
                            <SettingsIcon className="w-4 h-4 mr-3 text-slate-400" /> System Settings
                        </Link>
                        <div className="h-px bg-slate-50 my-1 mx-5" />
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center px-5 py-3.5 text-sm font-black text-rose-500 hover:bg-rose-50 transition-all uppercase tracking-widest text-[10px] border-none cursor-pointer"
                        >
                            <LogOutIcon className="w-4 h-4 mr-3" /> Log Out Platform
                        </button>
                    </div>
                  )}
              </div>
           </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
