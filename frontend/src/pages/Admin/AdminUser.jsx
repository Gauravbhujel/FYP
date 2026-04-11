import React, { useState, useEffect, useRef } from "react";
import {
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  Loader2Icon,
  ShieldOffIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserIcon,
  UsersIcon,
  MailIcon,
  CalendarIcon,
  ChevronDownIcon,
  AlertCircleIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api";

export function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("admin/users/");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to synchronize user records.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendAction = async (userId, action) => {
    try {
      await api.post("admin/users/suspend/", { user_id: userId, action });
      fetchUsers();
      setOpenMenuId(null);
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin": return "bg-rose-100 text-rose-800 border border-rose-200";
      case "vendor": return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "suspended": return "bg-rose-100 text-rose-800 border-rose-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AdminLayout currentPage="users">
      <div className="w-full space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Directory</h1>
            <p className="text-sm text-gray-500 mt-1">Management of all authenticated global accounts</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-gray-700">{users.length} Registered</span>
             </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row items-center gap-4 shadow-sm">
            <div className="flex-1 w-full relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by identity or email..." 
                    className="w-full h-10 pl-10 pr-4 bg-gray-50 hover:bg-white border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder-gray-400"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none min-w-[180px]">
                    <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full h-10 pl-10 pr-10 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 outline-none appearance-none transition-all cursor-pointer hover:border-gray-400"
                    >
                        <option value="all">Any Role</option>
                        <option value="customer">Customer</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Super Admin</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button 
                    onClick={fetchUsers}
                    className="h-10 w-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-50 hover:text-gray-700 active:scale-95 transition-colors"
                >
                    <Loader2Icon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
            </div>
        </div>

        {/* Records Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-gray-50/80 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Identity</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Role</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Joined</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                                    <Loader2Icon className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
                                    Loading directory...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-sm">
                                    <AlertCircleIcon className="w-8 h-8 text-rose-400 mx-auto mb-3" />
                                    <p className="text-rose-600">{error}</p>
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-16 text-center text-sm">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <SearchIcon className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <p className="text-gray-900 font-medium">No users found.</p>
                                    <p className="text-gray-500 text-xs">Try adjusting your filters.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center text-lg font-bold text-indigo-600 shadow-sm border border-indigo-100 flex-shrink-0">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm whitespace-nowrap">{user.name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <MailIcon className="w-3 h-3 text-gray-400" />
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${getRoleBadge(user.role)}`}>
                                            {(user.role || '').charAt(0).toUpperCase() + (user.role || '').slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full w-fit border ${getStatusBadge(user.status)}`}>
                                               {(user.status || '').charAt(0).toUpperCase() + (user.status || '').slice(1)}
                                            </span>
                                            {user.status === "suspended" && user.suspended_until && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <ClockIcon className="w-3 h-3 text-rose-400" />
                                                    <p className="text-[10px] font-medium text-rose-500">
                                                        Until: {new Date(user.suspended_until).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                            <p className="text-xs font-medium">{user.date_joined}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === user.id ? dropdownRef : null}>
                                            <button 
                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                className="w-8 h-8 flex flex-shrink-0 items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-accent/20 cursor-pointer text-gray-500"
                                            >
                                                <MoreVerticalIcon className="w-4 h-4" />
                                            </button>
                                            {openMenuId === user.id && (
                                                <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50 py-1 z-50">
                                                    {user.role !== "admin" ? (
                                                        <div className="p-1 space-y-1">
                                                            {user.status === "suspended" ? (
                                                                <button 
                                                                    onClick={() => handleSuspendAction(user.id, "unsuspend")}
                                                                    className="w-full flex items-center px-3 py-2 text-xs font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer"
                                                                >
                                                                    <ShieldCheckIcon className="w-4 h-4 mr-2 text-emerald-500" /> Unsuspend User
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleSuspendAction(user.id, "suspend")}
                                                                    className="w-full flex items-center px-3 py-2 text-xs font-medium text-amber-700 rounded-md hover:bg-amber-50 transition-colors border-none bg-transparent cursor-pointer"
                                                                >
                                                                    <ShieldOffIcon className="w-4 h-4 mr-2" /> Suspend (24h)
                                                                </button>
                                                            )}
                                                            <div className="h-px bg-gray-100 my-1 mx-2" />
                                                            <button className="w-full flex items-center px-3 py-2 text-xs font-medium text-gray-500 rounded-md hover:bg-gray-50 transition-colors border-none bg-transparent cursor-not-allowed">
                                                                View Audit Log
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="px-3 py-2 text-center">
                                                            <p className="text-[10px] text-gray-400 font-medium">Admin Protected</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination / Footer */}
            {!loading && !error && filteredUsers.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-white text-sm">
                    <span className="text-gray-500">Showing {filteredUsers.length} users</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer font-medium">Prev</button>
                        <button className="px-3 py-1.5 border border-accent bg-accent/10 text-accent rounded-md font-semibold cursor-pointer">1</button>
                        <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 cursor-pointer font-medium disabled:opacity-50">Next</button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
