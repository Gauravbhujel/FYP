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
    <div className="dashboard-card p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-50">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Recent Orders</h3>
        <a
          href="/vendor/orders"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors"
        >
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {orderList.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium text-sm">
                   No orders recorded yet
                </td>
              </tr>
            ) : (
              orderList.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800 tracking-tight">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-600 tracking-tight">{order.customer}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500 font-medium truncate max-w-[150px] inline-block">{order.product}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900 tracking-tight">Rs. {order.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${getStatusStyle(order.status)}`}>
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
