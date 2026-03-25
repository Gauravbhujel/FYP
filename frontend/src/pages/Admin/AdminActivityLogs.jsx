import React, { useState, useEffect } from "react";
import { BellIcon, SearchIcon, FilterIcon, CalendarIcon, ChevronRightIcon, Loader2Icon, ArrowLeftIcon, ShoppingBagIcon, UsersIcon, PackageIcon } from "lucide-react";
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
        if (action.includes("PRODUCT")) return <PackageIcon className="w-4 h-4" />;
        if (action.includes("CUSTOMER")) return <UsersIcon className="w-4 h-4" />;
        if (action.includes("ORDER")) return <ShoppingBagIcon className="w-4 h-4" />;
        return <BellIcon className="w-4 h-4" />;
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
            <div className="w-full space-y-8 animate-fade-in pb-20 mt-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/dashboard" className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:text-accent transition-colors shadow-sm">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">Activity Registry</h1>
                            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[3px]">Complete platform transactional history</p>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search activities..." 
                            className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select 
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="h-14 pl-12 pr-12 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 appearance-none outline-none cursor-pointer min-w-[180px]"
                            >
                                <option value="all">Global Logs</option>
                                <option value="product">Product Additions</option>
                                <option value="customer">User Registrations</option>
                                <option value="order">Order Fulfillments</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Registry List */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center text-center">
                            <Loader2Icon className="w-10 h-10 text-accent animate-spin mb-4" />
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[2px]">Synchronizing Security Logs...</p>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="py-32 text-center">
                            <BellIcon className="w-10 h-10 text-gray-100 mx-auto mb-4" />
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No activity records match your parameters</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {filteredLogs.map((log, i) => (
                                <div key={i} className="group p-6 hover:bg-gray-50/50 transition-all flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${log.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                            {getIcon(log.action)}
                                        </div>
                                        <div>
                                            <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">{log.action}</h3>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{log.time}</span>
                                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500" /> Authorized
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-200 group-hover:text-accent transition-colors group-hover:translate-x-1" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
