import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api";
import { CoinsIcon } from "lucide-react";

export default function AdminEarningsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorEarnings();
  }, []);

  const fetchVendorEarnings = async () => {
    try {
      setLoading(true);
      const res = await api.get("admin/vendors/list/");
      setVendors(res.data);
    } catch (error) {
      console.error("Error fetching vendor earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout currentPage="earnings">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </AdminLayout>
    );
  }

  const activeVendors = vendors.filter(v => v.status === 'approved' || v.status === 'suspended');

  return (
    <AdminLayout currentPage="earnings">
      <div className="w-full space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Vendor Earnings</h1>
            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[3px] leading-none">Financial Breakdown & Net Payouts</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-2 rounded-lg flex items-center gap-3 border border-gray-300 shadow-sm">
                <CoinsIcon className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Financial Ledger</span>
             </div>
          </div>
        </div>

        {/* Earnings Table */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-[2px]">Vendor Earnings Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F5F5F5] border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Vendor Name</th>
                  <th className="px-6 py-4">Total Sales (Gross)</th>
                  <th className="px-6 py-4">Commission Deducted (5%)</th>
                  <th className="px-6 py-4">Net Earnings (Payout)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[11px] font-bold text-gray-800">
                {activeVendors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400 uppercase tracking-widest">
                      No active vendors found
                    </td>
                  </tr>
                ) : (
                  activeVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-black text-[12px] uppercase">{vendor.store_name}</td>
                      <td className="px-6 py-4 text-gray-900 tracking-tight">Rs. {(vendor.revenue || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-rose-500 tracking-tight">Rs. {(vendor.commission || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-emerald-600 font-black tracking-tight">Rs. {(vendor.payout || 0).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
