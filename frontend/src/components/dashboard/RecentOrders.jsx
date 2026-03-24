import React from "react";

export function RecentOrders({ orders }) {
  const orderList = orders && orders.length > 0 ? orders : [];

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-amber-100 text-amber-700";
      case "pending":
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-8 border-b border-gray-100">
        <h3 className="text-sm font-black text-gray-900 tracking-tighter uppercase">Recent Orders</h3>
        <a
          href="/vendor/orders"
          className="text-[10px] font-black text-accent hover:underline uppercase tracking-widest transition-all"
        >
          View All History
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orderList.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-8 py-16 text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                   No pending transactions
                </td>
              </tr>
            ) : (
              orderList.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">#{order.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{order.customer}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">Rs. {order.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-3 py-1.5 rounded text-[8px] font-black uppercase tracking-widest inline-block ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
