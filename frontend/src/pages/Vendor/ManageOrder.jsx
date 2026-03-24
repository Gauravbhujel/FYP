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
        return "bg-gray-900 text-white";
      case "shipped":
        return "bg-gray-100 text-gray-900";
      case "processing":
        return "bg-accent/10 text-accent";
      case "pending":
      default:
        return "bg-gray-50 text-gray-400";
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
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-3">Order Management</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
              Operational Fulfillment & Logistics Control ({filteredOrders.length} active)
            </p>
          </div>
          <div className="flex items-center gap-3">
               <button className="h-12 px-8 bg-white border border-gray-200 rounded text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                   Export Data
               </button>
          </div>
        </div>

        {/* Filters/Search Bar */}
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1 group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by ID or Customer..." 
                    className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex gap-4">
                <div className="relative group">
                    <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-14 pl-12 pr-12 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 appearance-none focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none cursor-pointer min-w-[200px]"
                    >
                        <option value="all">Global Filter</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Item Details</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Value</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">State</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-sans">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center uppercase tracking-widest text-[10px] font-black text-gray-300">
                                    No transaction records match criteria
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-8 py-7">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{order.id}</span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">{order.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{order.customer}</span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] truncate max-w-[150px]">{order.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{order.product} <span className="text-gray-300 ml-1">×{order.quantity}</span></span>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className="text-[10px] font-black text-accent uppercase tracking-widest">Rs. {order.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className={`px-3 py-1.5 rounded text-[8px] font-black uppercase tracking-widest inline-block ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <button className="py-2.5 px-6 bg-accent hover:bg-[#E65A00] text-white rounded text-[8px] font-black uppercase tracking-[0.2em] transition-all border-none cursor-pointer">
                                            Manage Order
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Tip Section */}
        <div className="p-10 bg-gray-900 rounded-xl flex items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-150" />
            <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircleIcon className="w-6 h-6 text-accent" />
            </div>
            <div className="relative z-10">
                <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2">Operational Insight</h4>
                <p className="text-xs text-white/70 font-black uppercase tracking-widest leading-relaxed">Processing orders within 24 hours can catalyze revenue growth by up to 20%.</p>
            </div>
        </div>
      </div>
    </VendorLayout>
  );
}
