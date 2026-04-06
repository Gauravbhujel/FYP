import React, { useState, useEffect } from "react";
import {
  TrendingUpIcon,
  CheckCircle2Icon,
  ClockIcon,
  ArrowDownToLineIcon,
  CreditCardIcon,
  WalletIcon,
  BarChart3Icon
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
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-3">Revenue Ledger</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Complete Financial Tracking & Payout Management</p>
          </div>
          <button className="bg-accent hover:bg-[#EA580C] text-white font-black px-8 py-4 rounded-lg flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-[10px] uppercase tracking-[0.2em] border-none cursor-pointer shadow-lg shadow-accent/20">
            <ArrowDownToLineIcon size={16} /> Request Withdrawal
          </button>
        </div>

        {/* Primary Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-8 bg-gray-900 rounded-xl relative overflow-hidden group shadow-lg flex flex-col justify-between min-h-[200px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                <div className="flex items-center gap-3 relative z-10">
                    <WalletIcon className="w-5 h-5 text-gray-400" />
                    <h2 className="text-[12px] font-black text-white uppercase tracking-[2px]">Core Wallet</h2>
                </div>
                <div className="relative z-10 mt-6">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Ready to Withdraw</p>
                    <p className="text-4xl font-black text-white tracking-tight">Rs. {(stats.available_balance || 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3">
                    <TrendingUpIcon className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">Net Lifetime Yield</h2>
                </div>
                <div className="mt-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Historic Earnings</p>
                    <p className="text-3xl font-black text-emerald-600 tracking-tight">Rs. {(stats.total_earnings || 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-amber-500" />
                    <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">Locked Capital</h2>
                </div>
                <div className="mt-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending Fulfillment</p>
                    <p className="text-3xl font-black text-amber-600 tracking-tight">Rs. {(stats.pending_earnings || 0).toLocaleString()}</p>
                </div>
            </div>
        </div>

        {/* Visual Chart and Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
                <SalesChart data={salesData} />
            </div>
            
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <BarChart3Icon className="w-5 h-5 text-gray-400" />
                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">This Month</h2>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Rolling 30-Day Growth</p>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">Rs. {(stats.this_month_earnings || 0).toLocaleString()}</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Platform Cut</span>
                        <span className="text-[10px] font-black text-rose-500 tracking-tighter border border-rose-100 bg-rose-50 px-2 py-0.5 rounded">5.0% Deducted</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <CreditCardIcon className="w-5 h-5 text-gray-400" />
                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">Payout Routing</h2>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between group">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Wallet</p>
                            <p className="text-sm font-black text-gray-900 tracking-tighter">eSewa API</p>
                        </div>
                        <button className="text-[9px] font-black text-accent uppercase tracking-widest border border-accent/20 bg-accent/5 px-3 py-1.5 rounded cursor-pointer transition-all hover:bg-accent hover:text-white">Edit</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Ledger Breakdown System */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">Financial Event Log</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{allOrders.length} events recorded</p>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left">
                    <thead className="bg-[#F5F5F5] border-b border-gray-200 text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] sticky top-0 z-10">
                        <tr>
                            <th className="px-8 py-5">Event Detail</th>
                            <th className="px-8 py-5">Product Info</th>
                            <th className="px-8 py-5">Gross Input</th>
                            <th className="px-8 py-5 text-rose-500">Platform Comm (5%)</th>
                            <th className="px-8 py-5 text-emerald-600">Net Processed</th>
                            <th className="px-8 py-5 text-right">Liquidity State</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[11px] font-bold text-gray-800">
                        {allOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">Platform ledger is currently empty.</td>
                            </tr>
                        ) : allOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{order.id}</span>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{order.date}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{order.product}</span>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Qty: {order.quantity}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 tracking-tight text-gray-900">Rs. {(order.amount || 0).toLocaleString()}</td>
                                <td className="px-8 py-5 tracking-tight text-rose-500">- Rs. {(order.commission || 0).toLocaleString()}</td>
                                <td className="px-8 py-5 tracking-tight text-emerald-600 font-black">Rs. {(order.vendor_earning || 0).toLocaleString()}</td>
                                <td className="px-8 py-5 text-right">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded text-[8px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${
                                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-500/10' :
                                        order.status === 'canceled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                        'bg-amber-50 text-amber-600 border border-amber-100 shadow-sm shadow-amber-500/10'
                                    }`}>
                                        {order.status === 'delivered' ? 'Cleared' : order.status === 'canceled' ? 'Void' : 'Pending'}
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
