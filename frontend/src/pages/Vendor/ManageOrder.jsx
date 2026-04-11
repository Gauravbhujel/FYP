import React, { useState, useEffect } from "react";
import { SearchIcon, FilterIcon, ChevronDownIcon, PackageIcon, AlertCircleIcon, Loader2Icon, MoreVerticalIcon } from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import api from "../../api";

export function ManageOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("vendor/orders/");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.post("vendor/orders/update-status/", {
        order_id: orderId,
        status: newStatus,
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "shipped":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "processing":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "canceled":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "pending":
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
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
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders</h1>
            <p className="text-sm text-gray-500 font-medium">Manage and track your customer orders ({filteredOrders.length} active)</p>
          </div>
          
        </div>

        {/* Improved Filters/Search Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by ID or customer name..." 
                    className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="lg:col-span-4 relative group">
                <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 appearance-none focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none cursor-pointer shadow-sm"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="canceled">Cancelled</option>
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </div>

        {/* Orders Data Grid */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-sans">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <Loader2Icon className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
                                    <p className="text-sm font-medium text-gray-400">Loading order records...</p>
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-sm font-medium text-gray-400">
                                    {searchQuery || statusFilter !== "all" ? "No orders match your filter criteria." : "You haven't received any orders yet."}
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 group-hover:text-accent transition-colors">{order.id}</span>
                                            <span className="text-[11px] font-medium text-gray-400 mt-1 uppercase tracking-tight">{order.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">{order.customer}</span>
                                            <span className="text-xs font-medium text-gray-500 mt-0.5 truncate max-w-[180px]">{order.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-medium">
                                        <div className="flex flex-col">
                                          <span className="text-sm text-gray-700">{order.product}</span>
                                          <span className="text-xs text-gray-400 mt-0.5">Quantity: {order.quantity} units</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-bold text-gray-900">Rs. {order.amount.toLocaleString()}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 ${order.payment_status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                              <div className={`w-1.5 h-1.5 rounded-full ${order.payment_status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                              {order.payment_status} ({order.payment_method})
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <span className={`px-2.5 min-w-[80px] text-center py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(order.status)} underline-offset-2`}>
                                                {order.status}
                                            </span>
                                            
                                            {order.status !== 'canceled' && order.status !== 'delivered' && (
                                              <div className="relative inline-block">
                                                <button 
                                                  disabled={updatingId === order.id}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === order.id ? null : order.id);
                                                  }}
                                                  className={`p-1.5 rounded-lg transition-all ${
                                                    openMenuId === order.id ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:text-accent hover:bg-accent/5'
                                                  }`}
                                                >
                                                  {updatingId === order.id ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <MoreVerticalIcon size={18} />}
                                                </button>
                                                
                                                {openMenuId === order.id && (
                                                  <div className="absolute right-0 bottom-full mb-2 z-50 min-w-[140px] animate-slide-up">
                                                    <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-2">
                                                      {["processing", "shipped", "delivered"]
                                                        .filter(s => s !== order.status)
                                                        .map(status => (
                                                          <button 
                                                            key={status}
                                                            onClick={() => {
                                                              handleStatusUpdate(order.id, status);
                                                              setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-3 py-2 text-xs font-bold capitalize rounded-lg transition-colors text-gray-600 hover:bg-gray-50 border-none cursor-pointer bg-white mb-1 last:mb-0"
                                                          >
                                                            Set {status}
                                                          </button>
                                                        ))}
                                                    </div>
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
        </div>
      </div>
    </VendorLayout>
  );
}
