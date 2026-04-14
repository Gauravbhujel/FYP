import React, { useState, useEffect } from "react";
import {
  TrendingUpIcon,
  ShoppingBagIcon,
  UsersIcon,
  CalendarIcon,
  ChevronDownIcon,
  BarChart3Icon,
  PieChartIcon,
  Loader2Icon,
  DownloadIcon,
  BoxIcon,
  SearchIcon,
  FilterIcon,
  LineChartIcon,
  MoreHorizontalIcon,
  ArrowUpDownIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { DateRangePicker } from "../../components/dashboard/DateRangePicker";
import api from "../../api";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

const RsIcon = ({ className }) => (
  <span className={`font-semibold tracking-tight ${className}`}>Rs</span>
);

// Production trend visualization logic

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState("sales");
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  const [salesData, setSalesData] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [customersData, setCustomersData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab, dateRange.start, dateRange.end]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { from_date: dateRange.start, to_date: dateRange.end };
      
      if (activeTab === "sales") {
        const response = await api.get("admin/reports/sales/", { params });
        setSalesData(response.data);
      } else if (activeTab === "orders") {
        const response = await api.get("admin/reports/orders/", { params });
        setOrdersData(response.data);
      } else if (activeTab === "products") {
        const response = await api.get("admin/reports/products/", { params });
        setProductsData(response.data);
      } else if (activeTab === "customers") {
        const response = await api.get("admin/reports/customers/", { params });
        setCustomersData(response.data);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    let headers = [];
    let rows = [];
    let filename = `report_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    
    if (activeTab === "sales") {
      if (!salesData) {
        alert("No sales data available to export. Please run the report first.");
        return;
      }
      headers = ["Metric", "Value"];
      rows = [
        ["Total Orders", salesData.total_orders],
        ["Total Revenue", salesData.total_revenue],
        ["Admin Commission", salesData.total_admin_commission],
        ["Vendor Earnings", salesData.total_vendor_earnings]
      ];
    } else if (activeTab === "orders") {
      if (!ordersData || ordersData.length === 0) {
        alert("No order records available to export.");
        return;
      }
      headers = ["Order ID", "Customer", "Email", "Items", "Amount", "Status", "Payment", "Date"];
      rows = ordersData.map(o => [
        o.order_id, 
        o.customer_name, 
        o.customer_email, 
        o.items_count, 
        o.total_amount, 
        o.status, 
        o.payment_method, 
        o.date
      ]);
    } else if (activeTab === "products") {
      if (!productsData || productsData.length === 0) {
        alert("No product performance data available.");
        return;
      }
      headers = ["Product Name", "Vendor Name", "Units Sold", "Total Revenue"];
      rows = productsData.map(p => [
        p.product_name, 
        p.vendor_name, 
        p.units_sold, 
        p.total_revenue
      ]);
    } else if (activeTab === "customers") {
      if (!customersData || customersData.length === 0) {
        alert("No customer insight data available.");
        return;
      }
      headers = ["Customer Name", "Total Orders", "Total Spending"];
      rows = customersData.map(c => [
        c.customer_name, 
        c.total_orders, 
        c.total_spending
      ]);
    }
    
    if (headers.length === 0) return;
    
    // Process rows into CSV format, escaping commas
    const csvRows = [
      headers.join(','),
      ...rows.map(row => 
        row.map(value => {
          const stringValue = String(value ?? "");
          // Escape quotes and wrap in quotes if there's a comma
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "sales", label: "Financial Overview", icon: LineChartIcon },
    { id: "orders", label: "Order Records", icon: ShoppingBagIcon },
    { id: "products", label: "Product Performance", icon: BoxIcon },
    { id: "customers", label: "Customer Insights", icon: UsersIcon },
  ];

  const formatCurrency = (num) => {
    return "Rs. " + (num || 0).toLocaleString();
  };

  return (
    <AdminLayout currentPage="reports">
      <div className="w-full space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive reports for platform revenue and performance</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
                onClick={handleExport}
                className="h-11 px-6 bg-accent text-white font-semibold text-sm rounded-xl flex items-center gap-2 hover:bg-[#EA580C] shadow-md shadow-accent/10 transition-all hover:scale-[1.02] active:scale-95 border-none cursor-pointer outline-none"
            >
                <DownloadIcon size={18} /> Download Report
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 hover:bg-white transition-colors focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent flex-1 md:max-w-xs overflow-hidden">
                <SearchIcon className="w-4 h-4 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Search context..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder-gray-400"
                />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
                <DateRangePicker 
                    start={dateRange.start}
                    end={dateRange.end}
                    onStartChange={(val) => setDateRange({...dateRange, start: val})}
                    onEndChange={(val) => setDateRange({...dateRange, end: val})}
                    onClear={() => setDateRange({ start: "", end: "" })}
                />
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
                            activeTab === tab.id 
                            ? "border-accent text-accent" 
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-accent" : "text-gray-400"}`} />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>

        {/* Dynamic Content */}
        {loading ? (
             <div className="w-full h-64 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm">
                <Loader2Icon className="w-8 h-8 text-accent animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-500">Generating analytical models...</p>
            </div>
        ) : (
            <div className="animate-fade-in space-y-6">
                
                {/* SALES/FINANCIAL REPORT */}
                {activeTab === "sales" && salesData && (
                    <div className="space-y-6">
                        {/* Summary Metrics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Revenue</p>
                                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.total_revenue)}</h3>
                            </div>
                            <div className="bg-white flex flex-col justify-between border-l-4 border-l-accent border border-gray-200 rounded-xl p-5 shadow-sm">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Net Commission (5%)</p>
                                <h3 className="text-2xl font-bold text-accent">{formatCurrency(salesData.total_admin_commission)}</h3>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Vendor Earnings</p>
                                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.total_vendor_earnings)}</h3>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Orders</p>
                                <h3 className="text-2xl font-bold text-gray-900">{salesData.total_orders}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Revenue Chart */}
                            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="mb-6">
                                    <h3 className="text-base font-bold text-gray-900">Revenue Trajectory</h3>
                                    <p className="text-xs text-gray-500 mt-1">Platform gross merchandise value vs standard commission trend</p>
                                </div>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={salesData.revenue_trend || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `Rs. ${val.toLocaleString()}`} />
                                            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Legend verticalAlign="top" height={36} iconType="circle"/>
                                            <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                            <Area type="monotone" dataKey="commission" name="Commission Yield" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCommission)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Top Vendors Table */}
                            <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
                                <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                                    <TrendingUpIcon className="w-5 h-5 text-accent" />
                                    <h3 className="text-base font-bold text-gray-900">Top Vendors</h3>
                                </div>
                                <div className="p-0 flex-1 overflow-y-auto max-h-[320px] custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <tbody>
                                            {salesData.top_vendors?.map((vendor, i) => (
                                                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <span className="text-sm font-semibold text-gray-900 block">{vendor.name}</span>
                                                        <span className="text-xs text-gray-500 font-medium">{vendor.orders} Orders processed</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span className="text-sm font-bold text-gray-900">{formatCurrency(vendor.revenue)}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!salesData.top_vendors || salesData.top_vendors.length === 0) && (
                                                <tr>
                                                    <td colSpan="2" className="px-5 py-8 text-center text-sm text-gray-500">No vendor performance data.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DETAILED TABLES (Orders, Products, Customers) */}
                {["orders", "products", "customers"].includes(activeTab) && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-200">
                                        {activeTab === "orders" && (
                                            <>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 flex items-center gap-1 cursor-pointer hover:bg-gray-100">Order ID <ArrowUpDownIcon className="w-3 h-3 text-gray-400" /></th>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600">Customer</th>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 text-center">Items</th>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600">Total</th>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600">Status</th>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600">Date</th>
                                            </>
                                        )}
                                        {activeTab === "products" && (
                                            <>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600">Product Name</th>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600">Vendor</th>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 text-center">Units Sold</th>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 text-right">Revenue</th>
                                            </>
                                        )}
                                        {activeTab === "customers" && (
                                            <>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600">Customer Details</th>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 text-center">Total Orders</th>
                                                <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 text-right">Total Spent</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {activeTab === "orders" && ordersData.map((order) => (
                                        <tr key={order.order_id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-5 py-4 text-sm font-semibold text-gray-900">{order.order_id}</td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                                                <p className="text-xs text-gray-500">{order.customer_email}</p>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-600 text-center font-medium">{order.items_count}</td>
                                            <td className="px-5 py-4 text-sm font-bold text-gray-900">{formatCurrency(order.total_amount)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-500">{order.date}</td>
                                        </tr>
                                    ))}
                                    {activeTab === "orders" && ordersData.length === 0 && (
                                        <tr><td colSpan="6" className="px-5 py-12 text-center text-sm text-gray-500">No orders found matching filters.</td></tr>
                                    )}

                                    {activeTab === "products" && productsData.map((product, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-gray-900">{product.product_name}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-accent/10 text-accent text-xs font-medium border border-accent/20">
                                                    {product.vendor_name}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm font-bold text-gray-700 text-center">{product.units_sold}</td>
                                            <td className="px-5 py-4 text-sm font-bold text-gray-900 text-right">{formatCurrency(product.total_revenue)}</td>
                                        </tr>
                                    ))}
                                    {activeTab === "products" && productsData.length === 0 && (
                                        <tr><td colSpan="4" className="px-5 py-12 text-center text-sm text-gray-500">No product data available.</td></tr>
                                    )}

                                    {activeTab === "customers" && customersData.map((customer, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-5 py-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs uppercase">
                                                    {customer.customer_name?.charAt(0)}
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">{customer.customer_name}</p>
                                            </td>
                                            <td className="px-5 py-4 text-sm font-bold text-gray-700 text-center">{customer.total_orders}</td>
                                            <td className="px-5 py-4 text-sm font-bold text-gray-900 text-right">{formatCurrency(customer.total_spending)}</td>
                                        </tr>
                                    ))}
                                    {activeTab === "customers" && customersData.length === 0 && (
                                        <tr><td colSpan="3" className="px-5 py-12 text-center text-sm text-gray-500">No customer records found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                            {/* Pagination Mock Area */}
                            {["orders", "products", "customers"].includes(activeTab) && (
                                <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-white text-sm">
                                    <span className="text-gray-500">Showing 1 to 10 of 50 entries</span>
                                    <div className="flex gap-1">
                                        <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer">Prev</button>
                                        <button className="px-3 py-1 border border-accent bg-accent/10 text-accent rounded font-medium cursor-pointer">1</button>
                                        <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 cursor-pointer">2</button>
                                        <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 cursor-pointer">Next</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Helper badge styles
const getStatusStyle = (status) => {
  const s = (status || "").toLowerCase();
  if (s === 'delivered') return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  if (s === 'pending') return 'bg-amber-100 text-amber-800 border border-amber-200';
  if (s === 'canceled' || s === 'cancelled') return 'bg-rose-100 text-rose-800 border border-rose-200';
  if (s === 'processing') return 'bg-blue-100 text-blue-800 border border-blue-200';
  return 'bg-gray-100 text-gray-800 border border-gray-200';
};
