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
  ChevronRightIcon,
  MenuIcon,
  XIcon,
  GlobeIcon,
  CoinsIcon,
  SearchIcon,
  ChevronDownIcon
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
    { name: "Earnings", href: "/admin/earnings", icon: CoinsIcon, id: "earnings" },
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
    <div className="flex h-screen bg-[#F5F5F5] font-sans text-gray-900">
      {/* Light Sidebar - Matching Vendor Central style */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-sm ${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col lg:static`}
      >
        {/* Header */}
        <div className="h-20 flex items-center px-6 mb-2">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheckIcon className="w-5 h-5 text-accent" />
             </div>
             <div className={`transition-opacity duration-300 flex flex-col justify-center ${isSidebarOpen ? "opacity-100" : "opacity-0 invisible overflow-hidden"}`}>
                <h1 className="text-gray-900 font-bold text-lg tracking-tight leading-none">GearUp</h1>
                <p className="text-xs text-gray-500 mt-1">Admin Central</p>
             </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href) || (location.pathname === '/admin' && item.id === 'dashboard');
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center h-11 px-3 rounded-lg transition-all group relative ${
                  isActive 
                    ? "bg-accent/10 text-accent font-semibold" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-accent" : "text-gray-400 group-hover:text-gray-700"}`} />
                <span className={`ml-3 transition-opacity duration-300 ${
                    isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible w-0"
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
           <Link 
              to="/" 
              className={`flex items-center h-10 px-3 rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 ${
                isSidebarOpen ? "mb-2" : "justify-center mb-2"
              }`}
            >
                <GlobeIcon className="w-5 h-5 flex-shrink-0 text-gray-400" />
                <span className={`ml-3 font-medium text-sm transition-all duration-300 ${
                    isSidebarOpen ? "opacity-100" : "opacity-0 invisible w-0"
                }`}>
                    Public Store
                </span>
           </Link>
           <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center h-10 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-800 border-none bg-transparent cursor-pointer"
            >
              {isSidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50 ${isSidebarOpen ? "ml-64 lg:ml-0" : "ml-20 lg:ml-0"}`}>
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-6 lg:px-8 flex items-center justify-between shadow-sm">
           
           {/* Search Bar */}
           <div className="flex-1 max-w-xl">
             <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <SearchIcon className="w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
               </div>
               <input 
                 type="text" 
                 placeholder="Search orders, vendors, users..." 
                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all shadow-sm"
               />
               <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                 <span className="text-[10px] font-medium text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">⌘K</span>
               </div>
             </div>
           </div>

           {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4 ml-6">
              <button className="p-2 text-gray-500 rounded-full relative transition-all hover:bg-gray-100 hover:text-gray-700 border-none bg-transparent cursor-pointer">
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <div className="h-8 w-px bg-gray-200 mx-2" />

              <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 transition-all group hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200 cursor-pointer text-left"
                  >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent to-[#ff8c42] flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                          AD
                      </div>
                      <div className="flex flex-col items-start hidden sm:flex">
                         <span className="text-sm font-semibold text-gray-800 leading-tight">Admin User</span>
                         <span className="text-[10px] text-gray-500 font-medium">Super Admin</span>
                      </div>
                      <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg shadow-black/5 overflow-hidden py-1 z-50">
                        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                            <p className="text-sm font-semibold text-gray-900">{adminData.name}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{adminData.email}</p>
                        </div>
                        <div className="p-2 cursor-pointer">
                          <Link to="/admin/settings" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                              <SettingsIcon className="w-4 h-4 mr-3 text-gray-400" /> Account Settings
                          </Link>
                        </div>
                        <div className="h-px bg-gray-100 mx-2" />
                        <div className="p-2 cursor-pointer">
                          <button 
                              onClick={handleLogout}
                              className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border-none bg-transparent text-left"
                          >
                              <LogOutIcon className="w-4 h-4 mr-3 text-red-500" /> Sign out
                          </button>
                        </div>
                    </div>
                  )}
              </div>
           </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
