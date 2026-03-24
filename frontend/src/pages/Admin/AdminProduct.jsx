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
      <div className="w-full space-y-8 animate-fade-in pb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Global Products</h1>
            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[3px] leading-none">Comprehensive inventory control across the platform</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                <LayersIcon className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                  {loading ? "..." : products.length} SKUs Listed
                </span>
             </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col lg:flex-row items-center gap-4 shadow-sm">
            <div className="flex-1 w-full relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, partner, or SKU..." 
                    className="w-full h-11 pl-11 pr-4 bg-[#F5F5F5] border border-gray-100 rounded text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-accent/5 focus:bg-white focus:border-accent transition-all placeholder:text-gray-300"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none min-w-[180px]">
                    <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full h-11 pl-11 pr-10 bg-[#F5F5F5] border border-gray-100 rounded text-[10px] font-black text-gray-900 uppercase tracking-widest outline-none appearance-none hover:bg-white transition-all cursor-pointer"
                    >
                        <option value="all">Categories</option>
                        <option value="football">Football</option>
                        <option value="basketball">Basketball</option>
                        <option value="cycling">Cycling</option>
                        <option value="swimming">Swimming</option>
                        <option value="tennis">Tennis</option>
                        <option value="running">Running</option>
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button 
                  onClick={fetchProducts}
                  className="h-11 w-11 flex items-center justify-center bg-white border border-gray-200 rounded hover:bg-gray-50 transition-all text-gray-400 hover:text-accent cursor-pointer"
                >
                  <Loader2Icon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] text-left bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-5 font-black border-b border-gray-100">Product Specification</th>
                            <th className="px-8 py-5 font-black border-b border-gray-100">Partner</th>
                            <th className="px-8 py-5 font-black border-b border-gray-100">Price</th>
                            <th className="px-8 py-5 font-black border-b border-gray-100 text-center">Stock</th>
                            <th className="px-8 py-5 font-black border-b border-gray-100">Status</th>
                            <th className="px-8 py-5 font-black border-b border-gray-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
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
                                <tr key={product.id} className="group hover:bg-gray-50/50 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white rounded overflow-hidden shadow-sm border border-gray-100 group-hover:scale-105 transition-transform">
                                                {product.image ? (
                                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                    <PackageIcon className="w-6 h-6 text-gray-200" />
                                                  </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 tracking-tight leading-none text-xs uppercase">{product.name}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <TagIcon className="w-3 h-3 text-accent/50" />
                                                    <p className="text-[9px] font-black text-accent uppercase tracking-widest">{product.category}</p>
                                                    <span className="text-gray-200 text-[8px]">•</span>
                                                    <p className="text-[9px] font-black text-gray-400 tracking-tighter uppercase">ID: {product.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight leading-none">{product.vendor.storeName}</span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">{product.vendor.owner}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-gray-900 tracking-tight uppercase">Rs. {product.price.toLocaleString()}</span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">Market Price</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded ${product.quantity === 0 ? 'bg-rose-50' : 'bg-gray-50'} border border-transparent`}>
                                            <BoxIcon className={`w-3.5 h-3.5 ${product.quantity === 0 ? 'text-rose-400' : 'text-gray-400'}`} />
                                            <span className={`text-[10px] font-black ${product.quantity === 0 ? 'text-rose-600' : 'text-gray-900'}`}>{product.quantity}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 bg-white border text-[9px] font-black uppercase tracking-widest shadow-sm rounded ${getStatusBadge(product)}`}>
                                            {getStatusLabel(product)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button 
                                              onClick={() => window.open(`/product/${product.id}`, '_blank')}
                                              className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-100 rounded transition-all shadow-sm text-gray-400 hover:text-gray-900 cursor-pointer"
                                            >
                                                <EyeIcon className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-100 rounded transition-all shadow-sm text-gray-400 hover:text-accent cursor-pointer">
                                                <Edit2Icon className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                              onClick={() => handleDelete(product.id)}
                                              className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-100 rounded transition-all shadow-sm text-gray-400 hover:text-rose-500 cursor-pointer"
                                            >
                                                <Trash2Icon className="w-3.5 h-3.5" />
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
              <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Global Catalog Sync: Active</p>
                  <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                            Available: {products.filter(p => p.is_active && p.quantity > 0).length}
                          </span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
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
