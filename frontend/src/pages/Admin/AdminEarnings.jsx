import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api";
import { 
  CoinsIcon, 
  TrendingUpIcon, 
  WalletIcon, 
  ArrowUpRightIcon,
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  Loader2Icon
} from "lucide-react";
import { DateRangePicker } from "../../components/dashboard/DateRangePicker";
import OtpVerificationModal from "../../components/admin/OtpVerificationModal";

export default function AdminEarningsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });

  // OTP Verification State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    fetchVendorEarnings();
  }, [dateRange.start, dateRange.end]);

  const fetchVendorEarnings = async () => {
    try {
      setLoading(true);
      const params = { from_date: dateRange.start, to_date: dateRange.end };
      const res = await api.get("admin/vendors/list/", { params });
      setVendors(res.data);
    } catch (error) {
      console.error("Error fetching vendor earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReleasePayouts = async (e, otpValue = null) => {
    // If no OTP, start the process
    if (!otpValue) {
       if (!window.confirm("Are you sure you want to release payouts for all eligible vendors?")) return;
    }

    try {
      if (otpValue) setOtpVerifying(true);
      else setLoading(true);

      const payload = otpValue ? { otp: otpValue } : {};
      const res = await api.post("admin/vendors/release-payouts/", payload);

      if (res.data.otp_required) {
        setShowOtpModal(true);
        setOtpError("");
      } else {
        alert(res.data.message);
        setShowOtpModal(false);
        fetchVendorEarnings();
      }
    } catch (error) {
      console.error("Error releasing payouts:", error);
      const errorMsg = error.response?.data?.error || "Error releasing payouts";
      if (otpValue) {
        setOtpError(errorMsg);
      } else {
        alert(errorMsg);
      }
    } finally {
      if (otpValue) setOtpVerifying(false);
      else setLoading(false);
    }
  };

  const activeVendors = vendors.filter(v => 
    (v.status === 'active' || v.status === 'approved' || v.status === 'suspended') &&
    (v.store_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = activeVendors.reduce((sum, v) => sum + (v.revenue || 0), 0);
  const totalCommission = activeVendors.reduce((sum, v) => sum + (v.commission || 0), 0);
  const totalPaid = activeVendors.reduce((sum, v) => sum + (v.period_paid || 0), 0);
  const totalPending = activeVendors.reduce((sum, v) => sum + (v.pending_balance || 0), 0);
  const eligibleVendorsCount = activeVendors.filter(v => v.is_eligible).length;

  if (loading && vendors.length === 0) {
    return (
      <AdminLayout currentPage="earnings">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2Icon className="w-10 h-10 text-accent animate-spin" />
          <p className="text-gray-500 font-medium">Synchronizing financial records...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="earnings">
      <div className="w-full space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-5">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Earnings</h1>
              <p className="text-sm text-gray-500 mt-1">Financial breakdown and net payouts across the platform</p>
            </div>
            
            <DateRangePicker 
                start={dateRange.start}
                end={dateRange.end}
                onStartChange={(val) => setDateRange({...dateRange, start: val})}
                onEndChange={(val) => setDateRange({...dateRange, end: val})}
                onClear={() => setDateRange({ start: "", end: "" })}
            />
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={handleReleasePayouts}
                disabled={loading || eligibleVendorsCount === 0}
                className="h-11 px-6 bg-accent text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#EA580C] hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-accent/20 disabled:opacity-50 disabled:hover:scale-100"
             >
                <RefreshCwIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Release Weekly Payouts ({eligibleVendorsCount})
             </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUpIcon className="w-5 h-5 text-accent" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12.5%</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Gross Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">Rs. {totalRevenue.toLocaleString()}</h3>
            <p className="text-xs text-gray-400 mt-2">Platform gross transaction volume</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <ArrowUpRightIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">5% Rate</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Total Commissions</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">Rs. {totalCommission.toLocaleString()}</h3>
            <p className="text-xs text-gray-400 mt-2">Platform net service earnings</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <WalletIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full items-center flex gap-1">Verified</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Paid Earnings</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">Rs. {totalPaid.toLocaleString()}</h3>
            <p className="text-xs text-gray-400 mt-2">Already released to vendors</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm ring-2 ring-accent/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Pending</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Total Pending Payout</p>
            <h3 className="text-2xl font-bold text-accent mt-1">Rs. {totalPending.toLocaleString()}</h3>
            <p className="text-xs text-gray-400 mt-2">Waiting for next weekly release</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-center gap-4">
            <div className="flex-1 w-full relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search vendor earnings by store name..." 
                    className="w-full h-10 pl-10 pr-4 bg-gray-50 hover:bg-white border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder-gray-400"
                />
            </div>
            <div className="flex items-center gap-2">
                <button 
                  onClick={fetchVendorEarnings}
                  className="h-10 px-4 flex items-center gap-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Loader2Icon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Sync Records
                </button>
            </div>
        </div>

        {/* Earnings Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600">
                <tr>
                  <th className="px-6 py-4">Vendor Entity</th>
                  <th className="px-6 py-4 text-right">Sales</th>
                  <th className="px-6 py-4 text-right">Paid</th>
                  <th className="px-6 py-4 text-right">Pending</th>
                  <th className="px-6 py-4 text-right">Pledge Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 italic-off">
                {activeVendors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                <SearchIcon className="w-6 h-6 text-gray-300" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">No matching vendor records found</p>
                        </div>
                    </td>
                  </tr>
                ) : (
                  activeVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 shadow-sm flex-shrink-0">
                            {vendor.store_name?.charAt(0) || 'V'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{vendor.store_name}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-medium tracking-tight">Verified Merchant</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-bold text-gray-900">Rs. {(vendor.revenue || 0).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-semibold text-emerald-600">Rs. {(vendor.period_paid || 0).toLocaleString()}</p>
                        {vendor.last_payout_date && <p className="text-[9px] text-gray-400 mt-0.5">{vendor.last_payout_date}</p>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-bold text-orange-600">Rs. {(vendor.pending_balance || 0).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {vendor.is_eligible ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100 uppercase tracking-tighter">
                            <CheckCircleIcon size={10} /> Eligible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 text-[10px] font-bold text-gray-500 border border-gray-100 uppercase tracking-tighter">
                            Waiting cycle
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          {!loading && activeVendors.length > 0 && (
            <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-xs text-gray-600 font-medium tracking-tight">
                  <span className="font-bold text-accent">{eligibleVendorsCount}</span> Vendors eligible for immediate payout
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                        Liquidity Verified
                      </span>
                    </div>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <p className="text-xs font-semibold text-gray-900">
                      Total Pending: <span className="text-accent">Rs. {totalPending.toLocaleString()}</span>
                    </p>
                </div>
            </div>
          )}
        </div>
      </div>

      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={(otp) => handleReleasePayouts(null, otp)}
        verifying={otpVerifying}
        error={otpError}
      />
    </AdminLayout>
  );
}
