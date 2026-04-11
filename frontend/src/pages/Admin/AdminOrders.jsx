import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  FilterIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  Loader2Icon,
  AlertCircleIcon,
  CalendarIcon,
  UserIcon,
  StoreIcon,
  CreditCardIcon,
  MapPinIcon,
  ExternalLinkIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('admin/orders/list/');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to synchronize with global transaction stream.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.esewa_ref_id && order.esewa_ref_id.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case 'processing':
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case 'pending':
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case 'canceled':
      case 'cancelled':
        return "bg-rose-100 text-rose-800 border border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <AdminLayout currentPage="orders">
      <div className="w-full space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Global Transactions</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive order fulfillment across the platform</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                <ShoppingBagIcon className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-gray-700">
                  {loading ? "..." : orders.length} Orders Recorded
                </span>
             </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row items-center gap-4 shadow-sm">
            <div className="flex-1 w-full relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, User, Vendor, or Product..." 
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
                        <option value="all">Any Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button 
                  onClick={fetchOrders}
                  className="h-10 w-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg transition-colors text-gray-500 cursor-pointer hover:bg-gray-50 hover:text-gray-700 active:scale-95"
                >
                  <Loader2Icon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-gray-50/80 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Order & Product</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Parties</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Transaction</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Payment</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                             <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                    <Loader2Icon className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
                                    <p>Loading transactions...</p>
                                </td>
                             </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircleIcon className="w-8 h-8 text-rose-400" />
                                        <p className="text-sm font-medium text-rose-600">{error}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                            <ShoppingBagIcon className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">No matching orders found.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 shadow-sm border border-gray-200 overflow-hidden group-hover:shadow transition-all">
                                                {order.product.image ? (
                                                  <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                      <ShoppingBagIcon className="w-5 h-5 text-gray-300" />
                                                  </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm whitespace-nowrap">{order.id}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 max-w-[120px] truncate" title={order.product.name}>{order.product.name}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <CalendarIcon className="w-3 h-3 text-gray-400" />
                                                    <p className="text-xs font-medium text-gray-500">{order.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <UserIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 leading-tight">{order.customer.name}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase">Customer</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <StoreIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 leading-tight truncate max-w-[120px]">{order.vendor.store_name}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase">Vendor</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-gray-900">Rs. {order.amount.toLocaleString()}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${order.is_paid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    <span className={`text-xs font-semibold ${order.is_paid ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {order.is_paid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </div>
                                            </div>
                                            {order.shipping_address && (
                                                <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-100">
                                                    <MapPinIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                    <span className="text-xs text-gray-500 truncate max-w-[120px]" title={order.shipping_address}>{order.shipping_address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1 text-sm">
                                            <p className="font-medium text-gray-900">{order.payment_method}</p>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${order.payment_status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <p className={`text-xs font-semibold ${order.payment_status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {order.payment_status}
                                                </p>
                                            </div>
                                            {order.esewa_ref_id && (
                                                <p className="text-[10px] text-gray-400 uppercase mt-1">Ref: {order.esewa_ref_id}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full items-center ${getStatusBadge(order.status)}`}>
                                            {(order.status || '').charAt(0).toUpperCase() + (order.status || '').slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            disabled
                                            className="inline-flex w-8 h-8 items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm text-gray-400 opacity-50 cursor-not-allowed"
                                            title="View Details (Upcoming Feature)"
                                        >
                                            <ExternalLinkIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Footer */}
            {!loading && !error && filteredOrders.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-white text-sm">
                    <span className="text-gray-500">Showing {filteredOrders.length} transactions</span>
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
