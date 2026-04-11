import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, Edit2Icon, Trash2Icon, PackageIcon, SearchIcon, Loader2Icon } from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import api from "../../api";

export function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("vendor/products/");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`vendor/products/delete/${productId}/`);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      const response = await api.post(`vendor/products/toggle-status/${productId}/`);
      setProducts(products.map((p) => 
        p.id === productId ? { ...p, is_active: response.data.is_active } : p
      ));
    } catch (err) {
      console.error("Error toggling product status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <VendorLayout currentPage="products">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
            <p className="text-sm text-gray-500 font-medium">Manage your products and stock ({products.length} items)</p>
          </div>
          
          <Link to="/vendor/AddProduct">
            <button className="h-11 px-6 bg-accent text-white font-semibold text-sm rounded-xl flex items-center gap-2 hover:bg-[#EA580C] shadow-md shadow-accent/10 transition-all hover:scale-[1.02] active:scale-95 border-none cursor-pointer">
              <PlusIcon size={18} /> Add New Product
            </button>
          </Link>
        </div>

        {/* Global Search */}
        <div className="relative group max-w-md">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
            <input 
                type="text" 
                placeholder="Search products by name or category..." 
                className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <Loader2Icon className="w-10 h-10 text-accent animate-spin mb-4" />
             <p className="text-sm text-gray-500 font-medium">Fetching inventory data...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <PackageIcon className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">
              {searchQuery ? "No products match your search criteria." : "You haven't added any products to your inventory yet."}
            </p>
            {!searchQuery && (
                <Link to="/vendor/AddProduct">
                    <button className="text-sm font-bold text-accent hover:underline">Create your first product →</button>
                </Link>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price & Stock</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PackageIcon size={20} className="text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900 group-hover:text-accent transition-colors">{product.name}</span>
                              <span className="text-xs font-medium text-gray-500 mt-0.5">{product.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
                            <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                              product.quantity === 0 ? "text-rose-600" : 
                              product.quantity < 5 ? "text-amber-500" : 
                              "text-emerald-500"
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                product.quantity === 0 ? "bg-rose-600" : 
                                product.quantity < 5 ? "bg-amber-500" : 
                                "bg-emerald-500"
                              }`} />
                              {product.quantity === 0 ? "Out of Stock" : `Stock: ${product.quantity}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <button 
                            onClick={() => handleToggleStatus(product.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              product.is_active 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                          >
                            {product.is_active ? "Live" : "Hidden"}
                          </button>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/vendor/edit-product/${product.id}`)}
                              className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit2Icon size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2Icon size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        )}
      </div>
    </VendorLayout>
  );
}
