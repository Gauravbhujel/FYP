import React, { useState } from "react";
import {
  SearchIcon,
  FilterIcon,
  EyeIcon,
  Trash2Icon,
  Edit2Icon,
} from "lucide-react";

import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const products = [
    {
      id: "PRD-001",
      name: "Pro Running Shoes",
      vendor: "Nike Sports Co.",
      category: "Running",
      price: 129.99,
      stock: 45,
      status: "active",
    },
    {
      id: "PRD-002",
      name: "Professional Basketball",
      vendor: "Spalding Pro",
      category: "Basketball",
      price: 49.99,
      stock: 120,
      status: "active",
    },
    {
      id: "PRD-004",
      name: "Pro Football",
      vendor: "Adidas Pro",
      category: "Football",
      price: 34.99,
      stock: 200,
      status: "active",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      product.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "out_of_stock":
        return "warning";
      case "draft":
        return "default";
      default:
        return "default";
    }
  };

  const formatStatus = (status) => {
    return status.replace("_", " ");
  };

  return (
    <AdminLayout currentPage="products">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Manage Products
              </h1>

              <p className="text-slate-600 mt-1">
                {filteredProducts.length} products across all vendors
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
                    placeholder="Search by product or vendor name..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <FilterIcon className="w-5 h-5 text-slate-400" />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Categories</option>
                  <option value="running">Running</option>
                  <option value="basketball">Basketball</option>
                  <option value="football">Football</option>
                  <option value="tennis">Tennis</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Products Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Product Name
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Vendor
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">
                          {product.name}
                        </p>

                        <p className="text-xs text-slate-500">{product.id}</p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {product.vendor}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {product.category}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        Rs. {product.price.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 20
                                ? "text-orange-600"
                                : "text-slate-700"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          variant={getStatusBadge(product.status)}
                          className="capitalize"
                        >
                          {formatStatus(product.status)}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-blue-600">
                          <EyeIcon className="w-4 h-4" />
                        </button>

                        <button className="p-2 text-slate-400 hover:text-orange-600">
                          <Edit2Icon className="w-4 h-4" />
                        </button>

                        <button className="p-2 text-slate-400 hover:text-red-600">
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
