import React, { useState, useEffect, useRef } from "react";
import {
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  CheckCircle2Icon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
  Trash2Icon,
  EyeIcon
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
    const s = (status || "").toLowerCase();
    switch (s) {
      case "active": 
      case "approved": return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "pending": return "bg-amber-100 text-amber-800 border border-amber-200";
      case "suspended": return "bg-rose-100 text-rose-800 border border-rose-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <AdminLayout currentPage="vendors">
      <div className="w-full space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Management</h1>
            <p className="text-sm text-gray-500 mt-1">Verification and oversight of the global vendor ecosystem</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
                <CheckCircle2Icon className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">{vendors.filter(v => ['active', 'approved'].includes((v.status||'').toLowerCase())).length} Verified Vendors</span>
             </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-center gap-4">
            <div className="flex-1 w-full relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by store name, identity, or email..." 
                    className="w-full h-10 pl-10 pr-4 bg-gray-50 hover:bg-white border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder-gray-400"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none min-w-[180px]">
                    <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-10 pl-10 pr-10 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 outline-none appearance-none transition-all cursor-pointer hover:border-gray-400"
                    >
                        <option value="all">All States</option>
                        <option value="approved">Verified</option>
                        <option value="pending">Awaiting Sync</option>
                        <option value="suspended">Restricted</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Records Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-gray-50/80 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Vendor Entity</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Contact Info</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 text-center">Sales</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 text-center">Commission</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 text-center">Payout</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading && vendors.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">Loading vendors...</td>
                            </tr>
                        ) : filteredVendors.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                            <SearchIcon className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">No matching vendors found</p>
                                        <p className="text-xs text-gray-500">Try adjusting your filters or search terms.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="group hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-accent/10 border border-accent/20 flex flex-shrink-0 items-center justify-center text-lg font-bold text-accent shadow-sm">
                                                {vendor.store_name?.charAt(0) || 'V'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{vendor.store_name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <MapPinIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                    <p className="text-xs text-gray-500 max-w-[120px] truncate">{vendor.address || "Platform Global"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MailIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                <span className="text-xs font-medium">{vendor.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <PhoneIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                <span className="text-xs font-medium">{vendor.phone || "Not specified"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <p className="text-sm font-bold text-gray-900 whitespace-nowrap">Rs. {(vendor.revenue || 0).toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">{vendor.products || 0} Products</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <p className="text-sm font-semibold text-accent whitespace-nowrap">Rs. {(vendor.commission || 0).toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <p className="text-sm font-semibold text-emerald-600 whitespace-nowrap">Rs. {(vendor.payout || 0).toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(vendor.status)}`}>
                                            {(vendor.status || 'Unknown').charAt(0).toUpperCase() + (vendor.status || '').slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === vendor.id ? dropdownRef : null}>
                                            <button 
                                                onClick={() => setOpenMenuId(openMenuId === vendor.id ? null : vendor.id)}
                                                className="w-8 h-8 flex flex-shrink-0 items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-accent/20 cursor-pointer text-gray-500"
                                            >
                                                <MoreVerticalIcon className="w-4 h-4" />
                                            </button>
                                            {openMenuId === vendor.id && (
                                                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50 py-1 z-50">
                                                    
                                                    {vendor.status === "pending" && (
                                                        <div className="p-1.5 space-y-1">
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'approve')}
                                                                className="w-full flex items-center px-3 py-2 text-xs font-medium text-white bg-accent rounded-md hover:opacity-90 transition-opacity cursor-pointer border-none"
                                                            >
                                                                <CheckCircleIcon className="w-4 h-4 mr-2" /> Approve Vendor
                                                            </button>
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'reject')}
                                                                className="w-full flex items-center px-3 py-2 text-xs font-medium text-rose-600 bg-white border border-gray-200 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                                                            >
                                                                <XCircleIcon className="w-4 h-4 mr-2" /> Reject Application
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="p-1.5 space-y-1">
                                                        {(vendor.status).toLowerCase() === "suspended" ? (
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'unsuspend')}
                                                                className="w-full flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors cursor-pointer border-none"
                                                            >
                                                                <ShieldCheckIcon className="w-4 h-4 mr-2 text-emerald-500" /> Lift Suspension
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleVendorAction(vendor.id, 'suspend')}
                                                                className="w-full flex items-center px-3 py-2 text-xs font-medium text-amber-700 bg-white rounded-md hover:bg-amber-50 transition-colors cursor-pointer border-none"
                                                            >
                                                                <ShieldOffIcon className="w-4 h-4 mr-2" /> Suspend Vendor
                                                            </button>
                                                        )}

                                                        <div className="h-px bg-gray-100 my-1 mx-2" />
                                                        
                                                        <button 
                                                            onClick={() => handleVendorAction(vendor.id, 'delete')}
                                                            className="w-full flex items-center px-3 py-2 text-xs font-medium text-rose-600 bg-white rounded-md hover:bg-rose-50 transition-colors cursor-pointer border-none"
                                                        >
                                                            <Trash2Icon className="w-4 h-4 mr-2" /> Terminate Vendor
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
            
            {/* Pagination Footer */}
            {!loading && filteredVendors.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-white text-sm">
                    <span className="text-gray-500">Showing {filteredVendors.length} entries</span>
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
