import React, { useState, useEffect } from "react";
import {
  TrendingUpIcon,
  ShoppingBagIcon,
  CalendarIcon,
  ChevronDownIcon,
  BarChart3Icon,
  PieChartIcon,
  Loader2Icon,
  BoxIcon,
  IndianRupeeIcon,
  SearchIcon,
  ArrowRightIcon,
  DownloadIcon,
} from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import api from "../../api";

const RsIcon = ({ className }) => (
  <span className={`font-black tracking-tighter ${className}`}>Rs</span>
);

export function VendorReportsPage() {
  const [activeTab, setActiveTab] = useState("sales");
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const [salesData, setSalesData] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab, fromDate, toDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { from_date: fromDate, to_date: toDate };
      
      if (activeTab === "sales") {
        const response = await api.get("vendor/reports/sales/", { params });
        setSalesData(response.data);
      } else if (activeTab === "orders") {
        const response = await api.get("vendor/reports/orders/", { params });
        setOrdersData(response.data);
      } else if (activeTab === "products") {
        const response = await api.get("vendor/reports/products/", { params });
        setProductsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    let dataToExport = [];
    let filename = `vendor_report_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    
    if (activeTab === "sales" && salesData) {
      dataToExport = [
        ["Metric", "Value"],
        ["Total Orders", salesData.total_orders],
        ["Total Revenue", salesData.total_revenue],
        ["Your Earnings", salesData.total_earnings],
        ["Admin Commission", salesData.total_commission]
      ];
    } else if (activeTab === "orders") {
      dataToExport = [
        ["Order ID", "Customer", "Items", "Amount", "Status", "Payment", "Date"],
        ...ordersData.map(o => [o.order_id, o.customer, o.items_count, o.total_price, o.status, o.payment_method, o.date])
      ];
    } else if (activeTab === "products") {
      dataToExport = [
        ["Product Name", "Units Sold", "Total Revenue"],
        ...productsData.map(p => [p.product_name, p.units_sold, p.total_revenue])
      ];
    }
    
    if (dataToExport.length === 0) return;
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + dataToExport.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: "sales", label: "Sales Report", icon: TrendingUpIcon },
    { id: "orders", label: "Order Details", icon: ShoppingBagIcon },
    { id: "products", label: "Product Performance", icon: BoxIcon },
  ];

  return (
    <VendorLayout currentPage="reports">
      <div className="w-full space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Vendor Intelligence</h1>
            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[3px] leading-none">Personalized analytics and performance vectors</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                    <input 
                        type="date" 
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent"
                    />
                    <ArrowRightIcon className="w-3 h-3 text-gray-300" />
                    <input 
                        type="date" 
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent"
                    />
                </div>
            </div>

            <button 
                onClick={handleExport}
                className="h-11 px-6 bg-white border border-gray-200 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded transition-all hover:bg-gray-50 active:scale-95 flex items-center gap-2 shadow-sm"
            >
                <DownloadIcon className="w-4 h-4" />
                Export CSV
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-gray-100/50 border border-gray-200 rounded-xl w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab.id 
                        ? "bg-white text-gray-900 shadow-sm" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? "text-accent" : "text-gray-400"}`} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Dynamic Content */}
        {loading ? (
             <div className="w-full h-[40vh] flex flex-col items-center justify-center">
                <Loader2Icon className="w-12 h-12 text-accent animate-spin mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Processing performance data...</p>
            </div>
        ) : (
            <div className="animate-fade-in">
                {activeTab === "sales" && salesData && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <MetricCard title="Total Orders" value={salesData.total_orders} icon={ShoppingBagIcon} />
                            <MetricCard title="Total Revenue" value={`Rs. ${salesData.total_revenue.toLocaleString()}`} icon={IndianRupeeIcon} highlight />
                            <MetricCard title="Your Earnings" value={`Rs. ${salesData.total_earnings.toLocaleString()}`} icon={TrendingUpIcon} color="text-accent" />
                            <MetricCard title="Admin Commission" value={`Rs. ${salesData.total_commission.toLocaleString()}`} icon={BarChart3Icon} />
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                                    <PieChartIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 tracking-tight uppercase">Economic Breakdown</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Net distribution of successful transactions</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6 max-w-2xl">
                                <ProgressBar label="Vendor Share (95%)" value={95} color="bg-accent" />
                                <ProgressBar label="Platform Fee (5%)" value={5} color="bg-gray-200" />
                            </div>
                            
                            <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-accent mt-1 flex-shrink-0 animate-pulse" />
                                <p className="text-[10px] font-black text-gray-600 leading-relaxed uppercase tracking-tight">
                                    Intelligence Insight: Your net contribution to platform liquidity is currenty at {((salesData.total_earnings / (salesData.total_revenue || 1)) * 100).toFixed(1)}%. Maintain high fulfilment rates to sustain this equity.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Items</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordersData.map((order) => (
                                        <tr key={order.order_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-[10px] font-black text-gray-900 uppercase tracking-tighter">{order.order_id}</td>
                                            <td className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-tight">{order.customer}</td>
                                            <td className="px-6 py-4 text-[10px] font-black text-gray-600 text-center">{order.items_count}</td>
                                            <td className="px-6 py-4 text-[10px] font-black text-gray-900 uppercase tracking-tighter">Rs. {order.total_price.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">{order.payment_method}</td>
                                            <td className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.date}</td>
                                        </tr>
                                    ))}
                                    {ordersData.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-20 text-center">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">No matching order vectors found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "products" && (
                     <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Entity</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Units Aggregated</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Revenue Generated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productsData.map((product, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{product.product_name}</span>
                                                    <span className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">Inventory Item</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-black text-gray-600 text-center">{product.units_sold}</td>
                                            <td className="px-6 py-4 text-[10px] font-black text-gray-900 text-right uppercase tracking-tighter">Rs. {product.total_revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {productsData.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-20 text-center">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">No performance metrics detectable</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </VendorLayout>
  );
}

function MetricCard({ title, value, icon: Icon, color = "text-gray-400", highlight = false }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all hover:shadow-md ${highlight ? 'border-accent/30' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[2px]">{title}</p>
      </div>
      <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
    </div>
  );
}

function ProgressBar({ label, value, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[8px] font-black text-gray-400 uppercase tracking-[2px]">{label}</span>
        <span className="text-[10px] font-black text-gray-900">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

const getStatusStyle = (status) => {
  const s = (status || "").toLowerCase();
  if (s === 'delivered') return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
  if (s === 'pending') return 'bg-amber-50 text-amber-600 border border-amber-100';
  if (s === 'canceled' || s === 'cancelled') return 'bg-red-50 text-red-600 border border-red-100';
  if (s === 'processing') return 'bg-blue-50 text-blue-600 border border-blue-100';
  return 'bg-gray-50 text-gray-600 border border-gray-100';
};
