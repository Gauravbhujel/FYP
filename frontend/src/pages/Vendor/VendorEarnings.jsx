import React, { useState, useEffect } from "react";
import {
  TrendingUpIcon,
  CheckCircle2Icon,
  ClockIcon,
  WalletIcon,
  BarChart3Icon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { SalesChart } from "../../components/dashboard/SalesChart";
import api from "../../api";

const VendorEarningsPage = () => {
  const [stats, setStats] = useState({
    total_earnings: 0,
    this_month_earnings: 0,
    pending_earnings: 0,
    available_balance: 0,
  });
  const [allOrders, setAllOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const [statsRes, ordersRes, chartRes] = await Promise.all([
        api.get("vendor/dashboard/stats/"),
        api.get("vendor/orders/"),
        api.get("vendor/dashboard/sales-chart/"),
      ]);

      setStats(statsRes.data);
      setAllOrders(ordersRes.data);
      setSalesData(chartRes.data);
      
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <VendorLayout currentPage="earnings">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout currentPage="earnings">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Store Earnings</h1>
            <p className="text-sm text-gray-500 font-medium">Track your revenue, earnings, and payouts</p>
          </div>
        </div>

        {/* Simple Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-900 rounded-2xl relative overflow-hidden group shadow-lg flex flex-col justify-between h-48">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                <div className="flex items-center justify-between relative z-10">
                    <h2 className="text-xs font-bold text-accent uppercase tracking-widest">Waiting for Payout</h2>
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="relative z-10">
                    <p className="text-3xl font-bold text-white tracking-tight">Rs. {(stats.available_balance || 0).toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium tracking-wide">Money ready to be sent by Admin</p>
                </div>
            </div>

            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between h-48">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Amount Earned</h2>
                    <CheckCircle2Icon className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">Rs. {(stats.total_earnings || 0).toLocaleString()}</p>
                    <p className="text-[11px] font-medium text-gray-400 mt-2 italic">Total sales income from the start</p>
                </div>
            </div>

            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between h-48">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Orders in Progress</h2>
                    <TrendingUpIcon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">Rs. {(stats.pending_earnings || 0).toLocaleString()}</p>
                    <p className="text-[11px] font-medium text-gray-400 mt-2">
                       Money from orders being shipped
                    </p>
                </div>
            </div>
        </div>

        {/* Sales Performance and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-gray-900">Revenue Trajectory</h3>
                    <span className="text-xs font-medium text-gray-400 italic">Last 7 operational days</span>
                  </div>
                  <SalesChart data={salesData} />
                </div>
            </div>
            
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg">
                           <BarChart3Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <h2 className="text-sm font-bold text-gray-900">Current Month</h2>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 tracking-tight">Rs. {(stats.this_month_earnings || 0).toLocaleString()}</p>
                        {stats.prev_month_earnings > 0 ? (
                          <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${stats.mom_growth >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {stats.mom_growth >= 0 ? <ArrowUpIcon size={11} /> : <ArrowDownIcon size={11} />}
                            {stats.mom_growth >= 0 ? '+' : ''}{stats.mom_growth}% vs Rs. {stats.prev_month_earnings.toLocaleString()} last month
                          </p>
                        ) : (
                          <p className="text-xs font-medium text-gray-400 mt-2 italic">First month — no prior data</p>
                        )}
                    </div>
                    <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Platform Fee</span>
                        <span className="text-xs font-bold text-rose-500 border border-rose-100 bg-rose-50 px-2 py-0.5 rounded-full">{stats.commission_rate || 5.0}% flat cut</span>
                    </div>
                </div>

            </div>
        </div>

        {/* Payment History Section */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                <div>
                    <h2 className="text-base font-bold text-gray-900">Payment History</h2>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{allOrders.length} orders found</p>
                </div>
            </div>
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Total Amount</th>
                            <th className="px-6 py-4 text-rose-500/80">Platform Fee</th>
                            <th className="px-6 py-4 text-emerald-600/80">Net Earnings</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-sans">
                        {allOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-20 text-center text-sm font-medium text-gray-400">Financial ledger is currently empty.</td>
                            </tr>
                        ) : allOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 group-hover:text-accent transition-colors">{order.id}</span>
                                        <span className="text-[11px] font-medium text-gray-400 mt-0.5">{order.date}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{order.product}</span>
                                        <span className="text-xs text-gray-400 mt-0.5">Units: {order.quantity}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm font-medium text-gray-900">Rs. {(order.amount || 0).toLocaleString()}</td>
                                <td className="px-6 py-5 text-sm font-medium text-rose-500">- Rs. {(order.commission || 0).toLocaleString()}</td>
                                <td className="px-6 py-5 text-sm font-bold text-emerald-600">Rs. {(order.vendor_earning || 0).toLocaleString()}</td>
                                <td className="px-6 py-5 text-right">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        order.status === 'canceled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                        'bg-amber-50 text-amber-600 border-amber-100 font-bold'
                                    }`}>
                                        {order.status === 'delivered' ? 'Settled' : order.status === 'canceled' ? 'Void' : 'Pending'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorEarningsPage;
