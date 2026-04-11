import React, { useState, useEffect } from "react";
import { 
  BellIcon, 
  SearchIcon, 
  FilterIcon, 
  CalendarIcon, 
  ChevronRightIcon, 
  Loader2Icon, 
  ArrowLeftIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  PackageIcon,
  ActivityIcon,
  ChevronDownIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Link } from "react-router-dom";
import api from "../../api";

export function AdminActivityLogsPage() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await api.get("admin/dashboard/activities/", {
                params: { limit: 50 }
            });
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (action) => {
        const a = (action || "").toUpperCase();
        if (a.includes("PRODUCT")) return <PackageIcon className="w-4 h-4" />;
        if (a.includes("CUSTOMER")) return <UsersIcon className="w-4 h-4" />;
        if (a.includes("ORDER")) return <ShoppingBagIcon className="w-4 h-4" />;
        return <ActivityIcon className="w-4 h-4" />;
    };

    const getIconColor = (action) => {
        const a = (action || "").toUpperCase();
        if (a.includes("PRODUCT")) return "bg-amber-100 text-amber-600 border-amber-200";
        if (a.includes("CUSTOMER")) return "bg-indigo-100 text-indigo-600 border-indigo-200";
        if (a.includes("ORDER")) return "bg-emerald-100 text-emerald-600 border-emerald-200";
        return "bg-gray-100 text-gray-600 border-gray-200";
    };

    const filteredLogs = activities.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || 
            (filterType === "product" && log.action.includes("PRODUCT")) ||
            (filterType === "customer" && log.action.includes("CUSTOMER")) ||
            (filterType === "order" && log.action.includes("ORDER"));
        return matchesSearch && matchesType;
    });

    return (
        <AdminLayout currentPage="dashboard">
            <div className="w-full space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-5">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/dashboard" className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent transition-all shadow-sm">
                            <ArrowLeftIcon className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Activity Registry</h1>
                            <p className="text-sm text-gray-500 mt-1">Complete chronological platform transactional history</p>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search records by keyword..." 
                            className="w-full h-10 pl-10 pr-4 bg-gray-50 hover:bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative min-w-[200px]">
                            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <select 
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full h-10 pl-10 pr-10 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 appearance-none outline-none cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-accent/20"
                            >
                                <option value="all">Everywhere</option>
                                <option value="product">Catalog Events</option>
                                <option value="customer">Users & Access</option>
                                <option value="order">Transactions</option>
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button 
                            onClick={fetchLogs}
                            className="h-10 w-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            <Loader2Icon className={`w-4 h-4 ${loading ? "animate-spin text-accent" : ""}`} />
                        </button>
                    </div>
                </div>

                {/* Registry List */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <Loader2Icon className="w-10 h-10 text-accent animate-spin mb-4" />
                            <p className="text-sm font-medium text-gray-500">Synchronizing system logs...</p>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ActivityIcon className="w-6 h-6 text-gray-300" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">No activity records found</p>
                            <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search query</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredLogs.map((log, i) => (
                                <div key={i} className="group p-5 hover:bg-gray-50/80 transition-all flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shadow-sm group-hover:scale-110 transition-transform ${getIconColor(log.action)}`}>
                                            {getIcon(log.action)}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 tracking-tight">{log.action}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1.5 text-gray-500">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    <span className="text-[11px] font-medium">{log.time}</span>
                                                </div>
                                                <div className="h-1 w-1 rounded-full bg-gray-300" />
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                                                     Authorized
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-gray-400 group-hover:text-accent transition-colors">Details</span>
                                        <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors group-hover:translate-x-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
