import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  FilterIcon,
  EyeIcon,
  Trash2Icon,
  Edit2Icon,
  PackageIcon,
  StoreIcon,
  TagIcon,
  BoxIcon,
  ChevronDownIcon,
  MoreVerticalIcon,
  LayersIcon,
  Loader2Icon,
  AlertCircleIcon
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api";

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('admin/products/list/');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching catalog:", err);
      setError("Failed to synchronize with global catalog stream.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you certain you want to purge this SKU from the platform? This action is irreversible.")) return;
    
    try {
      await api.delete(`admin/products/delete/${productId}/`);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      alert("Directive failed: Unable to purge asset.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(product.sku || product.id).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category_slug.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (product) => {
    if (!product.is_active) return "bg-rose-50 text-rose-600 border-rose-100";
    if (product.quantity === 0) return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  const getStatusLabel = (product) => {
    if (!product.is_active) return "DEACTIVATED";
    if (product.quantity === 0) return "DEPLETED";
    return "ACTIVE";
  };

  return (
    <AdminLayout currentPage="products">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Global Catalog</h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-[2px] leading-none">Comprehensive inventory control across all network nodes</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <LayersIcon className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                  {loading ? "..." : products.length} Registered SKU's
                </span>
             </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="dashboard-card p-4 flex flex-col lg:flex-row items-center gap-4">
            <div className="flex-1 w-full relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by product name, retail partner, or SKU..." 
                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none min-w-[180px]">
                    <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full h-12 pl-12 pr-10 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-600 uppercase tracking-widest outline-none appearance-none hover:bg-white transition-all cursor-pointer shadow-sm"
                    >
                        <option value="all">Categories</option>
                        <option value="football">Football</option>
                        <option value="basketball">Basketball</option>
                        <option value="cycling">Cycling</option>
                        <option value="swimming">Swimming</option>
                        <option value="tennis">Tennis</option>
                        <option value="running">Running</option>
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <button 
                  onClick={fetchProducts}
                  className="h-12 w-12 flex items-center justify-center bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-slate-400 hover:text-indigo-500 cursor-pointer"
                >
                  <Loader2Icon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        {/* Inventory Table */}
        <div className="dashboard-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-left bg-slate-50/50">
                        <tr>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Product Specification</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Retail Partner</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Valuation</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50 text-center">Stock Node</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50">Status</th>
                            <th className="px-8 py-5 font-black border-b border-slate-100/50 text-right">Directives</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                             <tr>
                                <td colSpan="6" className="px-8 py-20 text-center">
                                    <Loader2Icon className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Synchronizing Assets...</p>
                                </td>
                             </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <AlertCircleIcon className="w-10 h-10 text-rose-300" />
                                        <p className="text-xs font-black text-rose-500 uppercase tracking-widest">{error}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                            <PackageIcon className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No matching assets found in catalog</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                                                {product.image ? (
                                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                                    <PackageIcon className="w-6 h-6 text-slate-200" />
                                                  </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 tracking-tight leading-none text-sm">{product.name}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <TagIcon className="w-3 h-3 text-indigo-400" />
                                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{product.category}</p>
                                                    <span className="text-slate-200">•</span>
                                                    <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">#{product.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{product.vendor.storeName}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{product.vendor.owner}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-800 tracking-tight">Rs. {product.price.toLocaleString()}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Market Value</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${product.quantity === 0 ? 'bg-rose-50' : 'bg-slate-50'} border border-transparent`}>
                                            <BoxIcon className={`w-3.5 h-3.5 ${product.quantity === 0 ? 'text-rose-400' : 'text-slate-400'}`} />
                                            <span className={`text-xs font-black ${product.quantity === 0 ? 'text-rose-600' : 'text-slate-700'}`}>{product.quantity}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusBadge(product)}`}>
                                            {getStatusLabel(product)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button 
                                              onClick={() => window.open(`/product/${product.id}`, '_blank')}
                                              className="w-9 h-9 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm text-slate-400 hover:text-indigo-500 border-none cursor-pointer"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button className="w-9 h-9 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm text-slate-400 hover:text-amber-500 border-none cursor-pointer">
                                                <Edit2Icon className="w-4 h-4" />
                                            </button>
                                            <button 
                                              onClick={() => handleDelete(product.id)}
                                              className="w-9 h-9 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm text-slate-400 hover:text-rose-500 border-none cursor-pointer"
                                            >
                                                <Trash2Icon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Table Footer */}
            {!loading && !error && (
              <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100/50 flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-bold">Catalog Stream: Live Sync</p>
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            Available: {products.filter(p => p.is_active && p.quantity > 0).length}
                          </span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            Suspended/Depleted: {products.filter(p => !p.is_active || p.quantity === 0).length}
                          </span>
                      </div>
                  </div>
              </div>
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
