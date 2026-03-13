import React, { useState } from "react";
import { SearchIcon, FilterIcon } from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function ManageOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const orders = [
    {
      id: "#ORD-1234",
      customer: "John Smith",
      product: "Pro Running Shoes",
      quantity: 1,
      amount: 129.99,
      status: "pending",
      date: "2024-01-15",
      address: "123 Main St, New York, NY",
    },
    {
      id: "#ORD-1235",
      customer: "Sarah Johnson",
      product: "Basketball Pro",
      quantity: 2,
      amount: 99.98,
      status: "processing",
      date: "2024-01-15",
      address: "456 Oak Ave, Los Angeles, CA",
    },
    {
      id: "#ORD-1236",
      customer: "Mike Davis",
      product: "Yoga Mat Premium",
      quantity: 1,
      amount: 39.99,
      status: "shipped",
      date: "2024-01-14",
      address: "789 Pine Rd, Chicago, IL",
    },
    {
      id: "#ORD-1237",
      customer: "Emily Brown",
      product: "Dumbbells Set",
      quantity: 1,
      amount: 299.99,
      status: "delivered",
      date: "2024-01-14",
      address: "321 Elm St, Houston, TX",
    },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "processing":
        return "warning";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <VendorLayout currentPage="orders">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Manage Orders
              </h1>
              <p className="text-slate-600 mt-1">
                {filteredOrders.length} orders found
              </p>
            </div>


          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search orders..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <FilterIcon className="w-5 h-5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Orders Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {order.id}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {order.customer}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.address}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {order.product}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {order.quantity}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        Rs. {order.amount}
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {order.date}
                      </td>

                      <td className="px-6 py-4">
                        <select className="px-3 py-1 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500">
                          <option value="">Update Status</option>
                          <option value="processing">Mark Processing</option>
                          <option value="shipped">Mark Shipped</option>
                          <option value="delivered">Mark Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </VendorLayout>
  );
}
