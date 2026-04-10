import React from "react";

export function RecentOrders({ orders }) {
  const orderList = orders && orders.length > 0 ? orders : [];

  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "shipped":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "processing":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "canceled":
      case "cancelled":
        return "bg-red-50 text-red-600 border border-red-100";
      case "pending":
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
        <a
          href="/vendor/orders"
          className="text-sm font-medium text-accent hover:underline px-3 py-1.5 rounded-md hover:bg-accent/5 transition-colors"
        >
          View All History
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-left">Transaction ID</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-left">Customer</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-left">Amount</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orderList.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-400 font-medium">
                   No pending transactions
                </td>
              </tr>
            ) : (
              orderList.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{order.customer}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">Rs. {order.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold inline-block capitalize ${getStatusStyle(order.status)}`}>
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
