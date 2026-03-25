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
  ChevronDownIcon
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
      setError("Failed to synchronize user records with the neural network.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendAction = async (userId, action) => {
    try {
      const response = await api.post("admin/users/suspend/", { user_id: userId, action });
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
      case "admin": return "bg-rose-50 text-rose-600 border-rose-100";
      case "vendor": return "bg-indigo-50 text-indigo-600 border-indigo-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "active": return "bg-emerald-50 text-emerald-600";
      case "suspended": return "bg-rose-50 text-rose-600";
      default: return "bg-slate-50 text-slate-400";
    }
  };

  return (
    <AdminLayout currentPage="users">
      <div className="w-full space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">User Directory</h1>
            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[3px] leading-none">Management of all authenticated global accounts</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                <UsersIcon className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{users.length} Total Registered</span>
             </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col lg:flex-row items-center gap-4 shadow-sm">
            <div className="flex-1 w-full relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by identity, email, or system ID..." 
                    className="w-full h-11 pl-11 pr-4 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-accent/5 focus:bg-white focus:border-accent transition-all placeholder:text-gray-300"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none min-w-[180px]">
                    <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full h-11 pl-11 pr-10 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black text-gray-900 uppercase tracking-widest outline-none appearance-none transition-all cursor-pointer"
                    >
                        <option value="all">All Access</option>
                        <option value="customer">Customer</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Super Admin</option>
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button 
                    onClick={fetchUsers}
                    className="h-11 w-11 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-400 transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 hover:border-gray-400 hover:text-gray-600"
                >
                    <Loader2Icon className={`w-4 h-4 ${loading ? "animate-spin text-accent" : ""}`} />
                </button>
            </div>
        </div>

        {/* Records Table */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] text-left bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-5 font-black border-b border-gray-300">Subject Identity</th>
                            <th className="px-8 py-5 font-black border-b border-gray-300">Access Level</th>
                            <th className="px-8 py-5 font-black border-b border-gray-300">State</th>
                            <th className="px-8 py-5 font-black border-b border-gray-300">Registration</th>
                            <th className="px-8 py-5 font-black border-b border-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                            <SearchIcon className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No matching records found in database</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-gray-50/50 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform uppercase">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 tracking-tight leading-none text-xs uppercase">{user.name}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <MailIcon className="w-3 h-3 text-gray-300" />
                                                    <p className="text-[9px] font-black text-gray-400 uppercase">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 bg-white border text-[9px] font-black uppercase tracking-widest shadow-sm rounded ${getRoleBadge(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-accent' : 'bg-rose-500'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'text-gray-900' : 'text-rose-600'}`}>
                                                    {user.status}
                                                </span>
                                            </div>
                                            {user.status === "suspended" && user.suspended_until && (
                                                <p className="text-[8px] font-black text-rose-400 mt-1 uppercase tracking-tighter">
                                                    Released: {new Date(user.suspended_until).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <CalendarIcon className="w-3 h-3" />
                                            <p className="text-[10px] font-black uppercase tracking-tighter">{user.date_joined}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="relative inline-block" ref={openMenuId === user.id ? dropdownRef : null}>
                                            <button 
                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl transition-all shadow-sm cursor-pointer border-none hover:bg-gray-50 hover:border-gray-200"
                                            >
                                                <MoreVerticalIcon className="w-4 h-4 text-slate-400" />
                                            </button>
                                            {openMenuId === user.id && (
                                                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-lg shadow-xl py-2 z-50 animate-fade-down">
                                                    <p className="px-5 py-3 text-[8px] font-black text-gray-400 uppercase tracking-[2px] border-b border-gray-50">Identity Directives</p>
                                                    
                                                    {user.role !== "admin" ? (
                                                        <>
                                                            {user.status === "suspended" ? (
                                                                <button 
                                                                    onClick={() => handleSuspendAction(user.id, "unsuspend")}
                                                                    className="w-full flex items-center px-5 py-3.5 text-[9px] font-black text-white bg-accent transition-all uppercase tracking-widest border-none cursor-pointer hover:bg-[#EA580C]"
                                                                >
                                                                    <ShieldCheckIcon className="w-4 h-4 mr-3" /> Lift Suspension
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleSuspendAction(user.id, "suspend")}
                                                                    className="w-full flex items-center px-5 py-3.5 text-[9px] font-black text-rose-500 transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer hover:bg-rose-50"
                                                                >
                                                                    <ShieldOffIcon className="w-4 h-4 mr-3" /> Suspend (24h)
                                                                </button>
                                                            )}
                                                            <div className="h-px bg-gray-50 my-1 mx-5" />
                                                            <button className="w-full flex items-center px-5 py-3.5 text-[9px] font-black text-gray-400 transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer">
                                                                Detailed Audit
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="px-5 py-4 text-center">
                                                            <p className="text-[8px] font-black text-gray-400 italic uppercase">Admin Lockdown Active</p>
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
            
            {/* Table Footer */}
            <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-300 flex items-center justify-between">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Global Identity Vault V1.0</p>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">Database Sync: Active</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
