import React, { useState, useEffect, useRef } from "react";
import {
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  PlusIcon,
  CheckCircle2Icon,
  ClockIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
  Trash2Icon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api";

export function AdminVendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
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
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorAction = async (vendorId, action) => {
    let message = "";
    if (action === "approve" || action === "reject") {
      message = window.prompt(`Enter an optional message for the vendor (${action}):`) || "";
    }

    try {
      await api.post("admin/vendors/update-status/", { vendor_id: vendorId, action, message });
      fetchVendors();
      setOpenMenuId(null);
      if (action === "approve") {
        alert("Account approved successfully.");
      } else if (action === "reject") {
        alert("Account rejected successfully.");
      }
    } catch (err) {
      console.error("Error executing vendor action:", err);
      alert("Failed to process vendor action.");
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch = 
      v.store_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "pending": return "text-amber-600 bg-amber-50 border-amber-100";
      case "suspended": return "text-rose-600 bg-rose-50 border-rose-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <AdminLayout currentPage="vendors">
      <div className="w-full space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Vendor Management</h1>
            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[3px] leading-none">Verification and oversight of the global vendor ecosystem</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                <CheckCircle2Icon className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{vendors.filter(v => v.status === 'active').length} Verified Vendors</span>
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
                    placeholder="Search by store name, identity, or system ID..." 
                    className="w-full h-11 pl-11 pr-4 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-accent/5 focus:bg-white focus:border-accent transition-all placeholder:text-gray-300"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none min-w-[180px]">
                    <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-11 pl-11 pr-10 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black text-gray-900 uppercase tracking-widest outline-none appearance-none transition-all cursor-pointer"
                    >
                        <option value="all">All States</option>
                        <option value="active">Verified</option>
                        <option value="pending">Awaiting Sync</option>
                        <option value="suspended">Restricted</option>
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Records Table */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] text-left bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-5 font-black border-b border-gray-300">Vendor Entity</th>
                            <th className="px-8 py-5 font-black border-b border-gray-300">Contact Vector</th>
                            <th className="px-8 py-5 font-black border-b border-gray-300 text-center">Sales</th>
                            <th className="px-8 py-5 font-black border-b border-gray-300 text-center text-accent">Comm.</th>
                            <th className="px-8 py-5 font-black border-b border-gray-300 text-center text-emerald-600">Payout</th>
                            <th className="px-8 py-5 font-black border-b border-gray-300">Status</th>
                            <th className="px-8 py-5 font-black border-b border-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredVendors.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                            <SearchIcon className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No matching vendors found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="group hover:bg-gray-50/50 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform uppercase">
                                                {vendor.store_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 tracking-tight leading-none text-xs uppercase">{vendor.store_name}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <MapPinIcon className="w-3 h-3 text-gray-300" />
                                                    <p className="text-[9px] font-black text-gray-400 uppercase">{vendor.address || "Global HQ"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <MailIcon className="w-3 h-3 text-gray-400" />
                                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{vendor.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <PhoneIcon className="w-3 h-3 text-gray-400" />
                                                <span className="text-[10px] font-black text-gray-600 tracking-tighter">{vendor.phone || "+977-1-XXXXXX"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <p className="text-[10px] font-black text-gray-900 leading-none">Rs. {(vendor.revenue || 0).toLocaleString()}</p>
                                        <p className="text-[8px] font-black text-gray-400 mt-1 uppercase tracking-tighter">{vendor.products || 0} Products</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-[10px] font-black text-accent tracking-widest">Rs. {(vendor.commission || 0).toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-[10px] font-black text-emerald-600 tracking-widest">Rs. {(vendor.payout || 0).toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 bg-white border text-[9px] font-black uppercase tracking-widest shadow-sm rounded ${getStatusBadge(vendor.status)}`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="relative inline-block" ref={openMenuId === vendor.id ? dropdownRef : null}>
                                            <button 
                                                onClick={() => setOpenMenuId(openMenuId === vendor.id ? null : vendor.id)}
                                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl transition-all shadow-sm cursor-pointer border-none hover:bg-gray-50 hover:scale-[1.02] active:scale-95"
                                            >
                                                <MoreVerticalIcon className="w-4 h-4 text-slate-400" />
                                            </button>
                                            {openMenuId === vendor.id && (
                                                <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-100 rounded-lg shadow-xl py-2 z-50 animate-fade-down text-left">
                                                    <p className="px-5 py-3 text-[8px] font-black text-gray-400 uppercase tracking-[2px] border-b border-gray-50">Vendor Directives</p>
                                                    
                                                    {vendor.status === "pending" && (
                                                        <div className="p-2 space-y-1">
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'approve')}
                                                                className="w-full flex items-center px-4 py-3 text-[9px] font-black text-white bg-accent rounded transition-all uppercase tracking-widest border-none cursor-pointer hover:bg-[#EA580C] hover:scale-[1.02] active:scale-95"
                                                            >
                                                                <CheckCircleIcon className="w-4 h-4 mr-3" /> Execute Approval
                                                            </button>
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'reject')}
                                                                className="w-full flex items-center px-4 py-3 text-[9px] font-black text-rose-500 rounded transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer hover:bg-rose-50 hover:scale-[1.02] active:scale-95"
                                                            >
                                                                <XCircleIcon className="w-4 h-4 mr-3" /> Terminate Request
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="px-2 space-y-1">
                                                        <button className="w-full flex items-center px-4 py-3 text-[9px] font-black text-gray-900 rounded transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer">
                                                            <EyeIcon className="w-4 h-4 mr-3 text-gray-400" /> Ecosystem View
                                                        </button>

                                                        {vendor.status === "suspended" ? (
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'unsuspend')}
                                                                className="w-full flex items-center px-4 py-3 text-[9px] font-black text-gray-900 rounded transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
                                                            >
                                                                <ShieldCheckIcon className="w-4 h-4 mr-3 text-accent" /> Lift Suspension
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'suspend')}
                                                                className="w-full flex items-center px-4 py-3 text-[9px] font-black text-amber-600 rounded transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
                                                            >
                                                                <ShieldOffIcon className="w-4 h-4 mr-3" /> Suspend Operations
                                                            </button>
                                                        )}

                                                        <div className="h-px bg-gray-50 my-1 mx-3" />
                                                        
                                                        <button 
                                                            onClick={() => handleVendorAction(vendor.id, 'delete')}
                                                            className="w-full flex items-center px-4 py-3 text-[9px] font-black text-rose-500 rounded transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
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
            <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-300 flex items-center justify-between">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Global Vendor Registry V1.0</p>
                <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-3.5 h-3.5 text-accent" />
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Ecosystem Verified</p>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
