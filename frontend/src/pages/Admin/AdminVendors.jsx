import React, { useState, useEffect, useRef } from "react";
import {
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MoreVerticalIcon,
  Loader2Icon,
  ShieldOffIcon,
  ShieldCheckIcon,
  Trash2Icon,
  StoreIcon,
  PackageIcon,
  TrendingUpIcon,
  CalendarIcon,
  ChevronDownIcon,
  CheckCircle2Icon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api";

export function AdminVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchVendors();
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

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await api.get("admin/vendors/list/");
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorAction = async (vendorId, action) => {
    try {
      await api.post("admin/vendors/update-status/", { 
        vendor_id: vendorId, 
        action 
      });
      fetchVendors();
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
      case "active":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "rejected":
      case "suspended":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-400 border-slate-100";
    }
  };

  return (
    <AdminLayout currentPage="vendors">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Partner Ecosystem</h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-[2px] leading-none">Management and verification of global retail partners</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <StoreIcon className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{vendors.length} Total Partners</span>
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
                    placeholder="Search by store name, owner, or verify ID..." 
                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none min-w-[180px]">
                    <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-12 pl-12 pr-10 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-600 uppercase tracking-widest outline-none appearance-none hover:bg-white transition-all cursor-pointer shadow-sm"
                    >
                        <option value="all">Verification Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Awaiting Sync</option>
                        <option value="rejected">Rejected</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Partners Table */}
        <div className="dashboard-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-left bg-slate-50/50">
                        <tr>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Partner Entity</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Catalog Size</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Gross Revenue</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Verification</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Onboarding</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50 text-right">Directives</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                             <tr>
                                <td colSpan="6" className="px-8 py-20 text-center">
                                    <Loader2Icon className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                                </td>
                             </tr>
                        ) : filteredVendors.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                            <StoreIcon className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No matching partners found in records</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sm font-black text-slate-400 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                                {vendor.storeName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 tracking-tight leading-none text-sm">{vendor.storeName}</p>
                                                <p className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">{vendor.owner} • {vendor.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <PackageIcon className="w-3.5 h-3.5 text-slate-300" />
                                            <span className="text-xs font-black text-slate-600">{vendor.products} SKU's</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <TrendingUpIcon className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-sm font-black text-emerald-600 tracking-tight">Rs. {vendor.revenue.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusBadge(vendor.status)}`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <CalendarIcon className="w-3.5 h-3.5 text-slate-300" />
                                            <span className="text-[11px] font-bold">{vendor.joined}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="relative inline-block" ref={openMenuId === vendor.id ? dropdownRef : null}>
                                            <button 
                                                onClick={() => setOpenMenuId(openMenuId === vendor.id ? null : vendor.id)}
                                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm cursor-pointer border-none"
                                            >
                                                <MoreVerticalIcon className="w-4 h-4 text-slate-400" />
                                            </button>
                                            
                                            {openMenuId === vendor.id && (
                                                <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl shadow-indigo-100/50 py-2 z-50 animate-fade-down">
                                                    <p className="px-5 py-3 text-[9px] font-black text-slate-300 uppercase tracking-[2px] border-b border-slate-50">Partner Directives</p>
                                                    
                                                    {vendor.status === "pending" && (
                                                        <div className="p-2 space-y-1">
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'approve')}
                                                                className="w-full flex items-center px-4 py-3 text-[10px] font-black text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
                                                            >
                                                                <CheckCircleIcon className="w-4 h-4 mr-3" /> Execute Approval
                                                            </button>
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'reject')}
                                                                className="w-full flex items-center px-4 py-3 text-[10px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
                                                            >
                                                                <XCircleIcon className="w-4 h-4 mr-3" /> Terminate Request
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="px-2 space-y-1">
                                                        <button className="w-full flex items-center px-4 py-3 text-[10px] font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer">
                                                            <EyeIcon className="w-4 h-4 mr-3" /> Ecosystem View
                                                        </button>

                                                        {vendor.status === "suspended" ? (
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'unsuspend')}
                                                                className="w-full flex items-center px-4 py-3 text-[10px] font-black text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
                                                            >
                                                                <ShieldCheckIcon className="w-4 h-4 mr-3" /> Lift Suspension
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'suspend')}
                                                                className="w-full flex items-center px-4 py-3 text-[10px] font-black text-amber-600 hover:bg-amber-50 rounded-xl transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
                                                            >
                                                                <ShieldOffIcon className="w-4 h-4 mr-3" /> Suspend Operations
                                                            </button>
                                                        )}

                                                        <div className="h-px bg-slate-50 my-1 mx-3" />
                                                        
                                                        <button 
                                                            onClick={() => handleVendorAction(vendor.id, 'delete')}
                                                            className="w-full flex items-center px-4 py-3 text-[10px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
                                                        >
                                                            <Trash2Icon className="w-4 h-4 mr-3" /> Purge Entity
                                                        </button>
                                                    </div>
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
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-bold">Encrypted Partner Records V3.0</p>
                <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-3.5 h-3.5 text-emerald-500" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Identity Verified</p>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
