import React, { useState } from "react";
import { SearchIcon, FilterIcon, CalendarIcon, ChevronDownIcon, PackageIcon, AlertCircleIcon } from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";

export function ManageOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const orders = [
    {
      id: "#ORD-1234",
      customer: "John Smith",
      product: "Pro Running Shoes",
      quantity: 1,
      amount: 4500,
      status: "pending",
      date: "2024-03-22",
      address: "Baneshwor, Kathmandu",
    },
    {
      id: "#ORD-1235",
      customer: "Sarah Johnson",
      product: "Basketball Pro",
      quantity: 2,
      amount: 8000,
      status: "processing",
      date: "2024-03-21",
      address: "Pokhara, Kaski",
    },
    {
      id: "#ORD-1236",
      customer: "Mike Davis",
      product: "Yoga Mat Premium",
      quantity: 1,
      amount: 2500,
      status: "shipped",
      date: "2024-03-20",
      address: "Dharan, Sunsari",
    },
    {
      id: "#ORD-1237",
      customer: "Emily Brown",
      product: "Dumbbells Set",
      quantity: 1,
      amount: 15000,
      status: "delivered",
      date: "2024-03-19",
      address: "Butwal, Rupandehi",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "shipped":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "processing":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "pending":
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <VendorLayout currentPage="orders">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Order Management</h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">
              Track and fulfillment your customer orders ({filteredOrders.length} Found)
            </p>
          </div>
          <div className="flex items-center gap-2">
               <button className="h-12 px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                   <CalendarIcon className="w-4 h-4" /> This Month
               </button>
          </div>
        </div>

        {/* Filters/Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search by Order ID or Customer name..." 
                    className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex gap-4">
                <div className="relative">
                    <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-12 pl-11 pr-10 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 appearance-none focus:ring-4 focus:ring-emerald-500/10 outline-none cursor-pointer min-w-[180px]"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Orders Table */}
        <div className="dashboard-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Info</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Details</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <PackageIcon className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm">No orders match your criteria</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-800 tracking-tight">{order.id}</span>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                                                <CalendarIcon className="w-3 h-3" /> {order.date}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{order.customer}</span>
                                            <span className="text-[10px] font-medium text-slate-400 mt-0.5">{order.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500">
                                                {order.quantity}x
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 truncate max-w-[150px]">{order.product}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-slate-900">Rs. {order.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="relative inline-block text-left group/drop">
                                            <button className="h-9 px-4 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border-none cursor-pointer">
                                                Update <ChevronDownIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Tip Section */}
        <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertCircleIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
                <h4 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-0.5">Fulfillment Tip</h4>
                <p className="text-sm text-emerald-700/80 font-medium">Processing orders within 24 hours increases your store's "Delivery Performance" score by up to 20%.</p>
            </div>
        </div>
      </div>
    </VendorLayout>
  );
}
