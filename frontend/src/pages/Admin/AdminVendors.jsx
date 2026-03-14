import React, { useState, useEffect, useRef } from "react";
import {
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MoreVerticalIcon,
  ShieldOffIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from "lucide-react";

import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function AdminVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/vendors/list/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleVendorAction = async (vendorId, action) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/vendors/update-status/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ vendor_id: vendorId, action }),
      });

      if (response.ok) {
        alert(`Vendor ${action}d successfully`);
        fetchVendors();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Network error. Make sure the backend is running.");
    }
    setOpenMenuId(null);
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.owner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || vendor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
      case "suspended":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <AdminLayout currentPage="vendors">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Manage Vendors
              </h1>

              <p className="text-slate-600 mt-1">
                {filteredVendors.length} vendors found
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
                    placeholder="Search by store or owner name..."
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
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending Approval</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Vendors Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Store Info
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Products
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Total Revenue
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">
                          {vendor.storeName}
                        </p>

                        <p className="text-xs text-slate-500">
                          {vendor.owner} • {vendor.email}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {vendor.products}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        Rs. {vendor.revenue.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          variant={getStatusBadge(vendor.status)}
                          className="capitalize"
                        >
                          {vendor.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {vendor.joined}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block text-left" ref={openMenuId === vendor.id ? menuRef : null}>
                          <button
                            onClick={() =>
                              setOpenMenuId(openMenuId === vendor.id ? null : vendor.id)
                            }
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                          </button>

                          {openMenuId === vendor.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                              {vendor.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleVendorAction(vendor.id, 'approve')}
                                    className="flex items-center w-full px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors"
                                  >
                                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                                    Approve Vendor
                                  </button>
                                  <button
                                    onClick={() => handleVendorAction(vendor.id, 'reject')}
                                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                  >
                                    <XCircleIcon className="w-4 h-4 mr-2" />
                                    Reject Vendor
                                  </button>
                                  <div className="border-t border-slate-100 my-1"></div>
                                </>
                              )}
                              
                              <button className="flex items-center w-full px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-50 transition-colors">
                                <EyeIcon className="w-4 h-4 mr-2" />
                                View Details
                              </button>

                              {vendor.status === "suspended" ? (
                                <button
                                  onClick={() => handleVendorAction(vendor.id, 'unsuspend')}
                                  className="flex items-center w-full px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors"
                                >
                                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                  Unsuspend Vendor
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleVendorAction(vendor.id, 'suspend')}
                                  className="flex items-center w-full px-4 py-2.5 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
                                >
                                  <ShieldOffIcon className="w-4 h-4 mr-2" />
                                  Suspend Vendor
                                </button>
                              )}

                              <button
                                onClick={() => handleVendorAction(vendor.id, 'delete')}
                                className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors"
                              >
                                <Trash2Icon className="w-4 h-4 mr-2" />
                                Delete Vendor
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredVendors.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No vendors found matching your criteria.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
