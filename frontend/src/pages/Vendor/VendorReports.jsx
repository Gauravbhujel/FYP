import React, { useState, useEffect } from "react";
import { 
  CalendarIcon, 
  DownloadIcon, 
  TrendingUpIcon, 
  PackageIcon, 
  ShoppingBagIcon, 
  UsersIcon,
  FilterIcon,
  ChevronDownIcon,
  Loader2Icon,
  BarChart3Icon
} from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { DateRangePicker } from "../../components/dashboard/DateRangePicker";
import api from "../../api";

export const VendorReportsPage = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "sales", label: "Sales", icon: TrendingUpIcon },
    { id: "orders", label: "Orders", icon: ShoppingBagIcon },
    { id: "products", label: "Products", icon: PackageIcon },
  ];

  useEffect(() => {
    fetchReportData();
  }, [activeTab, dateRange.start, dateRange.end]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const endpoint = `vendor/reports/${activeTab}/?from_date=${dateRange.start}&to_date=${dateRange.end}`;
      const response = await api.get(endpoint);
      setReportData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!Array.isArray(reportData) || reportData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headers = Object.keys(reportData[0]);
    const csvContent = [
      headers.join(","), 
      ...reportData.map(row => 
        headers.map(fieldName => {
          let value = row[fieldName];
          if (typeof value === 'string') {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value === null || value === undefined ? "" : value;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `store_${activeTab}_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <VendorLayout currentPage="reports">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-500 font-medium">View your store's sales and performance data</p>
          </div>
          
          <button 
            onClick={handleExport}
            className="h-11 px-6 bg-accent text-white font-semibold text-sm rounded-xl flex items-center gap-2 hover:bg-[#EA580C] shadow-md shadow-accent/10 transition-all hover:scale-[1.02] active:scale-95 border-none cursor-pointer"
          >
            <DownloadIcon size={18} /> Download Report
          </button>
        </div>

        {/* Intelligence Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden">
             <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <FilterIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-tight whitespace-nowrap">Select Dates</span>
                </div>
                
                <DateRangePicker 
                    start={dateRange.start}
                    end={dateRange.end}
                    onStartChange={(val) => setDateRange({...dateRange, start: val})}
                    onEndChange={(val) => setDateRange({...dateRange, end: val})}
                    onClear={() => setDateRange({ start: "", end: "" })}
                />
             </div>
        </div>

        {/* Tab System */}
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-accent shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Report Registry */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {Array.isArray(reportData) && reportData.length > 0 && Object.keys(reportData[0]).map((header) => (
                    <th key={header} className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {header.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-sans">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-32 text-center">
                      <Loader2Icon className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-400">Loading records...</p>
                    </td>
                  </tr>
                ) : !Array.isArray(reportData) || reportData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-32 text-center text-sm font-medium text-gray-400">
                      No records found for these dates.
                    </td>
                  </tr>
                ) : (
                  reportData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-6 py-5 text-sm font-semibold text-gray-700">
                          {typeof val === 'number' && val > 100 ? val.toLocaleString() : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </VendorLayout>
  );
};
