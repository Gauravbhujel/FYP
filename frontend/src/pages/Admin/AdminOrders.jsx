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
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'processing':
        return "bg-blue-50 text-blue-600 border-blue-100";
      case 'pending':
        return "bg-amber-50 text-amber-600 border-amber-100";
      case 'canceled':
      case 'cancelled':
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <AdminLayout currentPage="orders">
      <div className="w-full space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Global Transactions</h1>
            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[3px] leading-none">Comprehensive order fulfillment across the platform</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                <ShoppingBagIcon className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                  {loading ? "..." : orders.length} Orders Recorded
                </span>
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
                    placeholder="Search by ID, User, Vendor, or Product..." 
                    className="w-full h-11 pl-11 pr-4 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-accent/5 focus:bg-white focus:border-accent transition-all placeholder:text-gray-300"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none min-w-[180px]">
                    <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-11 pl-11 pr-10 bg-[#F5F5F5] border border-gray-300 rounded text-[10px] font-black text-gray-900 uppercase tracking-widest outline-none appearance-none transition-all cursor-pointer"
                    >
                        <option value="all">Fulfillment Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button 
                  onClick={fetchOrders}
                  className="h-11 w-11 flex items-center justify-center bg-white border border-gray-300 rounded transition-all text-gray-400 cursor-pointer hover:scale-[1.02] active:scale-95 hover:border-gray-400 hover:text-gray-600"
                >
                  <Loader2Icon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] text-left bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-5 font-black border-b border-gray-100">Order & Asset</th>
                            <th className="px-8 py-5 font-black border-b border-gray-100">Parties</th>
                            <th className="px-8 py-5 font-black border-b border-gray-100">Transaction Details</th>
                            <th className="px-8 py-5 font-black border-b border-gray-100">Payment</th>
                            <th className="px-8 py-5 font-black border-b border-gray-100">status</th>
                            <th className="px-8 py-5 font-black border-b border-gray-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                             <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <Loader2Icon className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Retrieving Transaction Stream...</p>
                                </td>
                             </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <AlertCircleIcon className="w-10 h-10 text-rose-300" />
                                        <p className="text-xs font-black text-rose-500 uppercase tracking-widest">{error}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                            <ShoppingBagIcon className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No matching orders in the system</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-gray-50/50 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white rounded overflow-hidden shadow-sm border border-gray-100 group-hover:scale-105 transition-transform flex-shrink-0">
                                                {order.product.image ? (
                                                  <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
                                                      <ShoppingBagIcon className="w-6 h-6" />
                                                  </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 tracking-tight leading-none text-xs uppercase">{order.id}</p>
                                                <p className="text-[9px] font-black text-gray-500 uppercase mt-2">{order.product.name}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <CalendarIcon className="w-3 h-3 text-gray-300" />
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{order.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center text-indigo-400">
                                                    <UserIcon className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-900 uppercase tracking-tight leading-none">{order.customer.name}</p>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Buyer</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded bg-amber-50 flex items-center justify-center text-amber-400">
                                                    <StoreIcon className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-900 uppercase tracking-tight leading-none">{order.vendor.store_name}</p>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Vendor</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-400">
                                                    <CreditCardIcon className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight leading-none">Rs. {order.amount.toLocaleString()}</p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${order.is_paid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                        <p className={`text-[8px] font-black uppercase tracking-widest ${order.is_paid ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                            {order.is_paid ? 'Paid' : 'Unpaid'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {order.shipping_address && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                                                        <MapPinIcon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[120px]">{order.shipping_address}</p>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight leading-none">{order.payment_method}</p>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className={`w-1.5 h-1.5 rounded-full ${order.payment_status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <p className={`text-[8px] font-black uppercase tracking-widest ${order.payment_status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {order.payment_status}
                                                </p>
                                            </div>
                                            {order.esewa_ref_id && (
                                                <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mt-1">Ref: {order.esewa_ref_id}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 bg-white border text-[9px] font-black uppercase tracking-widest shadow-sm rounded ${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button 
                                              disabled
                                              className="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 rounded transition-all shadow-sm text-gray-400 cursor-not-allowed"
                                              title="System View Only"
                                            >
                                                <ExternalLinkIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Table Footer */}
            {!loading && !error && (
              <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Global Order Stream: Active</p>
                  <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                            Delivered: {orders.filter(o => o.status.toLowerCase() === 'delivered').length}
                          </span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                            Pending: {orders.filter(o => o.status.toLowerCase() === 'pending').length}
                          </span>
                      </div>
                  </div>
              </div>
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
