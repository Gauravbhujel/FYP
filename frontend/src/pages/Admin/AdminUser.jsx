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
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Identity Directory</h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-[2px] leading-none">Management of all authenticated global accounts</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <UsersIcon className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{users.length} Total Registered</span>
             </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="dashboard-card p-4 flex flex-col lg:flex-row items-center gap-4">
            <div className="flex-1 w-full relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by identity, email, or system ID..." 
                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none min-w-[160px]">
                    <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full h-12 pl-12 pr-10 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-600 uppercase tracking-widest outline-none appearance-none hover:bg-white transition-all cursor-pointer shadow-sm"
                    >
                        <option value="all">All Access</option>
                        <option value="customer">Customer</option>
                        <option value="vendor">Partner</option>
                        <option value="admin">Super Admin</option>
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <button 
                    onClick={fetchUsers}
                    className="h-12 w-12 flex items-center justify-center bg-white border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-500 transition-all shadow-sm cursor-pointer"
                >
                    <Loader2Icon className={`w-5 h-5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
                </button>
            </div>
        </div>

        {/* Records Table */}
        <div className="dashboard-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-left bg-slate-50/50">
                        <tr>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Subject Identity</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Access Level</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">State</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Registration</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50 text-right">Directives</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
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
                                <tr key={user.id} className="group hover:bg-indigo-50/30 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sm font-black text-indigo-500 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform ring-4 ring-transparent group-hover:ring-indigo-50">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 tracking-tight leading-none text-sm">{user.name}</p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <MailIcon className="w-3 h-3 text-slate-300" />
                                                    <p className="text-[11px] font-bold text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${getRoleBadge(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {user.status}
                                                </span>
                                            </div>
                                            {user.status === "suspended" && user.suspended_until && (
                                                <p className="text-[9px] font-bold text-rose-400 mt-1 uppercase tracking-tighter">
                                                    Released: {new Date(user.suspended_until).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-3 h-3 text-slate-300" />
                                            <p className="text-[11px] font-bold text-slate-500">{user.date_joined}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="relative inline-block" ref={openMenuId === user.id ? dropdownRef : null}>
                                            <button 
                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm cursor-pointer border-none"
                                            >
                                                <MoreVerticalIcon className="w-4 h-4 text-slate-400" />
                                            </button>
                                            {openMenuId === user.id && (
                                                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl shadow-indigo-100/50 py-2 z-50 animate-fade-down">
                                                    <p className="px-5 py-3 text-[9px] font-black text-slate-300 uppercase tracking-[2px] border-b border-slate-50">Identity Directives</p>
                                                    
                                                    {user.role !== "admin" ? (
                                                        <>
                                                            {user.status === "suspended" ? (
                                                                <button 
                                                                    onClick={() => handleSuspendAction(user.id, "unsuspend")}
                                                                    className="w-full flex items-center px-5 py-3.5 text-xs font-black text-emerald-600 hover:bg-emerald-50 transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
                                                                >
                                                                    <ShieldCheckIcon className="w-4 h-4 mr-3" /> Lift Suspension
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleSuspendAction(user.id, "suspend")}
                                                                    className="w-full flex items-center px-5 py-3.5 text-xs font-black text-rose-500 hover:bg-rose-50 transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
                                                                >
                                                                    <ShieldOffIcon className="w-4 h-4 mr-3" /> Suspend (24h)
                                                                </button>
                                                            )}
                                                            <div className="h-px bg-slate-50 my-1 mx-5" />
                                                            <button className="w-full flex items-center px-5 py-3.5 text-xs font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer">
                                                                Detailed Audit
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="px-5 py-4 text-center">
                                                            <p className="text-[10px] font-bold text-slate-400 italic">No directives available for Super Admins</p>
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
            <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100/50 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-bold">End of directory records</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Database Sync Active</p>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
