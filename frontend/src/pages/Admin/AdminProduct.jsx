import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  FilterIcon,
  Trash2Icon,
  PackageIcon,
  StoreIcon,
  TagIcon,
  BoxIcon,
  ChevronDownIcon,
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
    if (!product.is_active) return "bg-rose-100 text-rose-800 border border-rose-200";
    if (product.quantity === 0) return "bg-amber-100 text-amber-800 border border-amber-200";
    return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  };

  const getStatusLabel = (product) => {
    if (!product.is_active) return "Deactivated";
    if (product.quantity === 0) return "Depleted";
    return "Active";
  };

  return (
    <AdminLayout currentPage="products">
      <div className="w-full space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Global Products</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive inventory control across the platform</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                <LayersIcon className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-gray-700">
                  {loading ? "..." : products.length} SKUs Listed
                </span>
             </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row items-center gap-4 shadow-sm">
            <div className="flex-1 w-full relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, vendor, or SKU..." 
                    className="w-full h-10 pl-10 pr-4 bg-gray-50 hover:bg-white border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder-gray-400"
                />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none min-w-[180px]">
                    <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full h-10 pl-10 pr-10 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 outline-none appearance-none transition-all cursor-pointer hover:border-gray-400"
                    >
                        <option value="all">All Categories</option>
                        <option value="football">Football</option>
                        <option value="basketball">Basketball</option>
                        <option value="cycling">Cycling</option>
                        <option value="swimming">Swimming</option>
                        <option value="tennis">Tennis</option>
                        <option value="running">Running</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button 
                  onClick={fetchProducts}
                  className="h-10 w-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg transition-colors text-gray-500 cursor-pointer hover:bg-gray-50 hover:text-gray-700 active:scale-95"
                >
                  <Loader2Icon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-gray-50/80 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Product Specification</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Vendor</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Price</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 text-center">Stock</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                             <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                    <Loader2Icon className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
                                    <p>Loading products...</p>
                                </td>
                             </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircleIcon className="w-8 h-8 text-rose-400" />
                                        <p className="text-sm font-medium text-rose-600">{error}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                            <PackageIcon className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">No matching assets found.</p>
                                        <p className="text-xs text-gray-500">Try adjusting your filters or search terms.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className="group hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 shadow-sm border border-gray-200 overflow-hidden group-hover:shadow transition-all">
                                                {product.image ? (
                                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                    <PackageIcon className="w-5 h-5 text-gray-300" />
                                                  </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm max-w-[200px] truncate" title={product.name}>{product.name}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <TagIcon className="w-3 h-3 text-gray-400" />
                                                    <p className="text-xs font-medium text-gray-500">{product.category}</p>
                                                    <span className="text-gray-300 text-xs">•</span>
                                                    <p className="text-xs text-gray-400">ID: {product.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <StoreIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 leading-tight truncate max-w-[120px]">{product.vendor.storeName}</span>
                                                <span className="text-[10px] text-gray-500 uppercase">Vendor</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
                                            <span className="text-xs text-gray-500 mt-0.5">Market Price</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${product.quantity === 0 ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-700'}`}>
                                            <BoxIcon className={`w-3.5 h-3.5 ${product.quantity === 0 ? 'text-rose-400' : 'text-gray-400'}`} />
                                            <span>{product.quantity} units</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full items-center ${getStatusBadge(product)}`}>
                                            {getStatusLabel(product)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button 
                                              onClick={() => handleDelete(product.id)}
                                              className="w-8 h-8 flex flex-shrink-0 items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm transition-colors hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 focus:ring-2 focus:ring-rose-200 cursor-pointer text-gray-500"
                                              title="Delete Product"
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
            
            {/* Pagination Footer */}
            {!loading && !error && filteredProducts.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-white text-sm">
                    <span className="text-gray-500">Showing {filteredProducts.length} items</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer font-medium">Prev</button>
                        <button className="px-3 py-1.5 border border-accent bg-accent/10 text-accent rounded-md font-semibold cursor-pointer">1</button>
                        <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 cursor-pointer font-medium disabled:opacity-50">Next</button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
