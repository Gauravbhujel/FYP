import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function RecentOrders({ orders }) {
  const orderList = orders && orders.length > 0 ? orders : [];

  const getStatusVariant = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "processing":
        return "warning";
      case "pending":
      default:
        return "default";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
        <a
          href="/vendor/orders"
          className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
        >
          View All
        </a>
      </div>

      {orderList.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <p className="text-sm">No orders yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Order ID
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Customer
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Product
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Amount
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {orderList.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 text-sm font-medium text-slate-800">
                    {order.id}
                  </td>
                  <td className="py-4 text-sm text-slate-700">
                    {order.customer}
                  </td>
                  <td className="py-4 text-sm text-slate-700">{order.product}</td>
                  <td className="py-4 text-sm font-semibold text-slate-800">
                    Rs. {order.amount}
                  </td>
                  <td className="py-4">
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
