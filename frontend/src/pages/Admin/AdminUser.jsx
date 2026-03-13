import React, { useState, useEffect, useRef } from "react";
import {
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  Loader2Icon,
  ShieldOffIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "lucide-react";

import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/users/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Network error. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendAction = async (userId, action) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/users/suspend/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ user_id: userId, action }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchUsers(); // Refresh the list
      } else {
        alert(data.error || "Failed to update user status");
      }
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Network error");
    }
    setOpenMenuId(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "warning";
      case "vendor":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const formatSuspendedUntil = (suspendedUntil) => {
    if (!suspendedUntil) return "";
    const date = new Date(suspendedUntil);
    return date.toLocaleString();
  };

  return (
    <AdminLayout currentPage="users">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Manage Users
              </h1>
              <p className="text-slate-600 mt-1">
                {loading ? "Loading..." : `${filteredUsers.length} users found`}
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
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="flex items-center space-x-2">
                <FilterIcon className="w-5 h-5 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="p-6 mb-6 bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-2 text-sm text-red-700 underline hover:text-red-800"
              >
                Try again
              </button>
            </Card>
          )}

          {/* Loading State */}
          {loading ? (
            <Card className="p-12 flex flex-col items-center justify-center">
              <Loader2Icon className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
              <p className="text-slate-500">Loading users...</p>
            </Card>
          ) : (
            /* Users Table */
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Joined Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-8 text-center text-slate-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-800">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {user.email}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <Badge
                              variant={getRoleBadge(user.role)}
                              className="capitalize"
                            >
                              {user.role}
                            </Badge>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(user.status)}`}
                            >
                              {user.status === "suspended" && (
                                <ClockIcon className="w-3 h-3 mr-1" />
                              )}
                              {user.status}
                            </span>
                            {user.status === "suspended" &&
                              user.suspended_until && (
                                <p className="text-xs text-red-500 mt-1">
                                  Until: {formatSuspendedUntil(user.suspended_until)}
                                </p>
                              )}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {user.date_joined}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="relative inline-block" ref={openMenuId === user.id ? menuRef : null}>
                              <button
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === user.id ? null : user.id
                                  )
                                }
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <MoreVerticalIcon className="w-4 h-4 text-slate-500" />
                              </button>

                              {openMenuId === user.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                                  {user.role !== "admin" && (
                                    <>
                                      {user.is_suspended ? (
                                        <button
                                          onClick={() =>
                                            handleSuspendAction(
                                              user.id,
                                              "unsuspend"
                                            )
                                          }
                                          className="flex items-center w-full px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors"
                                        >
                                          <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                          Unsuspend User
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            handleSuspendAction(
                                              user.id,
                                              "suspend"
                                            )
                                          }
                                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                        >
                                          <ShieldOffIcon className="w-4 h-4 mr-2" />
                                          Suspend 24 Hours
                                        </button>
                                      )}
                                    </>
                                  )}
                                  {user.role === "admin" && (
                                    <p className="px-4 py-2.5 text-xs text-slate-400">
                                      No actions available
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
